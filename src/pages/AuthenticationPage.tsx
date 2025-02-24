import AuthForm from "../components/authForm";
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

  return (
    <div className="flex justify-center">
      <AuthForm mode={false} />
    </div>
  );
}
