import AuthForm from "./authForm";
import { useState, useEffect } from "react";
import firebaseApp from "../firebase";

import { Dialog } from "@headlessui/react";
import { getAuth, signOut } from "firebase/auth";
import { useFirebaseAuth } from "../auth";
import logo from "../public/peerbots_logo.png";

export default function Navbar() {
  const user = useFirebaseAuth();
  const auth = getAuth(firebaseApp);
  const [modalShown, setModalShown] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

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

  useEffect(() => {
    if (user) {
      setModalShown(false);
    }
  }, [user]);

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
            <AuthForm />
          </div>
        </Dialog>
      </div>

      {/* The Entire Navbar */}
      <nav>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center hidden">
              {/* The Left Side */}
              <div>
                <img src="peerbots_logo.png" alt="Peerbots Logo" />
              </div>
              <div>Search goes here</div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* The Right Side */}

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
                        className="cursor-pointer"
                      >
                        Sign In
                      </a>
                    </span>
                    <button
                      onClick={() => {
                        setSigningUp(true);
                        setModalShown(true);
                      }}
                      className="btn-primary"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
