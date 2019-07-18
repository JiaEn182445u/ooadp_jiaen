const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const payment = require('../models/payment');
const wishlist = require('../models/wishlist');
const user = require('../models/CUser');
const ensureAuthenticated = require('../helpers/auth');
const moment = require('moment');
// const connection=require('../config/DBConfig');
const shopIt = require('../models/shopitem');
// const shopIt= require('../models/shopp.csv');
const Feedback = require('../models/Feedback');
const cart = require('../models/cart');
const orderd = require('../models/order_detail');
const ejs=require('ejs');
const paypal=require('paypal-rest-sdk');

// app.set('view engine','ejs');

// paypal.configure({
// 	'mode': 'sandbox', //sandbox or live
// 	'client_id': 'AWNDfGzIVFdXEgO2XQKlYhl_-BsivrCx5voCIP3i-5Msorq_HZACSUOf5ZueqSJS0gyyPhCi97SHWO1f',
// 	'client_secret': 'EHy_2Z0BGK19YIdeL5D7WbHvlrwmpaiW0_WzvGG3JUfcytLuOkpUd_X4MTHvP4MDfVMosc_hRApyA5w_'
//   });

//   router.post('/pay', (req, res) => {
// 	const create_payment_json = {
// 		"intent": "sale",
// 		"payer": {
// 			"payment_method": "paypal"
// 		},
// 		"redirect_urls": {
// 			"return_url": "http://localhost:5000/",
// 			"cancel_url": "http://localhost:5000/"
// 		},
// 		"transactions": [{
// 			"item_list": {
// 				"items": [{
// 					"name": "item",
					
// 					"price": "1.00",
// 					"currency": "SGD",
// 					"quantity": 1
// 				}]
// 			},
// 			"amount": {
// 				"currency": "SGD",
// 				"total": "1.00"
// 			},
// 			"description": "This is the payment description."
// 		}]
// 	};

	
// });

router.get('/payment', (req, res) => {
	res.render('shoppingg/payment')
});


router.get('/shop', (req, res) => {
	// res.render('shoppingg/shop') 
	shopIt.findAll({ // retrieves all videos using the userId defined in the where object in ascending order by title.
	})
		.then((shopp) => {
			res.render('shoppingg/shop', { //passing the videos object to display all the videos retrieved.
				shopp: shopp
			});
		})
		.catch(err => console.log(err));

});

// router.get('/oneitem/:id',(req,res)=>{
// 	var id=req.param.id;

// 			  res.render('shoppingg/oneitem')
// })

router.get('/oneitem/:id', (req, res) => {
	let id = req.param.id;
	shopIt.findOne({ where: { id: req.params.id } })

		.then((shopp) => {
			console.log("it runnnnnnnnnnnnn");
			res.render('shoppingg/oneitem', { //passing the videos object to display all the videos retrieved.

				shopp
			});
		})


})



router.get('/cartfull', (req, res) => {
	// res.render('shoppingg/shop') 
	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			//include: [shopIt,user]
			include:[{
				model: shopIt ,as: "shopp",
				required:true
			   }]
		})
		.then((cart) => {
			res.render('shoppingg/cartfull', { //passing the videos object to display all the videos retrieved.
				cart: cart
				//   shopp:shopp
			});
		})


})
// 	shopIt.findAll({ 
// 		where: {
// 			itemid: req.cart.itemid
// 		        }
// 	})
// 		  .then((shopp) 
// 		  => { 
// 			  res.render('shoppingg/cartfull', { //passing the videos object to display all the videos retrieved.

// 				  cart:cart,
// 				//   shopp:shopp
// 			  });
// 		  }))


// })

// router.put('/cartPartial',(req,res)=>{
// 	// res.render('shoppingg/shop') 
// cart.findAll({ 
// 	where: {
// 		CuserId: req.user.id
// 	}
// 	// where: { id : req.params.id} 
// 	// retrieves all videos using the userId defined in the where object in ascending order by title.
// })
// 	  .then((cart) => { 
// 		  res.render('partials/_cart', { //passing the videos object to display all the videos retrieved.

// 			  cart:cart
// 		  });
// 	  })
// 	  .catch(err => console.log(err));

// })

router.get('/deletecart/:id', ensureAuthenticated, (req, res) => {
	var cartid = req.params.id;
	cart.findOne({
		where: {
			id: cartid
		}
	}).then((cart) => {

		if (cart.CuserId === req.user.id) {
			cart.destroy({
				where: {
					id: cartid
				}
			}).then((cart) => {
				// For icons to use, go to https://glyphsearch.com/
				alertMessage(res, 'success', 'Video ID ' + cartid + ' successfully deleted.', 'fa fa-hand-peace-o', true);
				res.redirect('/');
			}).catch(err => console.log(err));
		} else {
			// Video does not belong to the current user
			alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
			req.logout();
			res.redirect('/');
		}
	})
});

router.get('/wishlist', (req, res) => {
	let id = req.param.id;
	wishlist.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include:[{
				model: shopIt ,as: "shopp",
				required:true
			   }]
		})

		.then((wish) => {
			console.log("it runnnnnnnnnnnnn");
			res.render('shoppingg/wishlist'
				, {
					wish: wish
				}
			);
		})


})



