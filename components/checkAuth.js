import { useFirebaseAuth } from "../auth";
import AuthForm from "./authForm";

export default function CheckAuth({ children }) {
  const { user } = useFirebaseAuth();
  console.log(user);
  return (
    <>
      {user ? (
        <>{children}</>
      ) : (
        <div className="flex justify-center">
          <AuthForm>
            <h3>You need to sign in to see the contents of this page!</h3>
          </AuthForm>
        </div>
      )}
    </>
  );
}
