import AuthForm from "../components/authForm";
import amplitude from "amplitude-js";
import { useEffect } from "react";

export default function AuthPage() {
  useEffect(() => {
    amplitude.getInstance().logEvent("Viewed Page: Login");
  }, []);

  return (
    <div className="flex justify-center">
      <AuthForm />
    </div>
  );
}
