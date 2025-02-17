import AuthForm from "../components/authForm";
import amplitude from "amplitude-js";
import { useEffect } from "react";
import { useFirebaseAuth } from "../state/AuthProvider";
import { useNavigate } from "react-router";

export default function AuthPage() {
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
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
