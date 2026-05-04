import { Telegraf, Markup } from 'telegraf'
import { parseEnv, PACKAGES, SIGNUP_BONUS } from '@pxls/config'
import { supabase } from './supabase.js'

const env = parseEnv()
const bot = new Telegraf(env.TG_BOT_TOKEN)

bot.start(async (ctx) => {
  const ref = ctx.payload // referral code
  // Use ngrok tunnel in dev, or TMA deep link in prod
const webAppUrl = env.NGROK_URL || 'https://t.me/pxlesbot/app'

  // Upsert user in Supabase
  const { id: telegram_id, username, first_name, last_name } = ctx.from

  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, credits')
    .eq('telegram_id', telegram_id)
    .single()

  if (!existingUser) {
    // New user
    let referrer_id = null
    if (ref && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ref)) {
      const { data: referrer } = await supabase.from('users').select('id').eq('id', ref).single()
      if (referrer) {
        referrer_id = referrer.id
      }
    }

    const { data: newUser, error } = await supabase.from('users').insert({
      telegram_id,
      username,
      first_name,
      last_name,
      credits: SIGNUP_BONUS,
      referrer_id,
    }).select().single()

    if (error) {
      console.error('Error creating user:', error)
    } else {
      console.log(`New user created: ${telegram_id} with ${SIGNUP_BONUS} PX`)
      if (referrer_id && newUser) {
        // Create referral record
        await supabase.from('referrals').insert({
          referrer_id,
          referred_id: newUser.id,
          referred_username: username || first_name,
        })
      }
    }
  }

  await ctx.reply(
    '✨ <b>PXLS — AI Image & Video Generator</b>\n\n'
    + 'Генерируй изображения и видео с помощью нейросетей прямо в Telegram.\n\n'
    + `🎁 Бонус: ${SIGNUP_BONUS} PX за регистрацию\n`
    + (ref && !existingUser ? `👥 Вас пригласил пользователь!\n` : ''),
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Открыть PXLS', web_app: { url: webAppUrl } }],
          [{ text: '💰 Купить кредиты', callback_data: 'packages' }],
        ],
      },
    }
  )
})

bot.action('packages', async (ctx) => {
  const buttons = PACKAGES.map((p, index) => {
    return [{ text: `${p.name} — ${p.stars} ⭐`, callback_data: `buy_pkg_${index}` }]
  })
  
  await ctx.editMessageText(
    '💰 <b>Выберите пакет кредитов:</b>\n\n(1 ⭐ = 6 PX)',
    {
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: buttons }
    }
  ).catch(() => {})
  
  await ctx.answerCbQuery()
})

// Generate purchase callbacks for each package
PACKAGES.forEach((pkg, index) => {
  bot.action(`buy_pkg_${index}`, async (ctx) => {
    await ctx.replyWithInvoice({
      title: pkg.name,
      description: `Покупка ${pkg.credits} PX (Stars)`,
      payload: `pkg_${index}`,
      provider_token: '', // empty for Telegram Stars
      currency: 'XTR',
      prices: [{ label: pkg.name, amount: pkg.stars }],
    })
    await ctx.answerCbQuery()
  })
})

// Handle Telegram Stars purchase confirmation
bot.on('pre_checkout_query', async (ctx) => {
  await ctx.answerPreCheckoutQuery(true)
})

bot.on('successful_payment', async (ctx) => {
  const { invoice_payload: payload, total_amount } = ctx.message.successful_payment
  const telegram_id = ctx.from.id

  if (payload.startsWith('pkg_')) {
    const pkgIndex = parseInt(payload.replace('pkg_', ''), 10)
    const pkg = PACKAGES[pkgIndex]

    if (pkg) {
      // Find user
      const { data: user } = await supabase
        .from('users')
        .select('id, credits')
        .eq('telegram_id', telegram_id)
        .single()

      if (user) {
        // Update credits
        const newCredits = user.credits + pkg.credits
        await supabase
          .from('users')
          .update({ credits: newCredits })
          .eq('id', user.id)

        // Log transaction
        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'purchase',
          stars_amount: total_amount,
          credits_amount: pkg.credits,
          package_name: pkg.name,
          description: `Bought ${pkg.name} for ${total_amount} Stars`
        })

        await ctx.reply(`✅ Оплачено ${total_amount} ⭐! ${pkg.credits} PX зачислены.`)
        return
      }
    }
  }

  await ctx.reply(`❌ Ошибка начисления кредитов. Пожалуйста, обратитесь в поддержку.`)
})

// Supabase Realtime Listener for completed generations
supabase
  .channel('generations-status')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'generations',
      filter: 'status=eq.done',
    },
    async (payload) => {
      const gen = payload.new
      if (gen && gen.user_id && gen.result_urls && gen.result_urls.length > 0) {
        const { data: user } = await supabase
          .from('users')
          .select('telegram_id')
          .eq('id', gen.user_id)
          .single()

        if (user && user.telegram_id) {
          try {
            const resultUrl = gen.result_urls[0]
            if (gen.model_type === 'text-to-image' || gen.model_type === 'tools') {
              await bot.telegram.sendPhoto(user.telegram_id, resultUrl, {
                caption: `✅ Твоё изображение готово!\nПромпт: <i>${gen.prompt}</i>`,
                parse_mode: 'HTML'
              })
            } else if (gen.model_type === 'image-to-video') {
              await bot.telegram.sendVideo(user.telegram_id, resultUrl, {
                caption: `🎬 Твоё видео готово!\nПромпт: <i>${gen.prompt}</i>`,
                parse_mode: 'HTML'
              })
            }
          } catch (err) {
            console.error('Failed to send notification to', user.telegram_id, err)
          }
        }
      }
    }
  )
  .subscribe()

console.log('🤖 PXLS Bot starting...')
bot.launch().then(() => console.log('✅ Bot online!'))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
