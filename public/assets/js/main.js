import { firebaseConfig } from "/firebase_secret.js"; // config from firebase_secret.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"; // must always init firebase app
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; // add the firestore new database
import { getAuth, GoogleAuthProvider, signInWithPopup }  from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"; // add the auth
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js"; // add the analytics




const app = initializeApp(firebaseConfig); // init the app
const database = getFirestore(app); // init the database
const auth = getAuth(app); // init the auth
const analytics = getAnalytics(app); // init the analytics
console.log("firebase succesfully started"); // log to console


function sign_in() {
    const provider = new GoogleAuthProvider(); // init the provider
    signInWithPopup(auth, provider) // promise func to sign in
        .then((result) => { // if success .then(result, func)
            const user = result.user;
            console.log('User signed in:', user.displayName);
            // redirect user / open chat room
        })
        .catch((error) => { // if error .catch(error, func)
            console.error('Sign-in error:', error);
            //lol

        })

}
const sign_in_button = document.getElementById("signin"); // get the sign-in button

sign_in_button.addEventListener("click", sign_in);


