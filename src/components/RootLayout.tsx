import Footer from "./footer";
import Navbar from "./navbar";
import { FirebaseAuthProvider } from "../state/AuthProvider";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <>
      <FirebaseAuthProvider>
        <div className="flex flex-col min-h-screen">
          <div className="bg-white shadow-md my-4 mx-2 rounded">
            <Navbar />
          </div>
          <div className="flex-grow">
            <Outlet />
          </div>
          <Footer />
        </div>
      </FirebaseAuthProvider>
    </>
  );
}
