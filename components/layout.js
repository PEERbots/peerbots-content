import { FirebaseAuthProvider } from "../auth";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Layout({ children }) {
  return (
    <>
      <FirebaseAuthProvider>
        <div className="flex flex-col min-h-screen">
          <div className="bg-white shadow-md my-4 mx-2 rounded">
            <Navbar />
          </div>
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </FirebaseAuthProvider>
    </>
  );
}
