import Navbar from "./navbar";
import Footer from "./footer";
import { FirebaseAuthProvider } from "../auth";

export default function Layout({ children }) {
  return (
    <>
      <FirebaseAuthProvider>
        <div className="bg-white shadow-md my-4 mx-2 rounded w-full">
          <Navbar />
        </div>
        <div className="bg-white shadow-md my-4 mx-2 rounded w-full">
          {children}
        </div>
        <div className="bg-white shadow-md my-4 mx-2 rounded w-full">
          <Footer />
        </div>
      </FirebaseAuthProvider>
    </>
  );
}
