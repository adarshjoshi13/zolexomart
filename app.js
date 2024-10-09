const express = require('express')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { Connection, MailInfo } = require('./modals/index')
const app = express()

const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    res.render('index', {
        message: 'You are amazing! 🌟', // Cute message to display
    });
});

app.post('/send-mail', async (req, res) => {
    let Transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "adarshjoshi132005@gmail.com",
            pass: "crvm achh awcy etzj"
        }
    })

    let MailOption = {
        from: 'adarshjoshi132005@gmail.com',
        to: 'info@zolexomart.in',
        subject: 'Hi! New Customer Query',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #0056b3;">New Customer Query</h2>
            
            <p>Here are the details of the customer:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Customer Name</th>
                    <td style="padding: 8px;">${req.body.userName}</td>
                </tr>
                <tr>
                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Email</th>
                    <td style="padding: 8px;">${req.body.userEmail}</td>
                </tr>
                <tr>
                    <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Phone Number</th>
                    <td style="padding: 8px;">${req.body.userPhone}</td>
                </tr>
            </table>
            
            <h3 style="color: #0056b3; margin-top: 30px;">Customer's Query:</h3>
            <p style="font-size: 16px; padding: 12px; background-color: #f9f9f9; border-left: 4px solid #0056b3;">
                ${req.body.userMessage}
            </p>
            
            <p style="margin-top: 30px;">Thank you!</p>
        </div>
    `
    }

    Transporter.sendMail(MailOption)
        .then(async (info) => {
            if (info.accepted) {
                // await MailInfo.create({
                //     full_name: req.body.userName,
                //     mobile: req.body.userPhone,
                //     email: req.body.userEmail,
                //     query: req.body.userMessage,
                // })

                // return res.status(200).json({ msg: `Email sent successfully to ${info.accepted} with OTP `, success: true, applicantmail: info.accepted })
                return res.redirect(req.headers.referer)
            }
        })
        .catch((err) => {
            return res.status(500).json({ ERROR: err })
        })


})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
