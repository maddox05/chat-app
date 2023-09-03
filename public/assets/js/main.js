// Import the functions you need from the SDKs you need
function local_or_public() {
    if (window.location.href.includes("localhost")) { // if the url includes localhost
        return "localhost";
    } else {
        return "public";
    }
}

import {firebaseConfig} from "../../private/firebase_secret.js"; // fixed

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"; // must always init firebase app
import * as firebaseFirestore from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


import { getAuth, GoogleAuthProvider, signInWithPopup }  from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"; // add the auth
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js"; // add the analytics

import {rainbow} from "./effects.js";



const app = initializeApp(firebaseConfig); // init the app
const database = firebaseFirestore.getFirestore(app); // init the database
const auth = getAuth(app); // init the auth
const analytics = getAnalytics(app); // init the analytics
console.log("firebase succesfully started"); // log to console


const sign_in_button = document.getElementById("signin"); // get the sign-in button
const username_div = document.getElementById("username"); // get the username div
const message_input = document.getElementById("message"); // get the message input
const message_button = document.getElementById("send"); // get the message button



// const user = auth.currentUser; // get the current user

function signed_in() {
    sign_in_button.style.display = "none";
    message_input.style.visibility = "visible";
    message_button.style.visibility = "visible";
}
function sign_in() {
    const provider = new GoogleAuthProvider(); // init the provider
    signInWithPopup(auth, provider) // promise func to sign in
        .then((result) => { // if success .then(result, func)
            const user = result.user; // get the user into a variable
            username_div.innerHTML = ('User signed in:', user.displayName);
            signed_in(); // does html stuff
            rainbow(); // does cool rainbow stuff
            message_button.addEventListener("click", send_feature); // adds event listener to message button (send_feature() func)


        })
        .catch((error) => { // if error .catch(error, func)
            console.error('Sign-in error:', error);
            //shouldn't error if it does then sucks for them

        })
}
sign_in_button.addEventListener("click", sign_in); // adds event listener to sign in button (signin() func)

const what_collection = firebaseFirestore.collection(database, "messages"); // doc(instance, what doc u wanna write to)

function send_feature() { // working
    const user = auth.currentUser;
    if (user != null) {
        const dataToSet = {
            timestamp: firebaseFirestore.serverTimestamp(),
            message: message_input.value,
            userID: user.uid,
            username: user.displayName
        };
        firebaseFirestore.addDoc(what_collection, dataToSet)
            .then(result => {
            console.log("Succesfully sent");

        })
            .catch(error =>{
                console.log("Error: ", error);

            })
        ;
    }
    else {
        console.log("User not signed in, so message CANNOT be sent");
    }
}

const chat_div = document.getElementById("chat");
// add a function that gets messages from database and displays them
function get_messages() { // gets called every single time a new message gets added to the server, async function
    if (auth.currentUser != null) {
        return;
    }
}








