import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"; // must always init firebase app
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; // add the firestore new databaseimport { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"; // add the firestore new database
import { getAuth, GoogleAuthProvider, signInWithPopup }  from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { firebaseConfig } from "/firebase.js"; // add the firestore new database




const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);
console.log("firebase succesfully started");


const sign_in_button = document.getElementById("signin");
function sign_in() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider) // promise func
        .then((result) => {
            const user = result.user;
            console.log('User signed in:', user.displayName);
            // redirect user
        })
        .catch((error) => {
            console.error('Sign-in error:', error);
            //lol

        })

}
sign_in_button.addEventListener("click", sign_in);

