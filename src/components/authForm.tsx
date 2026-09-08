import { auth } from "../../firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useState, useActionState, useEffect } from "react";
import { FirebaseError } from "firebase/app";
import { AuthFormUI, AuthFormMode } from "@peerbots/core";

type FormState = {
  error: string;
  message: string;
};

function determineAppropriateErrorMessage(error: FirebaseError) {
  switch (error.code) {
    case "auth/invalid-email":
      return "The email address is improperly formatted.";
    case "auth/user-disabled":
      return "This user has been disabled.";
    case "auth/user-not-found":
      return "No user found with this email. Please sign up!";
    case "auth/wrong-password":
      return "Incorrect password. Please try again or reset your password.";
    case "auth/email-already-in-use":
      return "An account already exists with this email.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    default:
      return error.message;
  }
}

export default function AuthForm({ mode }: { mode: boolean }) {
  const [formMode, setFormMode] = useState<AuthFormMode>(() =>
    mode ? "signing up" : "signing in"
  );

  useEffect(() => {
    setFormMode(mode ? "signing up" : "signing in");
  }, [mode]);

  const [state, formAction] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        switch (formMode) {
          case "signing up":
            await createUserWithEmailAndPassword(auth, email, password);
            return { error: "", message: "" };
          case "signing in":
            await signInWithEmailAndPassword(auth, email, password);
            return { error: "", message: "" };
          case "resetting password":
            await sendPasswordResetEmail(auth, email);
            return {
              error: "",
              message: "Email sent! Please check your inbox.",
            };
          default:
            return prevState;
        }
      } catch (error) {
        if (error instanceof FirebaseError) {
          return {
            error: determineAppropriateErrorMessage(error),
            message: "",
          };
        }
        return {
          error: "An unexpected error occurred. Please try again.",
          message: "",
        };
      }
    },
    { error: "", message: "" }
  );

  function signInWithGoogs() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      const msg =
        error instanceof FirebaseError
          ? determineAppropriateErrorMessage(error)
          : error.message;
      alert(msg);
    });
  }

  const description =
    formMode === "signing up"
      ? "Sign up for an account to acquire, review, and list content for your social robot."
      : formMode === "signing in"
        ? "Sign in to acquire, review, and list content for your social robot."
        : undefined;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full mx-auto">
      <AuthFormUI
        mode={formMode}
        onModeChange={setFormMode}
        formAction={formAction}
        actionState={state}
        onGoogleSignIn={signInWithGoogs}
        description={description}
      />
    </div>
  );
}
