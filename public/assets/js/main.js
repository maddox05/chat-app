// Import the functions you need from the SDKs you need
function local_or_public() {
    if (window.location.href.includes("localhost")) {
        return "localhost";
    } else {
        return "public";
    }
}

//import {firebaseConfig} from "/private/firebase_secret.js"; //local
import {firebaseConfig} from "/public/private/firebase_secret.js"; // public

// import { firebaseConfig } from "/public/private/firebase_secret.js"; // config from firebase_secret.js for debug version


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"; // must always init firebase app
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; // add the firestore new database
import { getAuth, GoogleAuthProvider, signInWithPopup }  from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"; // add the auth
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js"; // add the analytics

import {rainbow} from "./effects.js";



const app = initializeApp(firebaseConfig); // init the app
const database = getFirestore(app); // init the database
const auth = getAuth(app); // init the auth
const analytics = getAnalytics(app); // init the analytics
console.log("firebase succesfully started"); // log to console


const sign_in_button = document.getElementById("signin"); // get the sign-in button
const username_div = document.getElementById("username"); // get the username div
const message_input = document.getElementById("message"); // get the message input
const message_button = document.getElementById("send"); // get the message button

function signed_in() {
    sign_in_button.style.display = "none";
    message_input.style.visibility = "visible";
    message_button.style.visibility = "visible";
}
function sign_in() {
    const provider = new GoogleAuthProvider(); // init the provider
    signInWithPopup(auth, provider) // promise func to sign in
        .then((result) => { // if success .then(result, func)
            const user = result.user;
            username_div.innerHTML = ('User signed in:', user.displayName);
            signed_in();
            rainbow();
        })
        .catch((error) => { // if error .catch(error, func)
            console.error('Sign-in error:', error);
            //lol

        })
}

sign_in_button.addEventListener("click", sign_in);


