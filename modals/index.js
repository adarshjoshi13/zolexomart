const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
});

const MailInfo = require('./mailInfo')(sequelize, Sequelize);
const Services = require('./services')(sequelize, Sequelize);

const Connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected');

        sequelize.sync()
            .then(() => {
                console.log('Modals synchronized');
            })
            .catch((err) => {
                console.error('Error syncing modals:', err);
            });

    } catch (error) {
        console.error('MySQL database connection error:', error);
    }
};

module.exports = { Connection, MailInfo, Services };
