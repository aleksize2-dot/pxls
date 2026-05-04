import { Telegraf, Markup } from 'telegraf'
import { parseEnv, PACKAGES } from '@pxls/config'

const env = parseEnv()
const bot = new Telegraf(env.TG_BOT_TOKEN)

bot.start(async (ctx) => {
  const ref = ctx.payload // referral code
  const webAppUrl = 'https://t.me/pxlesbot/app'

  await ctx.reply(
    '✨ <b>PXLS — AI Image & Video Generator</b>\n\n'
    + 'Генерируй изображения и видео с помощью нейросетей прямо в Telegram.\n\n'
    + `🎁 Бонус: ${30} PX за регистрацию\n`
    + (ref ? `👥 Вас пригласил пользователь!\n` : ''),
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
  const lines = PACKAGES.map(p =>
    `${p.name}: ${p.stars} ⭐ → ${p.credits} PX${p.isPopular ? ' 🔥' : ''}`
  )
  await ctx.reply(
    '💰 <b>Пакеты кредитов</b>\n\n' + lines.join('\n'),
    { parse_mode: 'HTML' }
  )
})

// Handle Telegram Stars purchase confirmation
bot.on('pre_checkout_query', async (ctx) => {
  await ctx.answerPreCheckoutQuery(true)
})

bot.on('successful_payment', async (ctx) => {
  const { payload, total_amount } = ctx.message.successful_payment
  // TODO: update user credits in DB
  await ctx.reply(`✅ Оплачено ${total_amount} ⭐! Кредиты зачислены.`)
})

console.log('🤖 PXLS Bot starting...')
bot.launch().then(() => console.log('✅ Bot online!'))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
