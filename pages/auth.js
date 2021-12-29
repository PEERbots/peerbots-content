import { useRouter } from "next/router";
import { useFirebaseAuth } from "../auth";
import AuthForm from "../components/authForm";
import amplitude from "amplitude-js";
import { useEffect } from "react";

export default function AuthPage() {
  const { user } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    amplitude.getInstance().logEvent("Viewed Page: Login");
  }, []);

  return (
    <div className="flex justify-center">
      <AuthForm />
    </div>
  );
}
