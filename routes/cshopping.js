const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const paymentt = require('../models/payment');
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
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
//const total=0.00;



router.get('/paymenttype', (req, res) => {
	res.render('shoppingg/typeofpayment')
});

router.get('/paymentcash', (req, res) => {
	res.render('shoppingg/bycash')
});

router.get('/paymentcreditcard', (req, res) => {
	res.render('shoppingg/bycreditcard')
});


router.post('/cashpaymentdone', (req, res) => {
	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include: [{
				model: shopIt, as: "form",
				required: true
			}]

		})
		.then((carttp) => {
			var total=0.00;
			for (i = 0; i < carttp.length; i++) {
				//let quantity=parseInt(cartt[i].form.quantity-parseInt(cartt[i].quantity))
				total+=parseInt(carttp[i].quantity)*parseFloat(carttp[i].form.price);
				console.log("Narutoo forever");}
			
				const Rtotal=total.toFixed(2);
	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let datetime = date + ' ' + time;
	let payname = req.body.payname;
	let paycontact = req.body.paycontact;
	let payemail = req.body.payemail;
	let payaddress = req.body.payaddress;
	let paypostalC = req.body.paypostalC;
	let totalamount=Rtotal;
	let CorCC = "cash";

	let CuserId = req.user.id;
	// Multi-value components return array of strings or undefined
	paymentt.create({
		datetime,
		payname,
		paycontact,
		payemail,
		payaddress,
		paypostalC,
		CorCC,
		totalamount,
		CuserId
	}).then((paymenttt) => {

		cart.findAll(
			{
				where: {
					CuserId: req.user.id
				}
				,
				include: [{
					model: shopIt, as: "form",
					required: true
				}]

			})
			.then((cartt) => {
				var total=0.00;
				for (i = 0; i < cartt.length; i++) {
					let itemid = cartt[i].itemid;
					let orderid = paymenttt.id;
					let oquantity=cartt[i].quantity;
					// var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
					// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
					// let datetime = date + ' ' + time;
					let quantity=parseInt(cartt[i].form.quantity-parseInt(cartt[i].quantity))
					total+=parseInt(cartt[i].quantity)*parseFloat(cartt[i].form.price);
					

					console.log("Narutoo forever");
					console.log(quantity);
					shopIt.update({
						quantity
					},
					{
						where:{
							id:cartt[i].itemid
						}
					});

					const Rtotal=total.toFixed(2);

				//	let insidequantity=parseInt(ShopIt.quantity)-parseInt(cartt[i].quantity);
				//	shopIt.update({insidequantity})
					orderd.create({
						itemid,
						orderid,
						oquantity,
						// datetime,
						CuserId
					})
					cartt[i].destroy
						( 
						)
					shopIt.findAll({
					})
					.then((form) => {
						
						//console.log(form);
						
						for (c = 0; c < cartt.length; c++) {
							for (d = 0; d < form.length; d++) {
							if(cartt[c].itemid==form[d].id){
								console.log(form[d].quantity);
								console.log(cartt[c].quantity);
								let quantity=form[d].quantity-cartt[c].quantity;
								console.log(quantity);
								form[d].update(quantity);
							// console.log(cartt[c]);
							// console.log(cartt[c].orderid);
							//console.log("hiii");
							console.log("naruto");
							// if(shopp[c].id==)
							//console.log(shopp[c].id==order);
							}
						}
					}
						
					})
						//console.log(cartt[i].shopIt.quantity);
						// shopIt.quantity-=oquantity;
						// let quantity=shopIt.quantity;
						// shopIt.update(quantity);
						
				}
				

				res.redirect('/');
			})
		})
	})
});



