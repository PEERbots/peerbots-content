import { auth } from "../../firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { FirebaseError } from "firebase/app";

export default function AuthForm({ mode }: { mode: boolean }) {
  const [formMode, setFormMode] = useState("signing up");
  const [authError, setAuthError] = useState("");
  const [resetPwMessage, setResetPwMessage] = useState("");
  const emailInput = useRef<HTMLInputElement>(null);
  const pwInput = useRef<HTMLInputElement>(null);

  function determineAppropriateErrorMessage(error: FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        setAuthError(
          "You entered an invalid email. Please check it and try again."
        );
        break;
      case "auth/email-already-in-use":
        setAuthError(
          "This email is already taken. Try to remember your password or try a different email."
        );
        break;
      case "auth/invalid-password":
        setAuthError("The password you entered is invalid. Please try again.");
        break;
      case "auth/wrong-password":
        setAuthError(
          "The email and password combination you entered is not correct. Please try again or try resetting your password."
        );
        break;
      case "auth/user-not-found":
        setAuthError(
          "We could not find your account. Please consider signing up!"
        );
        break;
      default:
        setAuthError(error.message);
    }
  }

  function signUpWithUserInfo() {
    if (emailInput.current && pwInput.current) {
      createUserWithEmailAndPassword(
        auth,
        emailInput.current.value,
        pwInput.current.value
      ).catch((error) => {
        determineAppropriateErrorMessage(error);
      });
    }
  }

  function signInWithUserInfo() {
    if (emailInput.current && pwInput.current) {
      signInWithEmailAndPassword(
        auth,
        emailInput.current.value,
        pwInput.current.value
      ).catch((error) => {
        determineAppropriateErrorMessage(error);
      });
    }
  }

  function resetPassword() {
    if (emailInput.current) {
      sendPasswordResetEmail(auth, emailInput.current.value)
        .then(() => {
          // Password reset email sent!
          setResetPwMessage("Email sent! Please check your email.");
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          determineAppropriateErrorMessage(error);
        });
    }
  }

  function signInWithGoogs() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // Check if email is in DB
        return user;
      })
      .catch((error) => {
        determineAppropriateErrorMessage(error);
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  useEffect(() => {
    if (typeof mode !== "undefined") {
      setFormMode(mode ? "signing up" : "signing in");
    }
  }, [mode]);

  return (
    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full p-10">
      <h3 className="text-primary bold text-xl text-center">
        {formMode == "signing up" && <span>Sign up</span>}
        {formMode == "signing in" && <span>Sign In</span>}
        {formMode == "resetting password" && <span>Reset Password</span>}
      </h3>

      <form
        className="md:m-10 sm:m-4"
        action={() => {
          switch (formMode) {
            case "signing up":
              signUpWithUserInfo();
              break;
            case "signing in":
              signInWithUserInfo();
              break;
            case "resetting password":
              resetPassword();
              break;
            default:
              break;
          }
        }}
      >
        <p className="text-sm text-center mb-2">
          {formMode == "signing up" && (
            <span>
              Sign up for an account to simplify connecting to robots, and
              synchronize your work across devices.
            </span>
          )}
          {formMode == "signing in" && (
            <span>
              Sign in to acquire, review, and list content for your social
              robot.
            </span>
          )}
        </p>
        {formMode == "resetting password" && (
          <p className="text-dark-primary text-base text-center font-bold">
            {resetPwMessage}
          </p>
        )}
        <p className="text-red-600 text-sm text-center">{authError}</p>
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
              className="input-base form-input py-3 px-4 appearance-none w-full block pl-14"
              name="email"
              placeholder="Email"
            ></input>
          </label>
        </div>
        {formMode != "resetting password" && (
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
                className="input-base form-input py-3 px-4 appearance-none w-full block pl-14"
                name="password"
                placeholder="Password"
              ></input>
            </label>
          </div>
        )}

        <div className="text-center m-5">
          {formMode == "signing up" && (
            <button className="btn-primary" onClick={signUpWithUserInfo}>
              Sign Up
            </button>
          )}
          {formMode == "signing in" && (
            <button className="btn-primary" onClick={signInWithUserInfo}>
              Sign In
            </button>
          )}
          {formMode == "resetting password" && (
            <button className="btn-primary" onClick={resetPassword}>
              Reset Password
            </button>
          )}
          <div className="text-center text-sm mt-3 mb-10 text-gray-500">
            {formMode == "signing up" && (
              <p>
                Already have an account?{" "}
                <a
                  className="underline decoration-gray-600 hover:text-black cursor-pointer mx-1"
                  onClick={() => setFormMode("signing in")}
                >
                  Sign in
                </a>
              </p>
            )}
            {formMode == "signing in" && (
              <>
                <p>
                  Forgot your password?{" "}
                  <a
                    className="underline decoration-gray-600 hover:text-black cursor-pointer mx-1"
                    onClick={() => setFormMode("resetting password")}
                  >
                    Reset password.
                  </a>
                </p>
                <p className="text-xs">or</p>
                <p>
                  Don&apos;t have an account?{" "}
                  <a
                    className="underline decoration-gray-600 hover:text-black cursor-pointer mx-1"
                    onClick={() => setFormMode("signing up")}
                  >
                    Sign up
                  </a>
                </p>
              </>
            )}
            {formMode == "resetting password" && (
              <>
                <p>
                  Don&apos;t have an account?{" "}
                  <a
                    className="underline decoration-gray-600 hover:text-black cursor-pointer mx-1"
                    onClick={() => setFormMode("signing up")}
                  >
                    Sign up
                  </a>
                </p>
                <p className="text-xs">or</p>
                <p>
                  Remembered your password?
                  <a
                    className="underline decoration-gray-600 hover:text-black cursor-pointer mx-1"
                    onClick={() => setFormMode("signing in")}
                  >
                    Sign In
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
        {formMode != "resetting password" && (
          <div className="text-center text-sm text-gray-500">
            <button
              className="btn-secondary"
              onClick={() => {
                signInWithGoogs();
              }}
            >
              <svg
                className="text-center inline-block m-auto cursor-pointer h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
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
              {formMode == "signing up" && <span>Sign up with Google</span>}
              {formMode == "signing in" && <span>Sign in with Google</span>}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
