const express = require('express');
const nodemailer = require('nodemailer');
const { MailInfo, Queries } = require('../models/index');
const path = require('path');
const url = require('url');
const Razorpay = require('razorpay');
require('dotenv').config();

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


router.post('/pay', async (req, res) => {
    try {
        const { userName, userEmail, userPayment, userPhone, userMessage } = req.body;

        // Create Razorpay order
        const options = {
            amount: userPayment * 100, // Amount in smallest currency unit (e.g., 5000 paise for 50 INR)
            currency: 'INR',
            receipt: `receipt_order_${Math.random() * 1000000}`,
            payment_capture: 1, // Auto-capture payment after authorization
        };

        const order = await razorpay.orders.create(options);

        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            userName,
            userEmail,
            userPhone,
            userMessage,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/send-quote', async (req, res) => {
    console.log(req.body, "query data");

    // Extract the relevant fields from the request body
    const { name, lname, phone, email, service, package, message } = req.body;
    const query = {
        fullname: name + lname,
        phone: phone,
        email: email,
        service: service,
        package: package,
        message: message,
    }
    try {
        // Create a new record in the Queries table
        const newQuery = await Queries.create(query);

        // If successful, send a response
        return res.redirect('/')
    } catch (err) {
        console.error('Error saving query:', err);
        return res.status(500).json({ error: 'Failed to submit query' });
    }
});

router.post('/send-mail/:recipientEmail', async (req, res) => {
    const recipientList = (req.params.recipientEmail == 'info@zolexomart.in' ? req.params.recipientEmail : ['info@zolexomart.in', req.params.recipientEmail])


    const referer = req.headers.referer || '/';
    const parsedUrl = url.parse(referer, true);
    const redirectBase = `${parsedUrl.protocol}//${parsedUrl.host}`;

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
                from: 'khanmohdfaisal1985@gmail.com',
                to: recipientList,
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
                        console.log('Mail sent successfully');
                        return res.redirect(redirectBase);
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
