const mySQLDB = require('./DBConfig');
const user = require('../models/CUser');
const feedback = require('../models/Feedback');
const payment = require('../models/payment');
const cart = require('../models/cart');
const wishlist = require('../models/wishlist');
const shopp = require('../models/shopitem');
const orderd = require('../models/order_detail');
// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Vidjot database connected');
        })
        .then(() => {
            /*
            Defines the relationship where a user has many videos.
            In this case the primary key from user will be a foreign key
            in video.
            */
        
            user.hasMany(payment);
            
            //user.hasMany(cart);
            user.hasMany(cart, { foreignKey: 'CuserId' });
            cart.belongsTo(user, { foreignKey: 'CuserId' });
            shopp.hasMany(cart, { foreignKey: 'itemid' });
            cart.belongsTo(shopp, { foreignKey: 'itemid' });
            user.hasMany(wishlist, { foreignKey: 'CuserId' });
            wishlist.belongsTo(user, { foreignKey: 'CuserId' });
            shopp.hasMany(wishlist, { foreignKey: 'itemid' });
            wishlist.belongsTo(shopp, { foreignKey: 'itemid' }); 
            user.hasMany(feedback, { foreignKey: 'CuserId' });
            feedback.belongsTo(user, { foreignKey: 'CuserId' });
            user.hasMany(payment, { foreignKey: 'CuserId' });
            payment.belongsTo(user, { foreignKey: 'CuserId' });
            payment.hasMany(orderd, { foreignKey: 'orderid' });
            orderd.belongsTo(payment, { foreignKey: 'orderid' });
            shopp.hasMany(orderd, { foreignKey: 'itemid' });
            orderd.belongsTo(shopp, { foreignKey: 'itemid' });
            
            // shopp.hasMany(, { foreignKey: 'CuserId' });
            // cart.belongsTo(user, { foreignKey: 'CuserId' });

            // connection.query("SELECT * FROM shopp WHERE cart.itemid in shopp.itemid", cart.itemid , function(err, results) {
            //     if (err) {
            //       return console.log(err)
            //     } else {
            //       // always empty
            //       console.log(results);
            //     }
            //   });
           
            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('Create tables if none exists')
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))

};



module.exports = { setUpDB };