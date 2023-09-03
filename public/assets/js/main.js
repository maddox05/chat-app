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


import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged }  from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"; // add the auth
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
const chat_div = document.getElementById("chat");
const sign_out_button = document.getElementById("sign_out_button");



// const user = auth.currentUser; // get the current user

function signed_in() {
    sign_in_button.style.display = "none";
    message_input.style.visibility = "visible";
    message_button.style.visibility = "visible";
    sign_out_button.style.visibility = "visible";

}

function already_signed_in(){ // run at start but later
    if(auth.currentUser != null) {
        console.log("signed in")

        // close sign in popup if open
        username_div.innerHTML = ('User signed in:', auth.currentUser.displayName);
        signed_in(); // does html stuff
        rainbow(); // does cool rainbow stuff
        message_button.addEventListener("click", send_feature); // adds event listener to message button (send_feature() func)
    }
    else{
        console.log("was not signed in")
    }

}


function sign_in() {
    if(auth.currentUser != null){
        already_signed_in()
        console.log("already signed in")
    }
    else {
        console.log("sign in started")

        const provider = new GoogleAuthProvider(); // init the provider
        signInWithPopup(auth, provider) // promise func to sign in
            .then((result) => { // if success .then(result, func)
                const user = result.user; // get the user into a variable
                already_signed_in()




            })
            .catch((error) => { // if error .catch(error, func)
                console.error('Sign-in error:', error);
                //shouldn't error if it does then sucks for them

            })
    }
}
sign_in_button.addEventListener("click", sign_in); // adds event listener to sign in button (signin() func)

const what_collection = firebaseFirestore.collection(database, "messages"); // doc(instance, what doc u wanna write to)

function send_feature() { // working
    const saved_input = message_input.value.toString();

    message_input.value = "";
    console.log("message sending:", saved_input);

    const user = auth.currentUser;
    if (user != null) {
        const dataToSet = {
            timestamp: firebaseFirestore.serverTimestamp(),
            message: saved_input,
            userID: user.uid,
            username: user.displayName
        };
        console.log("User signed in, so message CAN be sent");
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

// add a function that gets messages from database and displays them
function get_messages() { // gets called every single time a new message gets added to the server, async function
    if (auth.currentUser != null) {

        // if new values in firestore // how to check if firestore has been updated?
        const query = firebaseFirestore.query(what_collection, firebaseFirestore.orderBy("timestamp", "desc"), firebaseFirestore.limit(10)); // query the database ordered by time with a limit of (x)
        firebaseFirestore.getDocs(query).then((snapshot) => { // gets the documents the query found and then uses the snapshot to get the data
            // console.log("snapshot: ", snapshot.docs); // snapshot.docs is an array of documents (docs) array of limit(x) documents
            chat_div.innerHTML = snapshot.docs.map(doc => { // adds to the chat div inner html // snapshot.docs.map is an array of the documents (docs) array of limit(x) documents // .map does something to each value in the array
                const data = doc.data(); // get the data from the doc (doc.data()) has a timestamp and message and etc is a class obejct
                const time = data.timestamp.toDate();
                const time_string = time.getHours() + ":" + time.getMinutes();
                return `<div class="message">${data.username} "${data.message}" ${time_string}</div>`; // return the message in a div
                //console.log(`username: ${data.username}, message: ${data.message}, time_string: ${time_string}`);

            }).join(" "); // should be join(",") but this works so idk
        });
    }
    else
        {
            console.log("user currently null");
        }
        setTimeout(get_messages, 5000); // run this function every 5 seconds, this needs to be fixed ASAP
        //todo: fix this



}

function sign_out(){
    auth.signOut().then(() => {
        console.log("signed out");
        window.location.reload();
    }).catch((error) => {
        console.log("error signing out");
    });
}
sign_out_button.addEventListener("click", sign_out);


auth.onAuthStateChanged(already_signed_in);
get_messages();












