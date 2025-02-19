import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";

import AuthForm from "./authForm";
import { Dialog } from "@headlessui/react";
import { Link, NavLink, useNavigate } from "react-router";
import { SearchForm } from "./searchForm";
import { db, auth } from "../../firebase";

import peerbotsLogo from "../assets/peerbots_logo.png";
import profilePic from "../assets/profile_pic.png";
import { useFirebaseAuth } from "../state/AuthProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, userInDb } = useFirebaseAuth();
  const [modalShown, setModalShown] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [hasListedContent, setHasListedContent] = useState(false);

  const checkListedContent = async () => {
    if (userInDb) {
      // Get their listed content
      const listedContentQuery = query(
        collection(db, "content"),
        where("owner", "==", doc(db, "users", userInDb.id)),
        where("public", "==", true)
      );
      const listedContentData = await getDocs(listedContentQuery);
      if (listedContentData.docs.length > 0) {
        setHasListedContent(true);
      }
    }
  };

  function signOutOfFirebase() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
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
      checkListedContent();
    }
  }, [user, userInDb, hasListedContent]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <div>
        <Dialog
          open={modalShown}
          onClose={() => setModalShown(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="block text-center items-end justify-center min-h-screen pt-20 px-4 sm:pt-4 md:m-10 sm:m-2">
            <AuthForm mode={signingUp} />
          </div>
        </Dialog>
      </div>
      <Disclosure as="nav" className="">
        {({ open }) => (
          <>
            <div className="lg:max-w-full mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                {user ? (
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        // X Icon
                        <svg
                          className="block h-6 w-6"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      ) : (
                        // Menu Icon
                        <svg
                          className="block h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                          />
                        </svg>
                      )}
                    </Disclosure.Button>
                  </div>
                ) : (
                  <div>
                    <div className="items-center block w-24 lg:w-48">
                      <Link to="/">
                        <img
                          src={peerbotsLogo}
                          alt="Peerbots Logo"
                          width={192}
                          height={33}
                        />
                      </Link>
                    </div>
                  </div>
                )}
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex-shrink-0 flex items-center">
                    {user ? (
                      <div>
                        <div className="block w-24 lg:w-48">
                          <Link to="/">
                            <img
                              src={peerbotsLogo}
                              alt="Peerbots Logo"
                              width={192}
                              height={33}
                            />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="hidden sm:block sm:ml-6">
                    {user && (
                      <div className="flex space-x-4">
                        <NavLink
                          className={
                            "px-3 py-2 rounded-md text-sm font-medium hover:text-primary"
                          }
                          to={"/my/content"}
                        >
                          My Content
                        </NavLink>
                        <NavLink
                          className={
                            "px-3 py-2 rounded-md text-sm font-medium hover:text-primary"
                          }
                          to={"/my/purchases"}
                        >
                          My Purchases
                        </NavLink>
                        <NavLink
                          className={
                            "px-3 py-2 rounded-md text-sm font-medium hover:text-primary"
                          }
                          to={"/my/listings"}
                        >
                          My Listings
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>

                <div className="items-center lg:block hidden">
                  <SearchForm />
                </div>
                {user ? (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 cursor-pointer">
                    {/* Profile dropdown */}
                    <Menu
                      as="div"
                      className="border border-neutral-200 shadow-lg p-2 rounded-lg ml-3 relative cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Menu.Button className="flex items-center text-sm focus:outline-none">
                          <span className="sr-only">Open user menu</span>
                          <div className="h-8 w-8">
                            {user.photoURL ? (
                              <img
                                className="rounded-full cursor-pointer"
                                src={user.photoURL}
                                alt="Your profile photo"
                              />
                            ) : (
                              <img
                                className="rounded-full cursor-pointer"
                                src={profilePic}
                                alt="The default profile photo for everyone"
                              />
                            )}
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 stroke-gray-400 ml-2 md:block hidden cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        {user && userInDb && (
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/u/${userInDb.id}`}
                                  className={classNames(
                                    active ? "" : "",
                                    "block px-4 py-2 text-sm text-gray-700 hover:font-bold"
                                  )}
                                >
                                  My Profile
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  onClick={signOutOfFirebase}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 hover:font-bold"
                                  )}
                                >
                                  Sign out
                                </a>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        )}
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <div className="ml-8">
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
                )}
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {user && (
                  <div className="flex space-x-4">
                    <NavLink
                      className={
                        "px-3 py-2 rounded-md text-sm font-medium hover:text-primary"
                      }
                      to={"/my/content"}
                    >
                      My Content
                    </NavLink>
                    <NavLink
                      className={
                        "px-3 py-2 rounded-md text-sm font-medium hover:text-primary"
                      }
                      to={"/my/purchases"}
                    >
                      My Purchases
                    </NavLink>
                    <NavLink
                      className={
                        "px-3 py-2 rounded-md text-sm font-medium hover:text-primary"
                      }
                      to={"/my/listings"}
                    >
                      My Listings
                    </NavLink>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
