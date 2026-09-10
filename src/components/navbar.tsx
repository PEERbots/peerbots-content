import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import {
  Button,
  Dialog,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  SearchInput,
} from "@peerbots/core";

import { auth } from "../../firebase";
import { useFirebaseAuth } from "../state/AuthProvider";
import AuthForm from "./authForm";
import peerbotsLogo from "../assets/peerbots_logo.png";
import profilePic from "../assets/profile_pic.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, userInDb } = useFirebaseAuth();
  const [modalShown, setModalShown] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out", error);
      });
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-peerbots-teal/10 text-peerbots-darkteal font-semibold"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`;

  return (
    <>
      <Dialog
        open={modalShown}
        onOpenChange={setModalShown}
        className="max-w-md p-0 border-none bg-transparent shadow-none"
      >
        <AuthForm mode={signingUp} />
      </Dialog>

      <nav className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={peerbotsLogo}
                alt="Peerbots"
                className="h-7 w-auto"
              />
              <span className="inline-flex items-center text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-peerbots-teal/15 text-peerbots-darkteal border border-peerbots-teal/20">
                Marketplace
              </span>
            </Link>
          </div>

          {/* Search Bar - Centerpiece */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchInput
              placeholder="Search robot interactions, dialogues..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>

          {/* Navigation Links & User Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <div className="hidden lg:flex items-center gap-1">
                  <NavLink to="/my/content" className={navLinkClasses}>
                    My Content
                  </NavLink>
                  <NavLink to="/my/purchases" className={navLinkClasses}>
                    My Purchases
                  </NavLink>
                  <NavLink to="/my/listings" className={navLinkClasses}>
                    My Listings
                  </NavLink>
                </div>

                <Dropdown
                  trigger={
                    <button
                      type="button"
                      className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-peerbots-teal/40 transition-all cursor-pointer focus:outline-none"
                      aria-label="User profile menu"
                    >
                      <img
                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                        src={user.photoURL || profilePic}
                        alt="Profile"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400 hidden sm:block"
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
                    </button>
                  }
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {user.displayName || "Peerbots User"}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownItem
                    onClick={() => {
                      const profileId = userInDb?.id || user.uid;
                      navigate(`/u/${profileId}`);
                    }}
                    className="cursor-pointer"
                  >
                    My Profile
                  </DropdownItem>
                  <div className="lg:hidden">
                    <DropdownItem
                      onClick={() => navigate("/my/content")}
                      className="cursor-pointer"
                    >
                      My Content
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => navigate("/my/purchases")}
                      className="cursor-pointer"
                    >
                      My Purchases
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => navigate("/my/listings")}
                      className="cursor-pointer"
                    >
                      My Listings
                    </DropdownItem>
                  </div>
                  <DropdownSeparator />
                  <DropdownItem
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    Sign out
                  </DropdownItem>
                </Dropdown>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  onClick={() => {
                    setSigningUp(false);
                    setModalShown(true);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => {
                    setSigningUp(true);
                    setModalShown(true);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="pb-3 md:hidden">
          <SearchInput
            placeholder="Search robot interactions..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
      </nav>
    </>
  );
}
