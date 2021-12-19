import {getAuth, signInWithPopup, GoogleAuthProvider, signOut} from "firebase/auth"
import { useFirebaseAuth } from "../auth"
import firebaseApp from "../firebase"

export default function Navbar() {
    const user = useFirebaseAuth()
    const auth = getAuth(firebaseApp);
    console.log(user)


    function signOutOfFirebase() {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
        // An error happened.
        });
    }

    function signInWithGoogs() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            console.log(user)
            // ...
        }).catch((error) => {
            console.log(error)
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    return (
        <>
        {user.user ? (
            <>
                <div>
                    Signed in as: {} {user.user.displayName}
                    <button onClick={signOutOfFirebase} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Out</button>
                </div>
            </>
        ): (
            <>
                <div>
                    <button onClick={signInWithGoogs} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sign In With Google</button>
                </div>
            </>
        )}
        <div>
            This is the navbar
        </div>
        </>
    )
}