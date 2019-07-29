const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const feedback = require('../models/Feedback');
const ensureAuthenticated = require('../helpers/auth');
const moment = require('moment');
const fs = require('fs');
const upload = require('../helpers/imageUpload');
const user=require('../models/CUser');
const orderd = require('../models/order_detail');
const shopIt = require('../models/shopitem');


router.get('/messageemail',(req,res)=>{
    orderlist=[];
    orderd.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include: [{
                
                model: shopIt, as: "form",
                //model:user, as: "cuser",
				required: true
			}]
		})
		.then((order) => {
            orderlist.push(order);
            console.log(orderlist);
	res.render('customerfeedback/messageemail', { //passing the videos object to display all the videos retrieved.
        order: order
        //   shopp:shopp) 
})
})
});

router.post('/messageemailsend',ensureAuthenticated, (req, res) => {
	// let emailfeedback = req.user.email;
    let emailfeedback = req.body.emailfeedback;
    let rate=req.body.rate.toString();
    let Message= req.body.Message;
    let DropdownPorS = req.body.PorS.toString();
    
    let DropdownSType=req.body.DropdownSType;
    let imageurl=req.body.posterURL;

    let CuserId = req.user.id;
    if(DropdownPorS=="Product"){
        let productcode=req.body.productcode;
    
    // Multi-value components return array of strings or undefined
    feedback.create({
		emailfeedback,
        DropdownPorS,
        productcode,
		DropdownSType,
        Message,
        imageurl,
        rate,
        CuserId
    }).then((feedback) => {
        res.redirect('/');
    })}
    else{
        feedback.create({
            emailfeedback,
            DropdownPorS,
            DropdownSType,
            Message,
            imageurl,
            rate,
            CuserId
        })
        .then((feedback) => {
            res.redirect('/');
        })
    }
   
});


router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    console.log("222222222222222222222222222222222222222222222222222");
    if (!fs.existsSync('./public/feedbackP/' + req.user.id)) {
        fs.mkdirSync('./public/feedbackP/' + req.user.id);
        console.log("upload testinggggggggggggggggggggggggggggggggggggggggggggggg");
    }

    upload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/no-image.jpg', err: err });
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                res.json({ file: `/feedbackP/${req.user.id}/${req.file.filename}` });
            }
        }
    });
})

module.exports = router;