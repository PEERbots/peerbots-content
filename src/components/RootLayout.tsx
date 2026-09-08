import Footer from "./footer";
import Navbar from "./navbar";
import { FirebaseAuthProvider } from "../state/AuthProvider";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <FirebaseAuthProvider>
      <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
        <header className="sticky top-0 z-40 shadow-xs">
          <Navbar />
        </header>
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </FirebaseAuthProvider>
  );
}
