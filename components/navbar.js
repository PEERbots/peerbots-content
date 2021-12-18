export default function Navbar(user) {

    return (
        <>
        {user.email ? (
            <>
                <div>
                    I have an email
                </div>
            </>
        ): (
            <>
                <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign In</button>
                </div>
            </>
        )}
        <div>
            This is the navbar
        </div>
        </>
    )
}