const express = require('express');
const nodemailer = require('nodemailer');
const { MailInfo } = require('../models/index');
const path = require('path');
require('dotenv').config();

const router = express.Router();

router.post('/send-mail', async (req, res) => {
    console.log(req.body)

    let Transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "khanmohdfaisal1985@gmail.com",
            pass: "ieepdgpnfdqulogm"
        }
    });

    // Verify connection configuration
    Transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            return res.status(500).json({ ERROR: error });
        } else {

            let MailOption = {
                from: 'adarsh@zolexomart.com',
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
            };

            Transporter.sendMail(MailOption)
                .then(async (info) => {
                    if (info.accepted) {
                        try {
                            await MailInfo.create({
                                full_name: req.body.userName,
                                email: req.body.userEmail,
                                mobile: req.body.userPhone,
                                query: req.body.userMessage
                            });
                            console.log('Data saved to the database successfully');
                        } catch (dbError) {
                            console.log('Database Error:', dbError);
                            return res.status(500).json({ ERROR: 'Failed to save data to database' });
                        }

                        return res.redirect('/'); 
                    }
                })
                .catch((err) => {
                    console.log('Error Found:', err);
                    return res.status(500).json({ ERROR: err });
                });
        }
    });
});

router.post('/to-download-companypdf', (req, res) => {
    const filePath = path.join(__dirname, '../ZolexoMartDocs.zip');
    res.download(filePath, 'ZolexoMartDocs.zip', (err) => {
        if (err) {
            console.error('Error downloading the file:', err);
            res.status(500).send('Internal Server Error');
        } 
    });
});

module.exports = router;
