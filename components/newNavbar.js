/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import Image from "next/image";
import { useFirebaseAuth } from "../auth";
import AuthForm from "./authForm";
import { useState, useEffect, useRef } from "react";
import firebaseApp from "../firebase";
import SearchForm from "./searchForm";
import { Dialog } from "@headlessui/react";

import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import logo from "../public/peerbots_logo.png";
import Link from "next/link";
import amplitude from "amplitude-js";



export default function NewNavbar() {
    const navigation = [
      { name: 'My Content', href: '/my/content', current: true },
      { name: 'Purchases', href: '/my/purchases', current: true },
      { name: 'Listed Content', href: '/my/listedcontent', current: false },
    ]
    const user = useFirebaseAuth();
    const auth = getAuth(firebaseApp);
    const [modalShown, setModalShown] = useState(false);
    const [signingUp, setSigningUp] = useState(false);
    const router = useRouter();
    console.log(user);

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
    
    function classNames(...classes) {
      return classes.filter(Boolean).join(' ')
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
            <AuthForm />
          </div>
        </Dialog>
      </div>
    <Disclosure as="nav" className="">
      {({ open }) => (
          <>
          <div className="lg:max-w-full mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <div className="block lg:hidden w-24">
                  <Link href="/">
                    <a>
                  <Image
                    src={logo}
                    alt="Peerbots"
                    />
                    </a>
                    </Link>
                    </div>
                <div className="hidden lg:block w-48">
                <Link href="/">
                    <a>
                  <Image
                    src={logo}
                    alt="Peerbots"
                    />
                    </a>
                    </Link>
                    </div>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'hover:text-primary' : 'hidden',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            
            {user.user ? (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                        <>
                            <div className='h-8 w-8'>
                            {user.user.photoURL ? (
                                <img
                                className="rounded-full"
                                src={user.user.photoURL}
                                alt=""
                                />
                                ): (
                                    <img
                                    className='rounded-full'
                                    src="profile_pic.png"
                                    alt=""
                                    />
                                    )}
                            </div>
                        </>
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
                            <Link href="/">
                            <a
                            className={classNames(active ? '' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                            My Profile
                            </a>
                                </Link>
                        )}
                        </Menu.Item>
                        <Menu.Item>
                        {({ active }) => (
                            <Link href=''>
                            <a
                            onClick={signOutOfFirebase}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
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
            
            <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'hover:text-primary' : 'hidden',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
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