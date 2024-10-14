const express = require('express')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { Connection, MailInfo, Services } = require('./modals/index');
const { data } = require('./data');
const app = express()
require('dotenv').config();

const PORT = process.env.PORT || 3000

const corsOptions = {
    // origin: ['119.18.54.60', 'https://zolexomart.in'],  
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    res.render('index', { Services: data });
});

// Service route
app.get('/service/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const OurServices = await Services.findByPk(id, { raw: true });
    const Service = await Services.findByPk(id, { raw: true });

    if (!Service) {
      return res.status(404).send('Service not found');
    }

    Service.details = JSON.parse(Service.details);
    Service.cards = JSON.parse(Service.cards);
    Service.benefits = JSON.parse(Service.benefits);
    Service.faq = JSON.parse(Service.faq);
    console.log(Service, "edit service data")
    
    res.render('service', { Service });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/send-mail', async (req, res) => {

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
                        return res.redirect('/')
                        // return res.status(200).json({ msg: `Email sent successfully to ${info.accepted}`, success: true });
                    }
                })
                .catch((err) => {
                    console.log('Error Found:', err);
                    return res.status(500).json({ ERROR: err });
                });
        }
    });
});

// Start the server
Connection().then(() => {
    try {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (err) {
        next(err);
    }
});
