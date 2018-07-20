var express = require('express');
var router = express.Router();
var fb = require('firebase');
var firebase = require('../firebase');
var db = firebase.FirebaseInstance.database();
var fbRef = db.ref();
var admin = firebase.admin;
var fbAuth = firebase.FirebaseInstance.auth();
var flash = require('connect-flash');

router.get('/register', function(req, res, next){
	res.render('users/register');
});

router.get('/login', function(req, res, next){
	res.render('users/login');
});

router.post('/register', function(req, res, next){
	var first_name= req.body.first_name;
	var last_name= req.body.last_name;
	var email= req.body.email;
	var password= req.body.password;
	var password2= req.body.password2;
	var location= req.body.location;
	var fav_artists= req.body.fav_artists;
	var fav_genres= req.body.fav_genres;

	// Validation
	req.checkBody('first_name', 'First name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();


	if(errors){
		res.render('users/register', {
			errors: errors
		});
	} else 
	{
		fbAuth.createUserWithEmailAndPassword(email, password)
		.then(function(user){
			var userRef = fbRef.child('users');
			uid = fbAuth.currentUser.uid;
			var newUser = {
        		uid: uid,
				email: email,
				first_name: first_name,
				last_name: last_name,
				location: location,
				fav_genres: fav_genres,
				fav_artists: fav_artists
			}

			userRef.push().set(newUser);
			req.flash('success_msg', 'Welcome, You are now registered and logged in !');
			res.redirect('/albums');
		})
		.catch(function(error){
			if(error)
			{
				//console.log(error.message);
				req.flash('error_msg', error.message);
				res.redirect('users/register');
			}
		});
	}
});

router.post('/login', function(req, res, next){
	
	var email= req.body.email;
	var password= req.body.password;

	// Validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();

	var errors = req.validationErrors();


	if(errors){
		res.render('users/login', {
			errors: errors
		});
	} else 
	{
		fbAuth.setPersistence(fb.auth.Auth.Persistence.NONE)
		.then(function(){
			return fbAuth.signInWithEmailAndPassword(email, password)
			.then(function(firebaseUser){
				var uid = fbAuth.currentUser,uid;
				console.log("Authenticated user with uid:", uid);
				req.flash('success_msg', 'You are now logged in');
				res.redirect('/albums');
			})
			.catch(function(error){
				req.flash('error_msg', 'Login Failed');
				console.log('Login Failed: ', error.message);
				res.redirect('/users/login');
			});
		})
		.catch(function(error){
			//Handle Errors Here
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorMessage);
		});
	}
});

router.get('/logout', function(req,res){
	fbAuth.signOut();
	req.flash('success_msg', 'You are now logged out');
	res.redirect('/users/login');
});

module.exports = router;