router.post('/creditcardpaymentdone', (req, res) => {
	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include: [{
				model: shopIt, as: "form",
				required: true
			}]

		})
		.then((carttp) => {
			var total=0.00;
			for (i = 0; i < carttp.length; i++) {
				//let quantity=parseInt(cartt[i].form.quantity-parseInt(cartt[i].quantity))
				total+=parseInt(carttp[i].quantity)*parseFloat(carttp[i].form.price);
				console.log("Narutoo forever");}
			
				const Rtotal=total.toFixed(2);
	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let datetime = date + ' ' + time;
	let payname = req.body.payname;
	let paycontact = req.body.paycontact;
	let payemail = req.body.payemail;
	let payaddress = req.body.payaddress;
	let paypostalC = req.body.paypostalC;
	let totalamount=Rtotal;
	let CorCC = "credit card";
	let CCType=req.body.CCType.toString();
	let CuserId = req.user.id;
	// Multi-value components return array of strings or undefined
	paymentt.create({
		datetime,
		payname,
		paycontact,
		payemail,
		payaddress,
		paypostalC,
		CorCC,
		totalamount,
		CCType,
		CuserId
	}).then((paymenttt) => {

		cart.findAll(
			{
				where: {
					CuserId: req.user.id
				}
				,
				include: [{
					model: shopIt, as: "form",
					required: true
				}]

			})
			.then((cartt) => {
				var total=0.00;
				for (i = 0; i < cartt.length; i++) {
					let itemid = cartt[i].itemid;
					let orderid = paymenttt.id;
					let oquantity=cartt[i].quantity;
					// var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
					// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
					// let datetime = date + ' ' + time;
					let quantity=parseInt(cartt[i].form.quantity-parseInt(cartt[i].quantity))
					total+=parseInt(cartt[i].quantity)*parseFloat(cartt[i].form.price);
					

					console.log("Narutoo forever");
					console.log(quantity);
					shopIt.update({
						quantity
					},
					{
						where:{
							id:cartt[i].itemid
						}
					});

					const Rtotal=total.toFixed(2);

					orderd.create({
						itemid,
						orderid,
						oquantity,
						// datetime,
						CuserId
					})
					cartt[i].destroy
						( 
						)
					shopIt.findAll({
					})
					.then((form) => {
						 
						for (c = 0; c < cartt.length; c++) {
							for (d = 0; d < form.length; d++) {
							if(cartt[c].itemid==form[d].id){
								console.log(form[d].quantity);
								console.log(cartt[c].quantity);
								let quantity=form[d].quantity-cartt[c].quantity;
								console.log(quantity);
								form[d].update(quantity);
						
							}
						}
					}
						
					})
						
				}
				

				res.redirect('/');
			})
		})
	})
});




// router.set('view engine','ejs'); 

paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'AWNDfGzIVFdXEgO2XQKlYhl_-BsivrCx5voCIP3i-5Msorq_HZACSUOf5ZueqSJS0gyyPhCi97SHWO1f',
	'client_secret': 'EHy_2Z0BGK19YIdeL5D7WbHvlrwmpaiW0_WzvGG3JUfcytLuOkpUd_X4MTHvP4MDfVMosc_hRApyA5w_'
});

