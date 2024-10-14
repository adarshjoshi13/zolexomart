const express = require('express')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { Connection, MailInfo } = require('./modals/index');
const { data } = require('./data');
const app = express()


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

const PORT = process.env.PORT || 3000;

// Home route
app.get('/', (req, res) => {
    const BusinessNeeds = [
        { title: 'Support brand value', imgSrc: './img/icons/Support-Brand-Value.webp', description: 'Digital marketing firms assist your company in expanding its reach and making your offerings stand out in a competitive market.' },
        { title: 'Boost user relationships', imgSrc: './img/icons/Boost-User-Relationship.png', description: 'Our analytics helps to dig out the crucial and concise user needs and help you target the potential audience on the receiving end.' },
        { title: 'Drive more traffic', imgSrc: './img/icons/Web-Traffic.webp', description: 'Digital marketing company helps to propel multiple cross-channel business opportunities to enable exceptional user experience.' },
        { title: 'Stay on top', imgSrc: './img/icons/Stay-On-Top.webp', description: 'These marketing services allow you to use multiple channels with a consistent funnel to check for seamless connectivity.' },
        { title: 'Increase in competition', imgSrc: './img/icons/Increase-in-competition.webp', description: 'Digital marketing experts help small to mid-sized enterprises to compete head-to-head with multinational firms.' },
        { title: 'Improve conversion rates', imgSrc: './img/icons/Improve-conversion-rate.webp', description: 'Attract numerous leads, businesses, conversions, opportunities, and users to your brand products and services.' }
      ]
    
    res.render('index', { Services: data, businessNeeds: BusinessNeeds });
});
//celebrity route
app.get('/celebrity-endorsement', (req, res) => {
    res.render('celebrity-endorsement');
});
//contact route
app.get('/contact', (req, res) => {
    res.render('contact');
});
//about route
app.get('/about', (req, res) => {
    res.render('about');
});
//blog route
app.get('/blog', (req, res) => {
    res.render('blog');
});
// Service route
app.get('/service/:id', (req, res) => {
    const ServiceId = req.params.id - 1
    const selectedService = data[ServiceId]
    const allServices = data
    res.render('service', { service: selectedService, services: allServices });

});


app.post('/send-mail', async (req, res) => {
    let Transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, // You can switch to 465 if you prefer
        secure: false, // true for 465, false for 587
        auth: {
            user: "adarsh@zolexomart.com",
            pass: "xsen wxdq njfn zkvj"
        },
        tls: {
            rejectUnauthorized: false, // Add this for STARTTLS
        }
    });


    // Verify connection configuration
    Transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            return res.status(500).json({ ERROR: error });
        } else {
            console.log("Server is ready to take our messages");

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
                        return res.status(200).json({ msg: `Email sent successfully to ${info.accepted}`, success: true });
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
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
