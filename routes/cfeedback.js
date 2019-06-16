const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const feedback = require('../models/feedback');
const ensureAuthenticated = require('../helpers/auth');
const moment = require('moment');
const fs = require('fs');
const upload = require('../helpers/imageUpload');



router.get('/messageemail',(req,res)=>{
	res.render('customerfeedback/messageemail') 
})

router.post('/messageemailsend', (req, res) => {
	// let emailfeedback = req.user.email;
    let emailfeedback = req.body.emailfeedback;
    let rate=req.body.rate.toString();
    let Message= req.body.Message;
    let DropdownPorS = req.body.PorS.toString();
    let productcode=req.body.productcode;
    let DropdownSType=req.body.DropdownSType;
    let imageurl=req.body.posterURL;
    let CuserId = req.user.id;
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
    })
    
	.catch(err => console.log(11111111111111111111111111111111111111))
});

// router.post('/upload', ensureAuthenticated, (req, res) => {
//     // Creates user id directory for upload if not exist
//     if (!fs.existsSync('./public/uploads/' + req.user.id)){
//     fs.mkdirSync('./public/uploads/' + req.user.id);
//     }
   
//     upload(req, res, (err) => {
//         console.log(hiiiiiiiiiiiiiiiiii);
//     if (err) {
//     res.json({file: '/img/no-image.jpg', err: err});
//     } else {
//     if (req.file === undefined) {
//     res.json({file: '/img/no-image.jpg', err: err});
//     } else {
//     res.json({file: `/uploads/${req.user.id}/${req.file.filename}`});
//     }
//     }
//     console.log("picccccc");
//     });
//    })
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