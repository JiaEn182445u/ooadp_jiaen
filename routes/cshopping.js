const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const payment = require('../models/payment');
const ensureAuthenticated = require('../helpers/auth');
const moment = require('moment');




router.get('/payment',(req,res)=>{
	res.render('shoppingg/payment') 
})
router.get('/shop',(req,res)=>{
	res.render('shoppingg/shop') 
})

router.post('/paymentdone', (req, res) => {
	// let emailfeedback = req.user.email;
	let payname = req.body.payname;
	let paycontact = req.body.paycontact;
	let payemail = req.body.payemail;
	let payaddress = req.body.payaddress;
	let paypostalC = req.body.paypostalC;
	let CorCC = req.body.CorCC.toString();
	let CCType = req.body.CCType.toString();
	let cardname = req.body.cardname;
	let cardnumber = req.body.cardnumber;
	let expiry = req.body.expiry;
	let scode = req.body.scode;

    let CuserId = req.user.id;
    // Multi-value components return array of strings or undefined
    payment.create({
		payname,
		paycontact,
		payemail,
		payaddress,
		paypostalC,
		CorCC,
		CCType,
		cardname,
		cardnumber,
		expiry,
		scode,
		CuserId
    }).then((payment) => {
        res.redirect('/');
    })
    
});


module.exports = router;