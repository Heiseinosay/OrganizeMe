import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

// STYLES
import '../styles/signup.css'
import '../styles/fonts.css'
import '../styles/root_variables.css'

// IMAGES
import Logo from '../images/logo_transparent.png'
import Hidden from '../images/ic_hidden.png'
import View from '../images/ic_view.png'

function Signup() {

    const navigate = useNavigate();

    const [suFirstName, setSuFirstName] = useState("");
    const [suLastName, setSuLastName] = useState("");
    const [suEmail, setSuEmail] = useState("");
    const [suPassword, setSuPassword] = useState("");
    const [suErrorMessage, setSuErrorMessage] = useState("")

    const handlesuFirstName = (e) => setSuFirstName(e.target.value);
    const handlesuLastName = (e) => setSuLastName(e.target.value);
    const handlesuEmail = (e) => setSuEmail(e.target.value);

    const [visible, setVisible] = useState(false);
    const handleVisible = () => {
        setVisible((prevVisible) => !prevVisible);
    };

    const handleStatusIndicator = (event) => {
        setSuPassword(event.target.value);
        // console.log("Password length:", event.target.value.length);
    }

    const getPasswordStrength = (length) => {
        if (length === 0) return "";
        if (length < 4) return "Weak";
        if (length < 8) return "Moderate";
        return "Strong";
    };



    const getStrengthClass = (index) => {
        const length = suPassword.length;
        if (length === 0) return "circle-grey"; // Default grey color
        if (length < 4) return index === 0 ? "circle-red" : "circle-grey"; // Weak
        if (length < 8) return index < 2 ? "circle-orange" : "circle-grey"; // Moderate
        return "circle-green"; // Strong
    };

    const suSubmit = () => {
        console.log(suFirstName, suLastName, suEmail, suPassword)
        if (!suFirstName || !suLastName || !suEmail || !suPassword) {
            setSuErrorMessage("Please fill up the missing fields");
        } else {
            setSuErrorMessage("");
            axios.post('/signup', {
                firstName: suFirstName,
                lastName: suLastName,
                mail: suEmail,
                password: suPassword
            })
                .then((response) => {
                    const status = response.data.status;
                    console.log("Signup status:", status);

                    if (status === 'success') {
                        navigate('/login');
                    } else {
                        alert("Signup failed. Please try again.");
                    }
                })
                .catch((error) => {
                    console.error("Signup failed:", error);
                });
        }


    }

    return (
        <div className='page-signup'>
            <div className="container-1">
                <div className="container-fill-up">
                    <img src={Logo} alt="logo" id='logo' />

                    <div className="texts">
                        <h1 className='konkhmer-sleokchher-regular'>Create an account</h1>
                        <p className='inter-regular'>Lets get started on noting your success! </p>
                        <p className='su-alert inter-regular'>&nbsp;{suErrorMessage}</p>
                    </div>

                    <div className="container-form">

                        <div className="container-fname">
                            <label htmlFor="firstname" className='inter-regular'>First Name</label><br />
                            <input type="text" id='firstname' placeholder='Enter your first name ' value={suFirstName} onChange={handlesuFirstName} />
                        </div>

                        <div className="container-lname">
                            <label htmlFor="lastname" className='inter-regular'>Last Name</label><br />
                            <input type="text" id='lastname' placeholder='Enter your last name ' value={suLastName} onChange={handlesuLastName} />
                        </div>

                        <div className="container-email">
                            <label htmlFor="lastname" className='inter-regular'>Email</label><br />
                            <input type="text" id='lastname' placeholder='Enter your email ' value={suEmail} onChange={handlesuEmail} />
                        </div>

                        <div className="su-container-password">
                            <label htmlFor="lastname" className='inter-regular'>Password</label><br />
                            {/* <input type="text" id='lastname' placeholder='Enter your password ' /> */}
                            <div className="su-container-password-input">
                                <input type={visible ? "text" : "password"} name="pwd" placeholder='Enter your password' value={suPassword} onChange={handleStatusIndicator} />
                                <img src={visible ? View : Hidden} alt="hidden" onClick={handleVisible} />
                            </div>
                        </div>

                        <div className="strength-indicator">
                            <div className="su-circles">
                                <div className={`circles ${getStrengthClass(0)}`}></div>
                                <div className={`circles ${getStrengthClass(1)}`}></div>
                                <div className={`circles ${getStrengthClass(2)}`}></div>
                            </div>
                            <p className='inter-regular'>&nbsp;{getPasswordStrength(suPassword.length)}</p>
                        </div>

                    </div>

                    <button className='btn-sign-up inter-regular' onClick={suSubmit}>Sign up</button>
                    <p className='su-login-link inter-regular'>Already have an account? <strong><a href="/login">Log in</a></strong></p>
                </div>



            </div>













            <div className="container-2">
                <div className='quote'>
                    <h1 className='h1-first konkhmer-sleokchher-regular'>"</h1>
                    <h1 className='h1-middle konkhmer-sleokchher-regular'>The secret of getting ahead is getting started.</h1>
                    <h1 className='h1-last konkhmer-sleokchher-regular'>Mark Twain</h1>
                </div>
            </div>

        </div>
    )
}

export default Signup
