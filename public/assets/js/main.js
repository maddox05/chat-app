// Import the functions you need from the SDKs you need

function local_or_public() {
    if (window.location.href.includes("localhost")) { // if the url includes localhost
        return "localhost";
    } else {
        return "public";
    }
}

import {firebaseConfig} from "../../private/firebase_secret.js"; // fixed

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"; // idk why but local firebase does not work so i just import the code from the website repo
import * as firebaseFirestore from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged }  from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"; // add the auth
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js"; // add the analytics

import {rainbow} from "./effects.js";



const app = initializeApp(firebaseConfig); // init the app
const database = firebaseFirestore.getFirestore(app); // init the database
const auth = getAuth(app); // init the auth
const analytics = getAnalytics(app); // init the analytics //todo fix analytics
console.log("firebase succesfully started"); // log to console

const sign_in_button = document.getElementById("signin"); // get the sign-in button
const username_div = document.getElementById("username"); // get the username div
const message_input = document.getElementById("message"); // get the message input
const message_button = document.getElementById("send"); // get the message button
const chat_div = document.getElementById("chat");
const sign_out_button = document.getElementById("sign_out_button");
const login_text_to_show = document.getElementById("login_for_nerd");




// const user = auth.currentUser; // get the current user

function signed_in() {
    sign_in_button.style.display = "none";
    login_text_to_show.style.visibility = "hidden";
    message_input.style.visibility = "visible";
    message_button.style.visibility = "visible";
    sign_out_button.style.visibility = "visible";

}

function already_signed_in(){ // run at start but later
    if(auth.currentUser != null) {
        console.log("signed in");
        username_div.innerHTML = ('User signed in:' , auth.currentUser.displayName);
        signed_in(); // does html stuff, basically opening the chat for you and letting you then sign out if you want
        rainbow(); // does cool rainbow stuff
        message_button.addEventListener("click", send_feature); // adds event listener to message button (send_feature() func)
    }
    else{
        console.log("was not signed in");
    }

}


function sign_in() {
    if(auth.currentUser != null){
        already_signed_in();
        console.log("already signed in")
    }
    else {
        console.log("sign in started")

        const provider = new GoogleAuthProvider(); // init the provider
        signInWithPopup(auth, provider) // promise func to sign in
            .then((result) => { // if success .then(result, func)
                const user = result.user; // get the user into a variable

                window.location.reload(); // reload the page so you can already be signed in as browser saves cookies (u stay signed in)




            })
            .catch((error) => { // if error .catch(error, func)
                console.error('Sign-in error:', error);
                //shouldn't error if it does then sucks for them

            })
    }
}
sign_in_button.addEventListener("click", sign_in); // adds event listener to sign in button (signin() func)

const what_collection = firebaseFirestore.collection(database, "messages"); // collection, (database, collection name) // what collection of documents I want to look at

function send_feature() { // working
    const saved_input = message_input.value.toString(); // get the value of the message input you are trying to send

    console.log("message sending:", saved_input);

    const user = auth.currentUser;    // bad way to try not to have remote code execution using <script> tag
    if (user != null && saved_input !== "" && !saved_input.includes("<script>") && !saved_input.includes("<script")&& !saved_input.includes("</script>")) { // if user is signed in and message is not empty
        const dataToSet = {
            timestamp: firebaseFirestore.serverTimestamp(),
            message: saved_input,
            userID: user.uid,
            username: user.displayName
        };
        console.log("User signed in, so message CAN be sent");
        firebaseFirestore.addDoc(what_collection, dataToSet)
            .then(result => {
                message_input.value = ""; // clear the message input
                console.log("Succesfully sent");

        })
            .catch(error =>{
                console.log("Error: ", error);

            })
        ;
    }
    else {
        console.log("User not signed in, input is nothing, or input contains <script> tag");
    }
}

// gets at start and loads x amt of messages
function initial_message_load(total_messages_queryed) {
    if (auth.currentUser != null) {

        // if new values in firestore // how to check if firestore has been updated?
        const query = firebaseFirestore.query(what_collection, firebaseFirestore.orderBy("timestamp", "desc"), firebaseFirestore.limit(total_messages_queryed)); // query the database ordered by time with a limit of (x)
        firebaseFirestore.getDocs(query).then((snapshot) => { // gets the documents the query found and then uses the snapshot to get the data
            // console.log("snapshot: ", snapshot.docs); // snapshot.docs is an array of documents (docs) array of limit(x) documents

            snapshot.docs.slice((1)).map(doc => { // slice wtf lol
                generate_divs_from_doc_class(doc, false) // generate divs from the doc for each div, also dont prepend
            }).join(" "); // should be join(",") but this works so idk


        });
    }
    else
        {
            console.log("user currently null");
        }


}
// always runs
const query = firebaseFirestore.query(what_collection, firebaseFirestore.orderBy("timestamp", "desc"), firebaseFirestore.limit(1)); // query the database ordered by time with a limit of (x)
const unsubscribe  = firebaseFirestore.onSnapshot(query, (snapshot) =>{ // runs anytime anything happens in messages also runs at start for no fucking reason so i had to do a lil work around
    generate_divs_from_doc_class(snapshot.docs[0], true); // gets the first doc in the array of docs array should be length 1 [0]

});
// unsubscribe(); // unsubscribe from the query
function sign_out(){ // signs the user out
    auth.signOut().then(() => {
        console.log("signed out");
        window.location.reload();
    }).catch((error) => {
        console.log("you should reload the page // error: ",error);
    });
}

sign_out_button.addEventListener("click", sign_out); // adds event listener to sign out button (sign_out() func)


auth.onAuthStateChanged(already_signed_in); // runs when auth state changes (sign in or sign out)
// just leave it ig it works
auth.onAuthStateChanged(()=>{
   initial_message_load(20) // load x amt messages at start (keep them reads to a minimum) actually loads 9 cuz of the slice
});

function generate_divs_from_doc_class(doc_sent, prepend) { // gets called every single time a new message gets added to the server, async function
    const data = doc_sent.data(); // get the data from the doc (doc.data()) has a timestamp and message and etc is a class object

    const time = data.timestamp.toDate(); // keeps erroring even though it works idk why
    const time_string = time.getHours() + ":" + time.getMinutes();
    let who_sent = "";
    if (data.username === auth.currentUser.displayName) {
        who_sent = "you_sent";
    } else {
        who_sent = "they_sent";
    }

    if(prepend === false) {
        chat_div.innerHTML += `<div class=${who_sent}>${data.username} "${data.message}" ${time_string}</div>`; // return the message in a div
    }
    else{
        const new_div = `<div class="${who_sent}">${data.username} "${data.message}" ${time_string}</div>`; // Create a temporary container element
        const tempContainer = document.createElement('div'); // Set the innerHTML of the container to the new_div content
        tempContainer.innerHTML = new_div;
        chat_div.insertBefore(tempContainer.firstChild, chat_div.firstChild); // Prepend the divElement to chat_div
    }
}












