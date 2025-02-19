import { ReactElement } from "react";
import { useFirebaseAuth } from "../state/AuthProvider";
import AuthForm from "./authForm";

export default function CheckAuth({ children }: { children: ReactElement }) {
  const { user } = useFirebaseAuth();
  return (
    <>
      {user ? (
        <>{children}</>
      ) : (
        <div className="justify-center text-center">
          <h3 className="block">
            You need to sign in to see the contents of this page!
          </h3>
          <AuthForm mode={false}></AuthForm>
        </div>
      )}
    </>
  );
}
