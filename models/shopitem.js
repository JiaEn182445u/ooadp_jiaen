const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/

const Form = db.define('form', {
    itemName:{
        type:Sequelize.STRING
    }, 
    price:{
       type:Sequelize.DECIMAL
    },
    itemCode: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING(2000)
    },
    quantity: {
        type: Sequelize.STRING
    },
    referenceNo: {
        type: Sequelize.STRING
    },
    dateofDelivery: {
        type: Sequelize.DATE
    },
    posterURL:{

        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING
    }
});

module.exports = Form;


// const shopp = db.define('shopp', {
//     idshopp: {
//         type: Sequelize.STRING
//     },
//     name: {
//         type: Sequelize.STRING
//     },
//     price:{
//         type: Sequelize.STRING
//     },
//     itemid:{
//         type: Sequelize.STRING
//     }
// });
// module.exports = shopp;