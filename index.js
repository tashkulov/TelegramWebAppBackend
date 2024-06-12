const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors=require('cors')

const token = '7162104102:AAE2uwb6upTqfRFMLbtFDMGk79rIYSGRUNc';
const webAppUrl = 'https://main--telegramwebsiteforme.netlify.app';
const bot = new TelegramBot(token, { polling: true });
const app=express()

app.use(express.json())
app.use(cors())
bot.on('message', async (msg) => {
    const chatIDd = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatIDd, 'Ниже появится кнопка, заполните форму :)', {
            reply_markup: {
                keyboard: [
                    [{ text: 'Заполнить форму', web_app: { url: webAppUrl + '/form' } }]
                ]
            }
        });

        await bot.sendMessage(chatIDd, 'Заходите в наш интернет-магазин по кнопке ниже', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Сделать заказ^^)', web_app: { url: webAppUrl } }]
                ]
            }
        });
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg.web_app_data.data);
            console.log(data);
            await bot.sendMessage(chatIDd, 'Спасибо за обратную связь!');
            await bot.sendMessage(chatIDd, 'Ваша страна: ' + data.country);
            await bot.sendMessage(chatIDd, 'Ваша улица: ' + data.street);

            setTimeout(async () => {
                await bot.sendMessage(chatIDd, 'Всю информацию вы получите в этом чате');
            }, 3000);
        } catch (e) {
            console.log(e);
        }
    }
});


app.post('/web-data',async (req, res) => {
    const {queryId, products, totalPrice} = req.body
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {message_text: 'Посдравляю с покупкой,вы приобрели товар на сумму ' + totalPrice}
        })
    return res.status(200).json({});
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type:'article',
            id:queryId,
            title:'Не удалось приобрести товар',
            input_message_content:{message_text:'Не удалось приобрести товар' }
        })
        return res.status(500).json({})
    }
})
const PORT=4444;
app.listen(PORT,()=>console.log('server started on port '+ PORT))