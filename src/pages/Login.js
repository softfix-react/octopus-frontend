import React, { useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import re from '../imgs/re.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import OtpValidation from './OtpValidation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

    const [loginotp, setLoginOtp] = useState(false);

    const [loginInput, setLoginInput] = useState({
        type: "email",
        value: ""
    });

    const email = loginInput.value;
    const type = loginInput.type;
    // console.log("loginType", type)
    // console.log("email", loginInput)

    const loginData = (e) => {

        const inputValue = e.target.value;
        const isNumber = /^\d+$/.test(inputValue);
        setLoginInput((prevLoginInput) => ({
            ...prevLoginInput,
            type: isNumber ? "mobile" : "email",
            value: inputValue,
        }));
        // setLoginInput({ ...loginInput, [e.target.name]: e.target.value })
    }



    const login = async (e) => {
        e.preventDefault();
        try {
            const login = await axios.post(`${process.env.REACT_APP_BASE_URL}api/user/login`, loginInput);
            // console.log("loginstatus", login);
            // alert(login.data.msg)

            toast(login.data.msg)
            setLoginOtp(true)
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <>
            {
                !loginotp ? <> <div className='registration-container'>

                    <Row className='registration-container-row'>
                        <Col sm={12} md={6} className='registration-container-col1' >
                            <h5>Project Octopus</h5>
                            <img src={re} alt="" />
                            <p>Don’t Have an Account ?  <Link to="/registration">Register Here</Link> </p>
                        </Col>
                        <Col sm={12} md={6} >
                            <form className='Registration-form'>
                                <h6>Login</h6>
                                <div style={{ display: "flex", gap: "18px", flexDirection: "column", width: "100%" }}>

                                    <div>
                                        <input className='inputs' name='value' value={loginInput.value} onChange={loginData} type='text'
                                            placeholder={loginInput.type === "mobile" ? 'Mobile Number' : 'Email Address'} />
                                    </div>
                                </div>
                                <button onClick={login} >Login</button>
                                <br />
                                <br />
                            </form>
                        </Col>
                    </Row>

                </div> </> : <>
                    <OtpValidation email={email} type={type} />
                </>
            }


            <ToastContainer />





        </>
    )
}


// Login.propTypes = {
//     setToken: PropTypes.func.isRequired
// }

export default Login