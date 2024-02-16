import React, { useContext, useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import Cookies from 'js-cookie';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

import { ToastContainer, toast } from 'react-toastify';
// import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { IoMdClose } from "react-icons/io";
import Navbar from './Navbar';
import { UserContext } from '../App';




const AfterOtp = () => {


    // const userdata1 = useContext(UserContext)
    const [userData, setUserData] = useState([])
    const [userData12, setUserData12] = useState([])

    // console.log("userdata123", userData12.firstName)
    const [modalShow, setModalShow] = React.useState(false);
    let [formData, setFormData] = useState({
        apiKey: "",
        apiSecret: "",
        clientId: "",
        clientPassword: "",
        totpKey: ""
    })


    const navigator = useNavigate();


    const setInputData = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })

    }
    const token = Cookies.get('token');
    // console.log("token12", token)

    const getData = async (e) => {
        e.preventDefault();
        try {
            const userData = await axios.post(`${process.env.REACT_APP_BASE_URL}api/user/zerodha-credentials-save`, {
                ...formData
            }, {
                headers: {
                    'Authorization': token
                }
            });
            // console.log(userData.data)

            toast(userData?.data?.msg)
            setModalShow(false);
            autoLogin();
            // console.log("userdata", userData);
        } catch (error) {
            // alert(error.response.data.errors)
            toast(error?.response?.data?.errors)
            console.log(error)
        }
    }

    const autoLogin = async () => {
        try {
            const login = await axios.get(`${process.env.REACT_APP_BASE_URL}api/user/auto-login`, {
                headers: {
                    'Authorization': token
                }
            })

            toast(login.data.msg)
            if (login?.data?.status === false) {
                navigator('/afterOtp')
            }
            else {
                navigator('/home')
            }
        } catch (error) {
            toast(error?.response?.data?.msg)
            console.log(error)
        }
    }

    const userDetails = async () => {
        try {
            const userDetail = await axios.get(`${process.env.REACT_APP_BASE_URL}api/user/user-details`, {
                headers: {
                    'Authorization': token
                }
            })
            setUserData12(userDetail.data.data)
            // console.log("playdata", userDetails)
        } catch (error) {
            console.log(error);

        }
    }

    // useEffect(() => {

    // }, [])

    useEffect(() => {
        // setUserData(userdata1?.data?.data)
        userDetails()
        autoLogin();
    }, [])

    if (!token) {
        { return <Login /> }
    }
    else {
        return (
            <>

                <Navbar />
                <ToastContainer />
                <div className={modalShow ? 'blockElement' : 'hideElement'} >
                    <div className='formbox'>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem" }}>
                            <p style={{ margin: "0px" }}>Login Zerodha Credentials</p>
                            <IoMdClose onClick={() => setModalShow(false)} />
                        </div>
                        <hr />
                        <Form>
                            <Form.Group className="mb-1">
                                <Form.Label>ApiKey</Form.Label>
                                <Form.Control name='apiKey' value={formData.apiKey} onChange={setInputData} type="text" placeholder="apiKey" />
                            </Form.Group>
                            <Form.Group className="mb-1">
                                <Form.Label>ApiSecret</Form.Label>
                                <Form.Control name='apiSecret' value={formData.apiSecret} onChange={setInputData} type="text" placeholder="apiSecret" />
                            </Form.Group>
                            <Form.Group className="mb-1">
                                <Form.Label>ClientId</Form.Label>
                                <Form.Control name='clientId' value={formData.clientId} onChange={setInputData} type="text" placeholder="clientId" />
                            </Form.Group>
                            <Form.Group className="mb-1">
                                <Form.Label>ClientPassword</Form.Label>
                                <Form.Control name='clientPassword' value={formData.clientPassword} onChange={setInputData} type="text" placeholder="clientPassword" />
                            </Form.Group>
                            <Form.Group className="mb-1">
                                <Form.Label>TotpKey</Form.Label>
                                <Form.Control name='totpKey' value={formData.totpKey} onChange={setInputData} type="text" placeholder="totpKey" />
                            </Form.Group>
                            <Button onClick={getData} className='center' variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>

                <div className='registration-container'>
                    <Row className='registration-container-row-otp'>
                        <div className='container-up-box'>
                            <div className='container-up-box1'>
                                <h6>Project Octopus</h6>
                                <p>Hi {userData12.firstName} {userData12.lastName}  !</p>
                            </div>
                        </div>
                        <div className='note'>
                            <p>Note : </p>
                            <ol>
                                <p>" Click on the 'Zerodha API Credentials' button to automatically log in with your credentials."</p> </ol>
                        </div>
                        <div className='container-mid-box'>
                            <button onClick={() => setModalShow(true)}>Login Zerodha API Credentials</button>

                        </div>
                    </Row>
                </div>
                <ToastContainer />

            </>
        )
    }
}

export default AfterOtp