import { useEffect } from "react"
import { Navbar } from "./Navbar"
import { Outlet, useNavigate } from "react-router-dom"


export function Layout() {

    let user = sessionStorage.getItem("User")
    const navigate = useNavigate()


    useEffect(() => {
        if (!user) {
            navigate("/")
        }

    }, [user]);
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}