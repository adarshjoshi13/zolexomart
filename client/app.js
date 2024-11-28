const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const axios = require('axios'); // Import Axios
const ApiRoutes = require('./src/routes/api');
const HomeRoutes = require('./src/routes/home');
const { Connection, Services } = require('./src/models');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
    try {
        const HomePageServices = await Services.findAll({
            raw: true,
            where: { status: 1 },
            attributes: ['id', 'serviceName', 'subImageUrl', 'mainImageUrl', 'subDescription', 'route'],
        });

        // Make the services available in all views
        res.locals.Services = HomePageServices;
        next();
    } catch (error) {
        console.error('Error fetching services:', error);
        next(error);
    }
});

app.use('/', HomeRoutes);
app.use('/api', ApiRoutes);

// Add a new route for the blog
app.get('/blog', async (req, res) => {
    try {
        const response = await axios.get('https://public-api.wordpress.com/wp/v2/sites/zolexomartforblog.wordpress.com/posts');
        const posts = response.data; // Get blog posts

        // console.log('check posts', JSON.stringify(posts, null, 2));

        res.render('blog', { posts: posts });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).send('Unable to fetch blog posts.');
    }
});

// Add a new route for the blog
app.get('/blog/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const siteName = 'zolexomartforblog.wordpress.com'; // Replace with your WordPress site name
        const response = await axios.get(`https://public-api.wordpress.com/wp/v2/sites/${siteName}/posts/${blogId}`);
        
        const post = response.data; // Get the specific blog post

        // console.log('Blog post details:', JSON.stringify(post, null, 2));

        res.render('specific-blog.pug', { post: post });
    } catch (error) {
        console.error('Error fetching the blog post:', error.response?.data || error.message);
        res.status(500).send('Unable to fetch the blog post.');
    }
});


// Start the server
Connection().then(() => {
    try {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (err) {
        next(err);
    }
});
