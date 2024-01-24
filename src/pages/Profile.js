import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from '../App';
import Navbar from './Navbar';

const Profile = () => {
    let token = Cookies.get('token');

    // const userdata1 = useContext(UserContext)

    // console.log("profileuserDetails", userdata1?.data?.data)


    const [profileUpdate, setProfileUpdate] = useState({
        firstName: "",
        lastName: ""
    })

    const changeData = (e) => {
        setProfileUpdate({ ...profileUpdate, [e.target.name]: e.target.value })
    }

    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: ""
    });



    const setUserData = async () => {
        try {
            const data = await axios.get(`${process.env.REACT_APP_BASE_URL}api/user/user-details`, {
                headers: {
                    'Authorization': token
                }
            })
            console.log(data.data.data)
            setUserDetails(data.data.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setUserData()
    }, [])

    useEffect(() => {
        setProfileUpdate(userDetails);
    }, [userDetails]);


    const update = async (e) => {
        e.preventDefault();
        try {
            const updateResponse = await axios.put(`${process.env.REACT_APP_BASE_URL}api/user/profile`, {
                ...profileUpdate
            }, {
                headers: {
                    'Authorization': token
                }
            });
            toast(updateResponse?.data?.msg)
            // console.log(updateResponse)

        }
        catch (error) {
            toast(error?.response?.data?.msg)
            toast(error?.response?.data?.errors)
            console.log(error)
        }

    }

    return (
        <>
            <Navbar />
            <div className='registration-container'>

                <div className='registration-container-row-otp'>
                    <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>profile</h2>

                    <Form>
                        <Row>
                            <Col xs={12} sm={6} >
                                <Form.Control className='my-2' name='firstName' value={profileUpdate?.firstName} onChange={changeData} placeholder="First Name" />
                            </Col>
                            <Col xs={12} sm={6} >
                                <Form.Control className='my-2' name='lastName' value={profileUpdate?.lastName} onChange={changeData} placeholder="Last Name" />
                            </Col>
                            <Col xs={12} sm={6} >
                                <Form.Control className='my-2' value={userDetails?.email} disabled placeholder="Email" />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Control className='my-2' value={userDetails?.mobile} disabled placeholder="Mobile" />
                            </Col>
                        </Row>
                        <Button onClick={update}>Update</Button>

                    </Form>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Profile