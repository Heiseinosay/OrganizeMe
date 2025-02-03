import React, { useState } from 'react'
import { useNavigate } from "react-router";
import axios from 'axios';

// IMAGES
import Logo from '../images/logo_transparent.png'
import Hidden from '../images/ic_hidden.png'
import View from '../images/ic_view.png'

// STYLES
import '../styles/login.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'

function Login() {

    const navigate = useNavigate()
    const [lgErrorMessage, setLgErrorMessage] = useState("")

    const handleLogin = () => {
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('pwd').value;

        // console.log(emailInput, passwordInput)
        axios.post('/auth_login', {
            email: emailInput,
            password: passwordInput
        })
            .then(response => {
                const status = response.data;
                console.log(status);

                if (status != false) {
                    console.log(status[0]);
                    // Save user data in session storage
                    sessionStorage.setItem('user', JSON.stringify(status[0]));
                    navigate("/home")
                    setLgErrorMessage("")
                } else {
                    setLgErrorMessage("Invalid email or password. Please try again.");
                }
            })
            .catch(error => {
                console.error("Login error:", error);
                alert("An error occurred during login.");
            });
    }

    const [visible, setVisible] = useState(false);
    const handleVisible = () => {
        setVisible((prevVisible) => !prevVisible);
    };

    return (
        <div className='page-login'>
            <div className="container-login">
                <img src={Logo} alt="" srcset="" />
                <div className="welcome-text">
                    <h1 className='konkhmer-sleokchher-regular'>Welcome back!</h1>
                    <h5 className='inter-regular'>Continue with your email</h5>
                    <p className='lg-alert inter-regular'>&nbsp;{lgErrorMessage}</p>
                </div>

                <div className="container-input inter-regular">
                    <label htmlFor="email">Email</label> <br />
                    <input type="text" name="email" id="email" placeholder='Enter your email ' /> <br />
                    <label htmlFor="pwd">Password</label>
                    <div className="container-password">
                        <input type={visible ? "text" : "password"} name="pwd" id="pwd" placeholder='Enter your password' />
                        <img src={visible ? View : Hidden} alt="hidden" onClick={handleVisible} />
                    </div>

                    <div className="container-forgotpwd">
                        <div className='checkbox'>
                            <input type="checkbox" name="remember" id="rememeberme" />
                            <label htmlFor="rememeberme">Remember me</label>
                        </div>

                        <a href="#"><u>Forgot password?</u></a>
                    </div>

                </div>
                <button onClick={handleLogin} className='btn-login inter-bold'>Login</button>

                <div className="container-signup">

                </div>
                <p className='signup-link inter-regular'>Don't have an account? <strong><a href="/signup">Sign up now</a></strong></p>
            </div>
        </div>
    )
}

export default Login
