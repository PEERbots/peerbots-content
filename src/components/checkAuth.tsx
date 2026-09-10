import { ReactNode } from "react";
import { useFirebaseAuth } from "../state/AuthProvider";
import AuthForm from "./authForm";
import { Heading } from "@peerbots/core";

export default function CheckAuth({ children }: { children: ReactNode }) {
  const { user } = useFirebaseAuth();
  return (
    <>
      {user ? (
        <>{children}</>
      ) : (
        <div className="max-w-xl mx-auto my-12 px-4 text-center">
          <Heading level={3} className="mb-6">
            Sign in to access your content
          </Heading>
          <AuthForm mode={false} />
        </div>
      )}
    </>
  );
}
