import AuthForm from "./authForm";
import { useState, useEffect, useRef } from "react";
import firebaseApp from "../firebase";
import SearchForm from "./searchForm";

import { Dialog } from "@headlessui/react";
import { getAuth, signOut } from "firebase/auth";
import { useFirebaseAuth } from "../auth";
import { useRouter } from "next/router";
import logo from "../public/peerbots_logo.png";
import Image from "next/image";
import Link from "next/link";
import amplitude from "amplitude-js";

export default function Navbar() {
  const user = useFirebaseAuth();
  const auth = getAuth(firebaseApp);
  const [modalShown, setModalShown] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const router = useRouter();
  

  function signOutOfFirebase() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        amplitude.getInstance().logEvent("Signed Out");
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
      {/* <nav> */}
      <nav className="items-center justify-between flex-wrap p-6">
        <div className="lg:max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="lg:flex relative justify-between h-16">
            {/* The Left Side */}
            <div className="lg:left-0">
              <div className="lg:w-48 w-24">
                <Link href="/">
                  <a>
                    <Image className="" src={logo} alt="Peerbots Logo" />
                  </a>
                </Link>
              </div>
            </div>
            {/* The Middle */}
            <div className="lg:inset-0">
                {/* Search Bar */}
                <SearchForm />
            </div>
            {/* The Right Side */}
            <div className="absolute lg:right-0 flex sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {user.user ? (
                <>
                  <div className="flex items-center">
                    {user.user.photoURL ? (
                    <img
                    src={user.user.photoURL}
                    className="h-8 inline-block rounded-full"
                  ></img>
                ) : (
                  <img
                    src="profile_pic.png"
                    className="h-8 inline-block rounded-full"
                  ></img>
                    )}
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