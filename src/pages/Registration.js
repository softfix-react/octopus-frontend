import React, { useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import re from '../imgs/re.png'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

const Registration = ({ type }) => {
    const navigator = useNavigate();

    // const contextdata = useContext()
    console.log("typeRegistration", type)


    const [inputData, setInputData] = useState({
        type: type,
        value: "",
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        aadhar: "",
        pan: "",

    })

    const setData = (e) => {
        const { name, value } = e.target;
        if (name === type) {
            setInputData(prev => ({
                ...prev,
                [name]: value,
                value: value,
            }))
        } else {
            setInputData(prev => ({
                ...prev,
                [name]: value,
            }))
        }
    }
    const senddata = async (e) => {
        e.preventDefault();
        try {
            const data = await axios.post(`${process.env.REACT_APP_BASE_URL}api/user/register`, inputData);
            console.log(data);
            alert(data.data.msg)
            Cookies.set('token', data.data.data.token)
            if (data.data.isRegistered === true) {
                navigator('/')
            }
            else {
                navigator('/afterOtp')
            }

        } catch (error) {
            toast(error.response.data.errors)
            toast(error.response.data.msg)
            // alert(error.response.data.msg)
            console.log(error);
        }
    }
    return (
        <>

            <div className='registration-container'>
                <Row className='registration-container-row'>
                    <Col sm={12} md={6} className='registration-container-col1' >
                        <h5>Project Octopus</h5>
                        <img src={re} alt="" />
                        <p>Already Have an Account ?  <Link to="/">Login Here</Link> </p>
                    </Col>
                    <Col sm={12} md={6} >
                        <form className='Registration-form'>
                            <h6>Registration</h6>
                            <div style={{ display: "flex", gap: "18px", flexDirection: "column", width: "100%" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }} >
                                    <input className='inputs1' name='firstName' value={inputData.firstName} onChange={setData} type="text" placeholder='First Name' />
                                    <input className='inputs1' name='lastName' value={inputData.lastName} onChange={setData} type="text" placeholder='Last Name' />
                                </div>
                                <div>
                                    <input className='inputs' name='email' value={inputData.email} onChange={setData} type="email" placeholder='Email Address' />
                                </div>
                                <div>
                                    <input className='inputs' name='mobile' value={inputData.mobile} onChange={setData} type="text" placeholder='+91' />
                                </div>
                                <div>
                                    <input className='inputs' name='aadhar' value={inputData.aadhar} onChange={setData} type="text" placeholder='Aadhar Number' />
                                </div>
                                <div>
                                    <input className='inputs' name='pan' value={inputData.pan} onChange={setData} type="text" placeholder='Pan Number' />
                                </div>
                            </div>
                            <button onClick={senddata}>Registration</button>
                        </form>
                    </Col>
                </Row>
            </div>

            <ToastContainer />

        </>
    )
}

export default Registration