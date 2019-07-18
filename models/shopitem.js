const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const shopp = db.define('shopp', {
    idshopp: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    price:{
        type: Sequelize.STRING
    },
    itemid:{
        type: Sequelize.STRING
    }
});
module.exports = shopp;