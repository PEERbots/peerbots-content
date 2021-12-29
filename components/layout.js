import { FirebaseAuthProvider } from "../auth";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout({ children }) {
  return (
    <>
      <FirebaseAuthProvider>
        <div className="bg-white shadow-md my-4 mx-2 rounded w-full">
          <Navbar />
        </div>
        {children}
        <div className="bg-white shadow-md my-4 mx-2 rounded w-full">
          <Footer />
        </div>
      </FirebaseAuthProvider>
    </>
  );
}
