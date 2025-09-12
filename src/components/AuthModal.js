import React, { useState } from 'react';
import './AuthModal.css';
import { AiOutlineEye } from 'react-icons/ai';


function AuthModal({isOpen, onClose}){

    //states:
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setusername] = useState('');
    const [loginForm, setLoginForm] = useState(true);
    const [signupForm, setSignupForm] = useState(false);

    //functions:

    const inLoginForm = async() => {
        setSignupForm(false);
        setLoginForm(true);
    };

    const inSignupForm = async() => {
        setLoginForm(false);
        setSignupForm(true);
    };

    const onSwitch  = async() => {
        setLoginForm (prev => !prev);
        setSignupForm (prev => !prev);

    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setusername(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevents the default form submission and page reload

        console.log("email: ", email);
        console.log("password: ",password);

        //here i am going to place the 'send-the-data-to-the-backend'
        //  .
        //  .
        //  .
    };

    return (

        <div className='modal-overlay'>

            <div className='auth-box'>

                <img src='/close.png' alt='close icon' className='close-window-icon' onClick={onClose}/>
                <div className='title-container'>
                    <img src='/flower.png' alt='flower image' style={{height: '35px'}}/>
                    <h1>Join Our community!</h1>
                    <img src='/flower.png' alt='flower image' style={{height: '35px'}}/>
                </div>

                <div className='tabs'>
                    <button  className={`tabs-button ${loginForm ? 'active-tab' : ''}`} onClick={inLoginForm}>Login</button>
                    <button className={`tabs-button ${signupForm ? 'active-tab': ''}`} onClick={inSignupForm}>Signup</button>
                </div>

                {loginForm && (
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input type='email' id='email' value={email} onChange={handleEmailChange} placeholder='Email Address'/>
                            </div>
                            <div className='form-group'>
                                <input type='password' id='password' value={password} onChange={handlePassword} placeholder='Password'/>
                            </div>
                            <p className='forgot-password'>
                               <a href='#'>Forgot password?</a> 
                            </p>
                            <button type='submit' className='sign-up-buttons'>Log in</button>
                        </form>  

                        <p className='switch'>
                                Not a member? <a href='#' onClick={onSwitch}>Signup now</a>
                        </p> 
                    </>    
                )}
                
                {signupForm && (
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input type='username' id='username' value={username} onChange={handleUsernameChange} placeholder='Username'/>
                            </div> 
                            <div className="form-group">
                                <input type='email' id='email' value={email} onChange={handleEmailChange} placeholder='Email Address'/>
                            </div>
                            <div className='form-group'>
                                <input type='password' id='password' value={password} onChange={handlePassword} placeholder='Password'/>
                                {/* <AiOutlineEye/> */}
                            </div>
                            <button type='submit' className='sign-up-buttons'>Sign up</button>
                        </form>
                        
                        <p className='switch'>
                            Already a member?<a href='#' onClick={onSwitch}> Login</a>
                        </p>
                    </>
                )}

           

            </div>

        </div>

    )




}
export default AuthModal;