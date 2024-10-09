const data = [
    {
        id: 1,
        serviceName: 'Verified Quality Buyers Generation',
        subImage: '/img/verified-quality-buyers-sub.jpg',
        subDescription: 'Verified buyers help streamline your sales and improve conversion rates.',
        Image: '/img/verified-quality-buyers.jpg',
        description1: `Connecting with the right buyers is essential for success in today's competitive market.`,
        description2: `Our verified buyers are pre-screened to ensure quality and boost your sales.`,
        card: {
            CardOne: {
                img: '/img/card1.jpg',
                name: 'Verified Leads',
                desc: 'Access top-quality leads that have been thoroughly vetted.'
            },
            CardTwo: {
                img: '/img/card2.jpg',
                name: 'Higher Conversion',
                desc: 'Increase your chances of conversion with verified buyers.'
            },
            CardThree: {
                img: '/img/card3.jpg',
                name: 'Dedicated Support',
                desc: 'Our team is here to support you in every step of the process.'
            }
        },
        benefitsOfService: {
            description: 'Why choose our Verified Buyers Generation service?',
            points: {
                one: 'Higher chances of sales conversions.',
                two: 'Pre-screened and quality buyers.',
                three: 'Increased trust and credibility.',
                four: 'Save time on lead generation.'
            }
        },
        faq: {
            description: 'Frequently Asked Questions about Verified Buyers Generation',
            QA: {
                first: {
                    question: 'What is a verified buyer?',
                    answer: 'A verified buyer is someone who has been pre-screened and authenticated to ensure quality.'
                },
                second: {
                    question: 'How do you verify buyers?',
                    answer: 'We use multiple screening methods, including background checks and industry certifications.'
                },
                third: {
                    question: 'How will this help my business?',
                    answer: 'Verified buyers reduce the risk of bad leads and improve conversion rates.'
                }
            }
        }
    },
    {
        id: 2,
        serviceName: 'SEO Service',
        price: '',
        description: `Are you looking to increase your online visibility, attract more qualified leads, and grow your business?`,
        image: '/img/seo-service.jpg' // Add the appropriate image if needed
    },
    {
        id: 3,
        serviceName: 'SMO Service',
        price: '',
        description: `In today's digital landscape, social media is where conversations, connections, and decisions are made.`,
        image: '/img/smo-service.jpg' // Add the appropriate image if needed
    },
    {
        id: 4,
        serviceName: 'Website Development',
        price: '',
        description: `In today's digital-first world, your website is often the first point of contact between your business and potential customers.`,
        image: '/img/website-development.jpg' // Add the appropriate image if needed
    },
    {
        id: 5,
        serviceName: 'Celebrity Endorsement',
        price: '',
        description: `One of the most effective ways to elevate your brand and reach a broader audience is through celebrity endorsement.`,
        image: '/img/celebrity-endorsement.jpg' // Add the appropriate image if needed
    },
    {
        id: 6,
        serviceName: 'GMB SEO',
        price: '',
        description: `Optimize your business listing on Google My Business (GMB) to improve local SEO and visibility.`,
        image: '/img/gmb-seo.jpg' // Add the appropriate image if needed
    }
];

module.exports = { data };
