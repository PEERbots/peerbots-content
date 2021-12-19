import Navbar from './navbar'
import Footer from './footer'
import { FirebaseAuthProvider } from '../auth'



export default function Layout({ children }) {
    return (
        <>
        <FirebaseAuthProvider>
            <Navbar/>
                {children}
            <Footer />
        </FirebaseAuthProvider>
        </>
    )
}