router.post('/pay', (req, res) => {
	// const total=0;

	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include:[{
				model: shopIt ,as: "form",
				required:true
			   }]
		})
		.then((carttt) => {
			const listhehe=[];
			var total=0.00;
			for (i = 0; i < carttt.length; i++) {
				const items={}
				items["name"]=carttt[i].form.itemName;
				// items["itemid"]=carttt[i].itemid;
				items["currency"]="SGD";
				items["price"]=carttt[i].form.price;
				// items["price"]= carttt[i].form.price;
				items["quantity"]=carttt[i].quantity;
				console.log(carttt[i].quantity);
				total+=parseInt(carttt[i].quantity)*parseFloat(carttt[i].form.price);
				
				// items["name"]=carttt[i].form.name;
				listhehe.push(items);
				
				//transactions.item_list.items.push({itemid: itemid});

				//let cost =parseFloat(carttt[i].shopp.price);
				// total+=cost;
				//console.log(cost);
			}
			
			//const Rtotal=total.toFixed(2);
			
			//console.log(total);
			const Rtotal=total.toFixed(2);
			//console.log(Rtotal);
			//console.log(listhehe); 
			const create_payment_json = {

				//{
					"intent": "sale",
					"payer": {
					  "payment_method": "paypal"
					},
					"transactions": [
					  {
						"amount": {
						  "total": Rtotal,
						  "currency": "SGD",
						  "details": {
							"subtotal": Rtotal,
							//"tax": "0.05",
							// "shipping": "0.03",
							// "handling_fee": "1.00",
							// "shipping_discount": "-1.00",
							// "insurance": "0.01"
						  }
						},
						"description": "The payment transaction description.",
						
						"payment_options": {
						  "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
						},
						"soft_descriptor": "ECHI5786786",
						"item_list": {
						  "items":  listhehe
						//   [
						// 	{
						// 	  //"name": "hat",
							 
						// 	  "quantity": "1",
						// 	  "price": "2.9",
						// 	 // "tax": "0.01",
							  
						// 	  "currency": "SGD"
						// 	}
							//,
							// {
							//   "name": "handbag",
							//   "description": "Black handbag.",
							//   "quantity": "1",
							//   "price": "15",
							//   "tax": "0.02",
							//   "sku": "product34",
							//   "currency": "SGD"
							// }
						 // ]
						//   ,
						//   "shipping_address": {
						// 	"recipient_name": "Brian Robinson",
						// 	"line1": "4th Floor",
						// 	"line2": "Unit #34",
						// 	"city": "San Jose",
						// 	"country_code": "US",
						// 	"postal_code": "95131",
						// 	"phone": "011862212345678",
						// 	"state": "CA"
						//   }
						}
					  }
					],
					"note_to_payer": "Contact us for any questions on your order.",
					"redirect_urls": {
					  "return_url": "http://localhost:5000/shopping/success",
					  "cancel_url": "http://localhost:5000/shopping/cancel"
					}
				  }




				// "intent": "sale",
				// "payer": {
				// 	"payment_method": "paypal"
				// },
				// "redirect_urls": {
				// 	"return_url": "http://localhost:5000/shopping/success",
				// 	"cancel_url": "http://localhost:5000/shopping/cancel"
				// },
				// "transactions": [{
				// 	"item_list":
				// 	{
				// 		"items": [
				// 			{
				// 			  "name": "hat",
				// 			  "description": "Brown hat.",
				// 			  "quantity": "5",
				// 			  "price": "3",
				// 			  "tax": "0.01",
				// 			  "sku": "1",
				// 			  "currency": "USD"
				// 			},
				// 			{
				// 			  "name": "handbag",
				// 			  "description": "Black handbag.",
				// 			  "quantity": "1",
				// 			  "price": "15",
				// 			  "tax": "0.02",
				// 			  "sku": "product34",
				// 			  "currency": "USD"
				// 			}
				// 		  ]





						/*
						"items":// listhehe
							


							// stuff.map((product) => {
							// 	return {
							// 		itemid: product.itemid,
		
							// 		currency: "USD"
		
							// 	}
							// }),
						[{
						 "name": "item",
						 "price": "1.00",
						 "currency": "SGD",
						 "quantity": 1
						}]
						*/
			// 		},
			// 		"amount": {
			// 			"currency": "SGD",
			// 			"total": total
			// 		},
			// 		"description": "This is the payment description."
			// 	}]
			// };
			// console.log(total);
			//console.log(listhehe);
		
			paypal.payment.create(create_payment_json, function (error, payment) {
				if (error) {
					console.log(error);
					throw error;
				} else {
					for (let i = 0; i < payment.links.length; i++) {
						if (payment.links[i].rel === 'approval_url') {
							res.redirect(payment.links[i].href);
		
						}
					}
				}
			});


		})

	// const create_payment_json = {
	// 	"intent": "sale",
	// 	"payer": {
	// 		"payment_method": "paypal"
	// 	},
	// 	"redirect_urls": {
	// 		"return_url": "http://localhost:5000/shopping/success",
	// 		"cancel_url": "http://localhost:5000/shopping/cancel"
	// 	},
	// 	"transactions": [{
	// 		"item_list":
	// 		{
	// 			"items":

	// 				stuff.map((product) => {
	// 					return {
	// 						itemid: product.itemid,

	// 						currency: "USD"

	// 					}
	// 				}),
	// 			//{
	// 			// "name": "item",
	// 			// "price": "1.00",
	// 			// "currency": "SGD",
	// 			// "quantity": 1
	// 			//}

	// 		},
	// 		"amount": {
	// 			"currency": "SGD",
	// 			"total": "1.00"
	// 		},
	// 		"description": "This is the payment description."
	// 	}]
	// };



	// paypal.payment.create(create_payment_json, function (error, payment) {
	// 	if (error) {
	// 		throw error;
	// 	} else {
	// 		for (let i = 0; i < payment.links.length; i++) {
	// 			if (payment.links[i].rel === 'approval_url') {
	// 				res.redirect(payment.links[i].href);

	// 			}
	// 		}
	// 	}
	// });



});

