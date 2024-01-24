import React, { useState } from 'react'
import Cookies from 'js-cookie';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Registration from './Registration';

const OtpValidation = ({ email, type }) => {

    // console.log("otptypevalue", type);
    const [openRegistration, setOpenRegistration] = useState(false)
    const [userDetails, setUserDetails] = useState([])


    const navigator = useNavigate();
    const [otp, setOtp] = useState();
    // console.log("otp", otp);
    const [credentials, setCredentials] = useState({
        type: type,
        value: email,
        otp: otp,
    })


    const handleOTP = (value) => {
        const numericValue = value.replace(/\D/g, '');

        setOtp(numericValue);
        // setOtp(value);
        setCredentials(prev => ({
            ...prev,
            otp: numericValue
        }))
    }

    // console.log("credentials", credentials)
    // console.log("type and value", email)

    const verify = async (e) => {
        e.preventDefault();
        try {
            const verify = await axios.post(`${process.env.REACT_APP_BASE_URL}api/user/verify-otp`, credentials);
            console.log("verifyemail", verify.data);

            if (verify.data.data.isRegistered === true) {
                
                toast(verify.data.msg)
                const token = verify.data.data.token;
                // console.log('Before setting token:', token);
                Cookies.set('token', token)
                setUserDetails(verify.data)
                navigator('/afterOtp');


            }
            else {

                setOpenRegistration(true)
                // navigator('/registration');
            }
        } catch (error) {
            toast(error.response.data.msg)
            console.log(error)
        }
    }

    console.log("userdata", userDetails)

    return (
        <>
            {
                !openRegistration ?
                    <div className='registration-container'>
                        <Row className='registration-container-row-otp'>
                            <p className='h'>Project Octopus</p>
                            <form>
                                <div className="verifylableinput12" >
                                    <p>OTP VARIFICATION</p>
                                    <OtpInput className="inputotp"
                                        value={otp}
                                        onChange={handleOTP}
                                        numInputs={4}
                                        isInputNum={true}
                                        renderInput={(props) => <input name='otp'  {...props} />}
                                    />
                                    <button onClick={verify} className='otp-button'>Verify</button>
                                </div>
                            </form>
                        </Row>
                    </div>
                    :
                    <Registration type={type} />
            }

            <ToastContainer />
        </>
    )
}



export default OtpValidation