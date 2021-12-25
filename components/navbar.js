import AuthForm from "./authForm";
import { useState, useEffect } from "react";
import firebaseApp from "../firebase";

import { Dialog } from "@headlessui/react";
import { getAuth, signOut } from "firebase/auth";
import { useFirebaseAuth } from "../auth";
import logo from "../public/peerbots_logo.png";
import Image from "next/image";
import Link from "next/link";

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
        <div className="max-w-full justify-between mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative lg:flex items-center justify-between h-16">
              {/* The Left Side */}
            <div className="left-0">
              <div className="w-48">
                <Link href="/">
                  <a>
                    <Image className="" src={logo} alt="Peerbots Logo" />
                  </a>
                </Link>
              </div>
            </div>
              {/* The Middle */}
            <div className="inset-0">
              <div className="">
                {/* Search Bar */}
                <div className="flex items-center justify-center">
                  <div className="flex border-2 rounded">
                      <input type="text" className="input-base" placeholder="Search..."></input>
                        <button className="input-base border-l">
                            <svg className="w-6 h-6 text-gray-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                              <path
                                  d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                            </svg>
                        </button>
                    </div>
                </div>
              </div>
            </div>
              {/* The Right Side */}
            <div className="absolute right-0 flex sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {user.user ? (
                <>
                  <div className="flex items-center">
                    <div className="px-2">
                    {} {user.user.displayName}
                    </div>
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
                  <div className="">
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