router.get('/success', (req, res) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
	// const Rtotal = req.query.total;
	//const Rtotal=total.toFixed(2);
	//console.log(Rtotal);

cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include:[{
				model: shopIt ,as: "form",
				required:true
			   }]
		})
		.then((carttt) => {
			const listhehe=[];
			var total=0.00;
			for (i = 0; i < carttt.length; i++) {
				const items={}
				items["name"]=carttt[i].form.itemName;
				// items["itemid"]=carttt[i].itemid;
				items["currency"]="SGD";
				items["price"]=carttt[i].form.price;
				// items["price"]= carttt[i].form.price;
				items["quantity"]=carttt[i].quantity;
				console.log(carttt[i].quantity);
				total+=parseInt(carttt[i].quantity)*parseFloat(carttt[i].form.price);
				
				
				// items["name"]=carttt[i].form.name;
				listhehe.push(items);
				
				//transactions.item_list.items.push({itemid: itemid});

				//let cost =parseFloat(carttt[i].shopp.price);
				// total+=cost;
				//console.log(cost);
			}
			
			//const Rtotal=total.toFixed(2);
			
			//console.log(total);
			const Rtotal=total.toFixed(2);
			//console.log(Rtotal);
			//console.log(listhehe); 
		

	const execute_payment_json = {
		"payer_id": payerId,
		"transactions": [{
			"amount": {
				"currency": "SGD",
				"total": Rtotal
			}
		}]
	}

	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let datetime = date + ' ' + time;
	let payname = req.user.name;
	let paycontact = req.user.contact;
	let payemail = req.user.email;
	let payaddress = req.user.address;
	let paypostalC = req.user.address;
	let CorCC = "credit card";
	let totalamount=Rtotal;
	let transactions = paymentId;
	let CuserId = req.user.id;
	// Multi-value components return array of strings or undefined
	paymentt.create({
		datetime,
		payname,
		paycontact,
		payemail,
		payaddress,
		paypostalC,
		transactions,
		CorCC,
		totalamount,
		CuserId
	}).then((paymenttt) => {

		cart.findAll(
			{
				where: {
					CuserId: req.user.id
				},
				include:[{
					model: shopIt ,as: "form",
					required:true
				   }]

			})
			.then((cartt) => {

				for (i = 0; i < cartt.length; i++) {

					let itemid = cartt[i].itemid;
					let orderid = paymenttt.id;
					let CuserId=req.user.id;
					let oquantity=cartt[i].quantity;
					// var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
					// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
					// let datetime = date + ' ' + time;
					// let items = {};
					// items[i]['item'] = itemid;
					// items[i]['currency'] = 'SGD';
					//quantity=cartt[i].form.quantity
					console.log(cartt[i].form.quantity);
					let quantity=parseInt(cartt[i].form.quantity-parseInt(cartt[i].quantity))
					console.log("Narutoo forever");
					console.log(quantity);
					shopIt.update({
						quantity
					},
					{
						where:{
							id:cartt[i].itemid
						}
					});

					
					orderd.create({
						itemid,
						//datetime,
						oquantity,
						orderid,
						CuserId
					})
					cartt[i].destroy
						(

						)
				}

			})
	})



		;

	paypal.payment.execute(paymentId, execute_payment_json, function (error, paymentt) {
		if (error) {
			console.log(error.response);
			throw error;
		} else {
			console.log("Get Payment Response");
			console.log(JSON.stringify(paymentt));
			res.send('success');
		}
	});
});
});

router.get('/cancel', (req, res) => res.send('Cancelled'));

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
			include: [{
				model: shopIt, as: "form",
				required: true
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
			include: [{
				model: shopIt, as: "form",
				required: true
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
	wishlist.findOne({ where: { itemid: req.params.id } })
		.then(wishlistt => {
			if (wishlistt) {
				res.redirect('/');
			}
			else {
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
					})
			}
		})
});

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
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let datetime = date + ' ' + time;
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
	paymentt.create({
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
	}).then((paymenttt) => {
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
				for (i = 0; i < cartt.length; i++) {
					//if(cartt.CuserId==req.user.id){
					console.log(cartt.itemid);
					//while(cartt.CuserId==req.user.id){
					// for (i = 0; i < cartt.length; i++){
					// 	console.log("1");
					//if(cartt.CuserId==req.user.id){
					let itemid = cartt[i].itemid;
					let orderid = paymenttt.id;
					let CuserId = req.user.id;
					orderd.create({
						itemid,
						orderid,
						CuserId
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
	})
});


router.get('/addtocart/:id', (req, res) => {
	console.log("saving carttttttttttttttttttt");
	cart.findOne({ where: { itemid: req.params.id } })
		.then(cartt => {
			if (cartt) {
				let quantity=parseInt(cartt.quantity)+1;
				cartt.update({quantity})
				res.redirect('/');
			}
			else {

	shopIt.findOne({ where: { id: req.params.id } })
		.then((shopp) => {
			console.log("it runnnnnnnnnnnnn");
			let itemid = shopp.id;
			let CuserId = req.user.id;
			let quantity=1;
			//let quantity= parseInt(cart.quantity)+1;
			cart.create({
				itemid,
				quantity,
				CuserId
			}).then((cart) => {
				res.redirect('/');
			})
		})
	}
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

router.post('/addtocartt/:id', (req, res) => {
	let quantity=req.body.quantity;
	console.log(quantity);
	console.log("saving carttttttttttttttttttt");
	cart.findOne({ where: { itemid: req.params.id } })
		.then(cartt => {
			if (cartt) {
				console.log("im hereeee");
				console.log(req.body.quantity);
				let quantity=parseInt(cartt.quantity)+parseInt(req.body.quantity);
				cartt.update({quantity})
				res.redirect('/');
			}
			else {
	shopIt.findOne({ where: { id: req.params.id } })
		.then((shopp) => {
			console.log(shopp);
			console.log("it runnnnnnnnnnnnn");
			console.log(quantity);
			let itemid = shopp.id;
			let CuserId = req.user.id;
			//let quantity=req.body.quantity;
			//let quantity= parseInt(cart.quantity)+1;
			console.log(quantity);
			cart.create({
				itemid,
				quantity,
				CuserId
			}).then((cart) => {
				res.redirect('/');
			})
		})
	}
})
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