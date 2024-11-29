const express = require('express')
const { Services } = require('../models/index');
const axios = require('axios');
const entities = require('entities')
require('dotenv').config();

const router = express.Router();

// Home route
router.get('/', async (req, res) => {

    const BusinessNeeds = [
        { title: 'Support brand value', imgSrc: './img/icons/Support-Brand-Value.webp', description: 'Digital marketing firms assist your company in expanding its reach and making your offerings stand out in a competitive market.' },
        { title: 'Boost user relationships', imgSrc: './img/icons/Boost-User-Relationship.png', description: 'Our analytics helps to dig out the crucial and concise user needs and help you target the potential audience on the receiving end.' },
        { title: 'Drive more traffic', imgSrc: './img/icons/Web-Traffic.webp', description: 'Digital marketing company helps to propel multiple cross-channel business opportunities to enable exceptional user experience.' },
        { title: 'Stay on top', imgSrc: './img/icons/Stay-On-Top.webp', description: 'These marketing services allow you to use multiple channels with a consistent funnel to check for seamless connectivity.' },
        { title: 'Increase in competition', imgSrc: './img/icons/Increase-in-competition.webp', description: 'Digital marketing experts help small to mid-sized enterprises to compete head-to-head with multinational firms.' },
        { title: 'Improve conversion rates', imgSrc: './img/icons/Improve-conversion-rate.webp', description: 'Attract numerous leads, businesses, conversions, opportunities, and users to your brand products and services.' }
    ]

    const response = await axios.get('https://public-api.wordpress.com/wp/v2/sites/zolexomartforblog.wordpress.com/posts', {
        params: {
            per_page: 6,
            page: 1
        }
    });

    const posts = response.data;

    res.render('index', { businessNeeds: BusinessNeeds, posts: posts });
});

// Service route
router.get('/service/:id/:route', async (req, res) => {
    try {

        const { id } = req.params;

        const ServiceBenefitsIcons = ['/img/icons/graph.png', '/img/icons/liability.png', '/img/icons/reach.png']

        const OurServices = await Services.findAll({
            attributes: ['id', 'serviceName', 'route'],
            where: {
                status: 1
            },
            limit: 6,
            order: [['createdAt', 'DESC']],
            raw: true
        });

        const Service = await Services.findByPk(id, { raw: true });

        if (!Service) {
            return res.status(404).send('Service not found');
        }

        Service.details = JSON.parse(Service.details);
        Service.cards = JSON.parse(Service.cards);
        Service.benefits = JSON.parse(Service.benefits);
        Service.faq = JSON.parse(Service.faq);
        Service.seo = JSON.parse(Service.seo);
        Service.ourApproach = JSON.parse(Service.ourApproach);
        Service.userFriendly = JSON.parse(Service.userFriendly);
        Service.seo.keywordsPlanner = Service.seo.keywordsPlanner.split(',').map(keyword => keyword.trim());

        // console.log(Service, "this is the service")

        res.render('service', { Service, OurServices, ServiceBenefitsIcons });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).send('Internal Server Error');
    }
});

//contact route
router.get('/contact', (req, res) => {
    res.render('contact');
});

//about route
router.get('/about', (req, res) => {
    res.render('about');
});

//All Services
router.get('/view-all-services', (req, res) => {
    res.render('allServices');
});

//Pay now
router.get('/paynow', (req, res) => {
    res.render('paynow');
});

//small-business-websites 
router.get('/small-business-websites', (req, res) => {
    res.render('packages/websites/small-business.pug');
});

//business-websites 
router.get('/business-websites', (req, res) => {
    res.render('packages/websites/business.pug');
});

//e-commerce-websites 
router.get('/e-commerce', (req, res) => {
    res.render('packages/websites/e-commerce.pug');
});

//city-digital-seo
router.get('/city-digital-seo', (req, res) => {
    res.render('city-digital-seo');
});

//digital-booster-package 
router.get('/digital-growth-package', (req, res) => {
    res.render('packages/digital-growth.pug');
});

//send Query
router.get('/send-query', (req, res) => {
    res.render('send-query');
});

//city-wise-seo
router.get('/city-wise-seo', (req, res) => {
    res.render('packages/seo/city-wise.pug');
});

//domestic-seo
router.get('/domestic-seo', (req, res) => {
    res.render('packages/seo/domestic.pug');
});

// Add a new route for the blog
router.get('/blogs', async (req, res) => {
    try {
        const response = await axios.get('https://public-api.wordpress.com/wp/v2/sites/zolexomartforblog.wordpress.com/posts');
        const posts = response.data;

        posts.forEach(post => {
            post.title.rendered = entities.decodeHTML(post.title.rendered);
            post.content.rendered = entities.decodeHTML(post.content.rendered);
        });


        res.render('blogs', { posts });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).send('Unable to fetch blog posts.');
    }
});

router.get('/blog/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const siteName = 'zolexomartforblog.wordpress.com'; // Replace with your WordPress site name
        const response = await axios.get(`https://public-api.wordpress.com/wp/v2/sites/${siteName}/posts/${blogId}`);

        const post = response.data; // Get the specific blog post

        // Decode HTML entities in the title and content
        post.title.rendered = entities.decodeHTML(post.title.rendered);
        post.content.rendered = entities.decodeHTML(post.content.rendered);
        post.excerpt.rendered = entities.decodeHTML(post.excerpt.rendered);

        console.log('Blog post details:', JSON.stringify(post, null, 2));

        res.render('blog', { post: post });
    } catch (error) {
        console.error('Error fetching the blog post:', error.response?.data || error.message);
        res.status(500).send('Unable to fetch the blog post.');
    }
});


module.exports = router;
