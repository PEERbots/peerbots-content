import {
  getAuth,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { useFirebaseAuth } from "../auth";
import { useState, useRef } from "react";
import firebaseApp from "../firebase";
import { Dialog } from "@headlessui/react";

export default function Navbar() {
  const user = useFirebaseAuth();
  const auth = getAuth(firebaseApp);
  const [modalShown, setModalShown] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const emailInput = useRef(null);
  const pwInput = useRef(null);

  function signOutOfFirebase() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("User signed out");
      })
      .catch((error) => {
        // An error happened.
        console.log("An error occurred while signing out");
        console.log(error);
      });
  }

  function signInWithUserInfo() {
    if (signingUp) {
      createUserWithEmailAndPassword(
        auth,
        emailInput.current.value,
        pwInput.current.value
      )
        .then((user) => {
          console.log("New user created");
          console.log(user);
          setModalShown(false);
        })
        .catch((error) => {
          console.log("An error happenend with signing up");
          console.log(error);
        });
    } else {
      signInWithEmailAndPassword(
        auth,
        emailInput.current.value,
        pwInput.current.value
      )
        .then((user) => {
          console.log("User signed in");
          console.log(user);
          setModalShown(false);
        })
        .catch((error) => {
          console.log("An error happenend with signing in");
          console.log(error);
        });
    }
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
        setModalShown(false);
      })
      .catch((error) => {
        console.log(error);
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
      <div>
        <Dialog
          open={modalShown}
          onClose={() => setModalShown(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20  m-10 text-center sm:block sm:p-0">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-10">
              <Dialog.Title className="text-primary bold text-xl text-center">
                {signingUp ? <span>Create Account</span> : <span>Log In</span>}
              </Dialog.Title>

              <Dialog.Description>
                <div className="p-10">
                  <div className="m-5">
                    <label
                      className="relative text-gray-400 focus-within:text-gray-600 block"
                      htmlFor="email"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <input
                        type="email"
                        ref={emailInput}
                        className="input-base form-input form-input py-3 px-4 appearance-none w-full block pl-14"
                        name="email"
                        placeholder="Email"
                      ></input>
                    </label>
                  </div>

                  <div className="m-5">
                    <label
                      className="relative text-gray-400 focus-within:text-gray-600 block"
                      htmlFor="password"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <input
                        type="password"
                        ref={pwInput}
                        className="input-base form-input form-input py-3 px-4 appearance-none w-full block pl-14"
                        name="password"
                        placeholder="Password"
                      ></input>
                    </label>
                  </div>

                  <div className="text-center m-5">
                    <button
                      className="bg-primary text-white p-2 rounded"
                      onClick={signInWithUserInfo}
                    >
                      {signingUp ? "Create Account" : "Sign In"}
                    </button>
                    <div className="text-center text-sm mt-3 mb-10">
                      {signingUp ? (
                        <span>
                          Already have an account?{" "}
                          <a
                            className="underline decoration-primary"
                            onClick={() => setSigningUp(false)}
                          >
                            Log In
                          </a>
                        </span>
                      ) : (
                        <span>
                          Don&apos;t have an account?{" "}
                          <a
                            className="underline decoration-primary"
                            onClick={() => setSigningUp(true)}
                          >
                            Sign Up
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    {signingUp ? (
                      <span>Sign up with</span>
                    ) : (
                      <span>Sign in with</span>
                    )}
                    <svg
                      className="text-center block m-auto"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        signInWithGoogs();
                      }}
                    >
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path
                          fill="#4285F4"
                          d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                        />
                        <path
                          fill="#34A853"
                          d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </Dialog.Description>
            </div>
          </div>
        </Dialog>
      </div>

      {user.user ? (
        <>
          <div>
            Signed in as: {} {user.user.displayName}
            <button
              onClick={signOutOfFirebase}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="justify-center">
            <span>
              <a
                onClick={() => {
                  setSigningUp(false);
                  setModalShown(true);
                }}
              >
                Sign In
              </a>
            </span>
            <button
              onClick={() => {
                setSigningUp(true);
                setModalShown(true);
              }}
              className="bg-primary hover:bg-dark-primary text-black font-bold py-2 px-4 rounded"
            >
              Sign Up
            </button>
          </div>
        </>
      )}

      <div>This is the navbar</div>
    </>
  );
}
