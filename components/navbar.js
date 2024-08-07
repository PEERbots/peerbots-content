import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";

import AuthForm from "./authForm";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import SearchForm from "./searchForm";
import amplitude from "amplitude-js";
import { db, auth } from "../firebase";
import { useFirebaseAuth } from "../auth";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user, userInDb } = useFirebaseAuth();
  const router = useRouter();
  const [modalShown, setModalShown] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [hasListedContent, setHasListedContent] = useState(false);
  const [navigation, setNavigation] = useState([]);

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
        amplitude.getInstance().logEvent("Signed Out");
        router.push("/");
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
      setNavigation([
        {
          name: "My Content",
          href: "/my/content",
          current: true,
          eventName: "Clicked Link: My Content",
          eventProps: { "Event Source": "Navbar" },
        },
        {
          name: "My Purchases",
          href: "/my/purchases",
          current: true,
          eventName: "Clicked Link: My Purchases",
          eventProps: { "Event Source": "Navbar" },
        },
        {
          name: "My Listings",
          href: "/my/listings",
          current: hasListedContent,
          eventName: "Clicked Link: My Listings",
          eventProps: { "Event Source": "Navbar" },
        },
      ]);
    } else {
      setNavigation([]);
    }
  }, [user, userInDb, hasListedContent]);

  function classNames(...classes) {
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
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
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
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                ) : (
                  <div>
                    <div className="items-center block lg:hidden w-24">
                      <Link href="/">
                        <a>
                          <Image
                            src="/peerbots_logo.png"
                            alt="Peerbots Logo"
                            layout="responsive"
                            width={192}
                            height={33}
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="hidden lg:block w-48">
                      <Link href="/">
                        <a>
                          <Image
                            src="/peerbots_logo.png"
                            alt="Peerbots Logo"
                            layout="responsive"
                            width={192}
                            height={33}
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex-shrink-0 flex items-center">
                    {user ? (
                      <div>
                        <div className="block lg:hidden w-24">
                          <Link href="/">
                            <a>
                              <Image
                                src="/peerbots_logo.png"
                                alt="Peerbots Logo"
                                layout="responsive"
                                width={192}
                                height={33}
                              />
                            </a>
                          </Link>
                        </div>
                        <div className="hidden lg:block w-48">
                          <Link href="/">
                            <a>
                              <Image
                                src="/peerbots_logo.png"
                                alt="Peerbots Logo"
                                layout="responsive"
                                width={192}
                                height={33}
                              />
                            </a>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="hidden sm:block sm:ml-6">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current ? "hover:text-primary" : "hidden",
                            "px-3 py-2 rounded-md text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="items-center lg:block hidden">
                  <SearchForm />
                </div>
                {user ? (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {/* Profile dropdown */}
                    <Menu
                      as="div"
                      className="border border-neutral-200 shadow-lg p-2 rounded-lg ml-3 relative"
                    >
                      <div className="flex items-center">
                        <Menu.Button className="flex items-center text-sm focus:outline-none">
                          <span className="sr-only">Open user menu</span>
                          <div className="h-8 w-8">
                            {user.photoURL ? (
                              <img
                                className="rounded-full"
                                src={user.photoURL}
                                alt=""
                              />
                            ) : (
                              <img
                                className="rounded-full"
                                src="profile_pic.png"
                                alt=""
                              />
                            )}
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 stroke-gray-400 ml-2 md:block hidden"
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
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link href="/[userId]" as={`/${userInDb.id}`}>
                                <a
                                  className={classNames(
                                    active ? "" : "",
                                    "block px-4 py-2 text-sm text-gray-700 hover:font-bold"
                                  )}
                                >
                                  My Profile
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link href="">
                                <a
                                  onClick={signOutOfFirebase}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700 hover:font-bold"
                                  )}
                                >
                                  Sign out
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
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
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current ? "hover:text-primary" : "hidden",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