router.get('/addtowishlist/:id', (req, res) => {
	//let { itemid } = req.body;
	// if (wishlist.findOne){
	// 	error.push({ text: 'Password must be at least 4 characters' });
	// }
	wishlist.findOne({ where: { itemid: req.params.id} })
	.then(wishlistt => {
		if (wishlistt) {
			res.redirect('/');
		}
		else{
		shopIt.findOne({ where: { id: req.params.id } })
			.then((shopp) => {
				let itemid = shopp.id;
				let CuserId = req.user.id;
				wishlist.create({
					itemid,
					CuserId
				}).then((wishlist) => {
					res.redirect('/');
				})
			})}
})});

router.get('/deletewishlist/:id', ensureAuthenticated, (req, res) => {
	var wishid = req.params.id;
	wishlist.findOne({
		where: {
			id: wishid
		}
	}).then((wish) => {

		if (wish.CuserId === req.user.id) {
			wishlist.destroy({
				where: {
					id: wishid
				}
			}).then((wish) => {
				// For icons to use, go to https://glyphsearch.com/
				alertMessage(res, 'success', 'Video ID ' + wishid + ' successfully deleted.', 'fa fa-hand-peace-o', true);
				res.redirect('/');
			}).catch(err => console.log(err));
		} else {
			// Video does not belong to the current user
			alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
			req.logout();
			res.redirect('/');
		}
	})
});


// function get_oneitem(id){
// 	//for(i = 0; i < shopp.length; i++){
// 	//if(id==i){
// 		router.get('/oneitem/:id',(req,res)=>{
// 			shopIt.findOne({ 	where: { id: req.param.id }
// 				// retrieves all videos using the userId defined in the where object in ascending order by title.
// 			})

// 				  .then((shopp) => { 
// 					  res.render('shoppingg/oneitem', { //passing the videos object to display all the videos retrieved.

// 						  shopp:shopp
// 					  });
// 				  })


// 					})

// 	}
// 	//}


router.post('/paymentdone', (req, res) => {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let datetime = date+' '+time;
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
		datetime,
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
	}).then((paymentt) => {
		//for(i=0; i<cart.length ; i++ ){
	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			
			// ,
			// include:[{
			// 	model: shopIt ,as: "shopp",
			// 	required:true
			//    }]
		})
		.then((cartt) => { 
		//console.log(cartt[0]);
			//while(cartt.CuserId==req.user.id){
				// if(cart.length>0){
				// 	console.log("helllo");
				 	//while(cartt.length>0){
				// 	console.log("looking to see if it work hahahaha");
			// for (i = 0; i < cartt.length; i++){
			// 	console.log(i);
			// 	console.log("narutoooooo mwhaha");
			for(i=0;i<cartt.length;i++){
			//if(cartt.CuserId==req.user.id){
				console.log(cartt.itemid);
			//while(cartt.CuserId==req.user.id){
				// for (i = 0; i < cartt.length; i++){
				// 	console.log("1");
			//if(cartt.CuserId==req.user.id){
			let itemid =cartt[i].itemid;
			let orderid=paymentt.id;
			orderd.create({
				itemid,
				orderid
			})
			cartt[i].destroy
			(
				//{where:{CuserId:req.user.id}}
			)
		}
	//}
			//}
// 	}
// }
	//}
			
			res.redirect('/'); 
	})
})});


router.get('/addtocart/:id', (req, res) => {
	console.log("saving carttttttttttttttttttt");
	shopIt.findOne({ where: { id: req.params.id } })
		.then((shopp) => {
			console.log("it runnnnnnnnnnnnn");
			let itemid = shopp.id;
			let CuserId = req.user.id;
			cart.create({
				itemid,
				CuserId
			}).then((cart) => {
				res.redirect('/');
			})
		})


	// for( c in shopIt){

	// 	console.log(shopIt);
	// 	console.log("stoppppppppppppppppppppppppppppppppp");
	// 	console.log('saving cart 11111111');
	// 	if(c.id==itemId){
	// 		console.log("saving cart 22222222222");
	// shopIt.findAll({ // retrieves all videos using the userId defined in the where object in ascending order by title.
	// })
	// 	  .then((shopp) => { 

	// 		  if (shopp.id==itemId)
	// 		  {
	// 			let name = shopp.name;
	// 			let price = shopp.price;
	// 			cart.create({
	// 				itemId,
	// 				name,
	// 				price
	// 			}).then((cart)=>{
	// 					res.redirect('/');
	// 				})
	// 		  res.redirect('/');}
	// 	  })
	//res.redirect('/');
	// let name = req.c.name;
	// let price = req.c.price;
	// cart.create({
	// 	itemId,
	// 	name,
	// 	price

	// }).then((cart) => {
	// 	res.redirect('/');
	// })

	// Multi-value components return array of strings or undefined


});

// router.post('/addtocart/:id', (req, res) => {
//     let itemId=req.param.id;
// 	console.log("saving carttttttttttttttttttt");
// 	let name = req.body.name;
// 	let price = req.body.price;
// 	cart.create({
// 		itemId,
// 		name,
// 		price

// 	}).then((cart) => {
// 		res.redirect('/');
// 	})

// });



module.exports = router;