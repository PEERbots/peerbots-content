import Navbar from './navbar'
import Footer from './footer'
import {useState} from "react"

export default function Layout({ children }) {
    const {user, setUser} = useState({email: undefined, signOut: undefined});


    return (
        <>
        <Navbar user={user}/>
        <main>{children}</main>
        <Footer />
        </>
    )
}