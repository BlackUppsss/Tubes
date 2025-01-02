import { Link } from "react-router-dom"
import { pageData } from "./pageData"
import LogoHotel from '../src/assets/Video/LogoHotel.png'
import HotelBG from '../src/assets/Video/HotelBG.mp4'
import Pohon from '../src/assets/Video/Pohon.png'
import Rumah from '../src/assets/Video/Rumah.png'
import sleid from '../src/assets/Video/KeretaSanta.png'
import Houses from '../src/assets/Video/Perumahan.png'
import Gunduk from '../src/assets/Video/Gundukan.png'
import TaliNatal from '../src/assets/Video/TaliNatal.png'
import { useState, useEffect } from "react"
import { getPosts, createUsers, getUsers, updateUsers, updatePost, deleteUsers, VerifyUser } from '../src/api'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import * as jwt_decode from "jwt-decode";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../src/scss/styles.scss'


// import { post } from "../../jamal/userRoutes"

export function Navbar() {
    const [users, setUsers] = useState();
    // const [posts, setPosts] = useState();
    const [bleh, ableh] = useState(true);
    const token = sessionStorage.getItem("User")
    let decodedUser
    try {
        decodedUser = jwt_decode.jwtDecode(token)
    } catch (error) {

    }

    useEffect(() => {
        async function loadUserData() {
            try {
                if (token !== null) {
                    setUsers(decodedUser)
                    ableh(false);
                } else {
                    ableh(true);
                }
            } catch (error) {

            }
            // const KamarHotel = await getPosts()
            // const filteredKamar = KamarHotel.filter((kamar) => post.author == decodeUser._id)
            // setPosts (filteredKamar)
        }
        loadUserData()
    }, []);

    const Navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const closeBox = () => {
        setIsOpen(false);
    };

    const [isreg, setisreg] = useState(false)
    const closereg = () => {
        setisreg(false)

    }

    const pindahreg = () => {
        closeBox()
        setisreg(true)
    }

    const [user, setUser] = useState({
        Username: "",
        email: "",
        Password: "",
    });

    async function handleSubmit(e) {
        e.preventDefault()
        let response = await createUsers(user)
        if (response.status !== 200) {
            alert("User account could not to created")
        }

        if (response.status === 200) {
            const loginResponse = await VerifyUser({
                email: user.email,
                Password: user.Password,
            });
            if (loginResponse) {
                // Simpan token dan navigasi ke halaman utama
                sessionStorage.setItem("User", loginResponse);
                axios.defaults.headers.common["Authorization"] = `Bearer ${loginResponse}`;
                closereg()
                window.location.reload()
            }
        }
    }

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const [Luser, setLUser] = useState({
        email: "",
        Password: "",
    });

    async function handleSubmitLogin(e) {
        e.preventDefault()
        let response = await VerifyUser(Luser)
        if (response) {
            Navigate("/home")
            sessionStorage.setItem("User", response)
            axios.defaults.headers.common["Authorization"] = `Bearer ${response}`
            closeBox()
            Navigate("/")
            window.location.reload()

        } else {
            alert("Login failed")
        }

    }

    function handleChangeLogin(e) {
        setLUser({ ...Luser, [e.target.name]: e.target.value })
    }

    function logout(e) {
        sessionStorage.removeItem("User")
        window.location.reload()
    }


    return (
        <div className="navfull">
            <div>
                <div className="background-container">
                    <video autoPlay loop muted playsInline className="background-video">
                        <source src={HotelBG} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div>

                    </div>
                </div>
                <div>
                    <Link to={'/'}>
                        <img src={LogoHotel} alt="" className="LogoFixed" />
                    </Link>
                </div>
                <div>
                    <img src="https://media-public.canva.com/HesPY/MAFT36HesPY/1/t.png" alt="" className="santahat" />
                </div>
                <div>
                    <img src={Pohon} alt="" className="trees" />
                </div>
                <div>
                    <img src={Pohon} alt="" className="trees1" />
                </div>
                <div>
                    <img src={Pohon} alt="" className="trees2" />
                </div>
                <div>
                    <img src={Pohon} alt="" className="trees3" />
                </div>
                <div>
                    <img src={Pohon} alt="" className="trees4" />
                </div>
                <div>
                    <img src={Pohon} alt="" className="trees5" />
                </div>
                <div>
                    <img src={Rumah} alt="" className="house" />
                </div>
                <div>
                    <img src={Rumah} alt="" className="house2" />
                </div>
                <div>
                    <img src={sleid} alt="" className="sleid" />
                </div>
                <div>
                    <img src={Houses} alt="" className="houses" />
                </div>
                <div>
                    <img src={Gunduk} alt="" className="hill" />
                </div>
                <div>
                    <img src={TaliNatal} alt="" className="ntl" />
                </div>
                <div>
                    <img src={TaliNatal} alt="" className="ntl1" />
                </div>
                <div>
                    <img src={TaliNatal} alt="" className="ntl2" />
                </div>
                <div>
                    <img src={TaliNatal} alt="" className="ntl3" />
                </div>
            </div>

            <div className="HeadNav">

                <div>
                    <img src={LogoHotel} alt="" className="Logo" />
                </div>

                <div className="navbar">

                    {pageData.map((page) => {
                        return (

                            <Link to={page.path} className="navItem" key={page.name}>
                                <button>{page.name}</button>
                            </Link>

                        )
                    })}

                </div>
                {bleh && (
                    <div className="Auth">
                        <button className="semarang" onClick={() => setIsOpen(true)}>
                            Login
                        </button>
                        <button className="nganjuk" onClick={() => setisreg(true)}>
                            Register
                        </button>



                    </div>
                )}

                {!bleh && (
                    <div className="Darjo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25px" viewBox="0 0 24 24" id="profile">
                            <g fill="none" fillRule="evenodd" stroke="#200E32" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transform="translate(4 2.5)">
                                <circle cx="7.579" cy="4.778" r="4.778"></circle>
                                <path d="M5.32907052e-15,16.2013731 C-0.00126760558,15.8654831 0.0738531734,15.5336997 0.219695816,15.2311214 C0.677361723,14.3157895 1.96797958,13.8306637 3.0389178,13.610984 C3.81127745,13.4461621 4.59430539,13.3360488 5.38216724,13.2814646 C6.84083861,13.1533327 8.30793524,13.1533327 9.76660662,13.2814646 C10.5544024,13.3366774 11.3373865,13.4467845 12.1098561,13.610984 C13.1807943,13.8306637 14.4714121,14.270023 14.929078,15.2311214 C15.2223724,15.8479159 15.2223724,16.5639836 14.929078,17.1807781 C14.4714121,18.1418765 13.1807943,18.5812358 12.1098561,18.7917621 C11.3383994,18.9634099 10.5550941,19.0766219 9.76660662,19.1304349 C8.57936754,19.2310812 7.38658584,19.2494317 6.19681255,19.1853548 C5.92221301,19.1853548 5.65676678,19.1853548 5.38216724,19.1304349 C4.59663136,19.077285 3.8163184,18.9640631 3.04807112,18.7917621 C1.96797958,18.5812358 0.686515041,18.1418765 0.219695816,17.1807781 C0.0745982583,16.8746908 -0.000447947969,16.5401098 5.32907052e-15,16.2013731 Z"></path>
                            </g>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="logout" width="25px" onClick={logout}>
                            <path d="M25.55,3H12.45C11.08,3,10,4.4,10,6.18V12a1,1,0,0,0,2,0V6.18A1.37,1.37,0,0,1,12.45,5H25.54c.11,0,.46.43.46,1.18V25.82A1.37,1.37,0,0,1,25.55,27H12.46c-.11,0-.46-.43-.46-1.18V20a1,1,0,0,0-2,0v5.82C10,27.6,11.08,29,12.45,29h13.1C26.92,29,28,27.6,28,25.82V6.18C28,4.4,26.92,3,25.55,3Z"></path>
                            <path d="M7.41,17H19a1,1,0,0,0,0-2H7.41l1.3-1.29a1,1,0,0,0-1.42-1.42l-3,3a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l3,3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                        </svg> <span> Hai, {decodedUser.Username}</span>
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="KotakLogin">

                    <div className="IsiKotakLogin">
                        <h1>Login</h1>
                        <form onSubmit={handleSubmitLogin} className="masuk">
                            <div className="inputlog">
                                <input autoComplete="off" className="loginput" placeholder={"Email Address"} onChange={handleChangeLogin} name="email" required maxLength={20} style={{
                                    fontFamily: "poppins, sans-serif",
                                    fontSize: "16px",
                                    
                                }} />
                                <input placeholder={"Password"} onChange={handleChangeLogin} name="Password" type="password" required maxLength={40} style={{
                                    fontFamily: "poppins, sans-serif",
                                    fontSize: "16px",
                                    
                                }} />
                            </div>
                            <div className="noakun">
                                <h2>
                                    Don't have an account ? <span onClick={pindahreg}>Register</span>
                                </h2>
                            </div>
                            <div>
                                
                                <button type="submit">Login</button>
                            </div>

                        </form>
                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 128 128" viewBox="0 0 128 128" id="back" onClick={closeBox} className="outlogin">
                            <path fill="#373737" d="M126.2,68.5c-0.2-4.4-1.2-8.8-2.8-12.9c-1.6-4.1-4-8-6.9-11.4c-1.5-1.7-3-3.3-4.8-4.7c-0.4-0.4-0.9-0.7-1.3-1.1
	                                c-0.4-0.3-0.9-0.7-1.4-1l-1.4-0.9c-0.5-0.3-1-0.6-1.4-0.9c-1.9-1.1-4-2.1-6.1-3c-2.1-0.8-4.3-1.5-6.5-1.9c-2.2-0.5-4.5-0.8-6.8-0.8
	                                l-0.8,0l-0.6,0l-1.2,0l-2.4-0.1l-19.4-0.7l-23.8-0.8v-7.8c0-1.8-2-2.8-3.5-1.9l-13.9,9.2L11,34.7l-8.2,5.5c-1.3,0.9-1.3,2.8,0,3.7
	                                l8.2,5.5l10.4,6.9l13.9,9.2c1.5,1,3.5-0.1,3.5-1.9v-7.8l23.8-0.8l19.4-0.7l4.6-0.2c1-0.1,1.9,0,2.9,0.1c0.9,0.1,1.9,0.3,2.8,0.6
	                                c0.9,0.3,1.8,0.6,2.7,1.1c0.2,0.1,0.4,0.2,0.7,0.3c0.2,0.1,0.4,0.2,0.6,0.4l0.6,0.4c0.2,0.1,0.4,0.3,0.6,0.4
	                                c0.8,0.6,1.6,1.2,2.3,1.9c1.4,1.4,2.6,3.1,3.5,4.9c0.9,1.8,1.5,3.8,1.8,5.8c0.1,1,0.2,2.1,0.1,3.1c0,1-0.2,2.1-0.4,3.1
	                                c-0.2,1-0.5,2-0.9,3c-0.4,1-0.8,2-1.4,2.9c-1.1,1.8-2.5,3.6-4.2,5c-0.8,0.7-1.7,1.4-2.7,1.9c-0.9,0.6-1.9,1.1-3,1.5
	                                c-2,0.8-4.3,1.3-6.5,1.4l-0.4,0c-4.5,0.3-8.2,4-8.3,8.7c-0.1,4.9,3.8,9,8.7,9.1c4.2,0.1,8.4-0.4,12.5-1.7c2-0.6,4-1.4,5.9-2.4
	                                c1.9-1,3.7-2.1,5.4-3.3c3.5-2.5,6.5-5.6,9-9.2c1.2-1.8,2.3-3.6,3.3-5.6c0.9-2,1.7-4,2.3-6.1C125.9,77.3,126.4,72.9,126.2,68.5z"></path>
                        </svg>
                    </div>
                </div>
            )}

            {isreg && (
                <div className="KotakLogin">

                    <div className="IsiKotakLogin">
                        <form onSubmit={handleSubmit} className="masuk">
                            <div>
                                <input placeholder={"Username"} onChange={handleChange} name="Username" required maxLength={20} style={{
                                    fontFamily: "poppins, sans-serif",
                                    fontSize: "16px",
                                    
                                }} />
                                <input placeholder={"Email Address"} type="email" onChange={handleChange} name="email" required maxLength={20} style={{
                                    fontFamily: "poppins, sans-serif",
                                    fontSize: "16px",
                                    
                                }} />
                                <input placeholder={"Password"} onChange={handleChange} name="Password" type="password" required maxLength={40} style={{
                                    fontFamily: "poppins, sans-serif",
                                    fontSize: "16px",
                                    
                                }} />
                            </div>
                            <div>
                                <button type="submit">Create Account</button>
                            </div>

                        </form>
                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 128 128" viewBox="0 0 128 128" id="back" onClick={closereg} className="outlogin">
                            <path fill="#373737" d="M126.2,68.5c-0.2-4.4-1.2-8.8-2.8-12.9c-1.6-4.1-4-8-6.9-11.4c-1.5-1.7-3-3.3-4.8-4.7c-0.4-0.4-0.9-0.7-1.3-1.1
	                                c-0.4-0.3-0.9-0.7-1.4-1l-1.4-0.9c-0.5-0.3-1-0.6-1.4-0.9c-1.9-1.1-4-2.1-6.1-3c-2.1-0.8-4.3-1.5-6.5-1.9c-2.2-0.5-4.5-0.8-6.8-0.8
	                                l-0.8,0l-0.6,0l-1.2,0l-2.4-0.1l-19.4-0.7l-23.8-0.8v-7.8c0-1.8-2-2.8-3.5-1.9l-13.9,9.2L11,34.7l-8.2,5.5c-1.3,0.9-1.3,2.8,0,3.7
	                                l8.2,5.5l10.4,6.9l13.9,9.2c1.5,1,3.5-0.1,3.5-1.9v-7.8l23.8-0.8l19.4-0.7l4.6-0.2c1-0.1,1.9,0,2.9,0.1c0.9,0.1,1.9,0.3,2.8,0.6
	                                c0.9,0.3,1.8,0.6,2.7,1.1c0.2,0.1,0.4,0.2,0.7,0.3c0.2,0.1,0.4,0.2,0.6,0.4l0.6,0.4c0.2,0.1,0.4,0.3,0.6,0.4
	                                c0.8,0.6,1.6,1.2,2.3,1.9c1.4,1.4,2.6,3.1,3.5,4.9c0.9,1.8,1.5,3.8,1.8,5.8c0.1,1,0.2,2.1,0.1,3.1c0,1-0.2,2.1-0.4,3.1
	                                c-0.2,1-0.5,2-0.9,3c-0.4,1-0.8,2-1.4,2.9c-1.1,1.8-2.5,3.6-4.2,5c-0.8,0.7-1.7,1.4-2.7,1.9c-0.9,0.6-1.9,1.1-3,1.5
	                                c-2,0.8-4.3,1.3-6.5,1.4l-0.4,0c-4.5,0.3-8.2,4-8.3,8.7c-0.1,4.9,3.8,9,8.7,9.1c4.2,0.1,8.4-0.4,12.5-1.7c2-0.6,4-1.4,5.9-2.4
	                                c1.9-1,3.7-2.1,5.4-3.3c3.5-2.5,6.5-5.6,9-9.2c1.2-1.8,2.3-3.6,3.3-5.6c0.9-2,1.7-4,2.3-6.1C125.9,77.3,126.4,72.9,126.2,68.5z"></path>
                        </svg>
                    </div>
                </div>
            )}


            <div id="background">
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
            </div>
        </div>

    )
}