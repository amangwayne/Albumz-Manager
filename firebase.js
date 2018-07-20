var firebase = require('firebase');
var admin = require('firebase-admin');

var config = {
	apiKey: "AIzaSyAwdB342Xep2-xP4DqZpVhiaK-Bj_wLiNY",
	authDomain: "albumz-d0d16.firebaseapp.com",
	databaseURL: "https://albumz-d0d16.firebaseio.com",
	storageBucket: "albumz-d0d16.appspot.com",
};

var instance = firebase.initializeApp(config);

module.exports.FirebaseInstance = instance;