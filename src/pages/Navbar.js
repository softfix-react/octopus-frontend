import React, { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { CgProfile } from "react-icons/cg";
import { Button } from 'react-bootstrap';

import { ToastContainer, toast } from 'react-toastify';

import { Form } from 'react-bootstrap';
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { UserContext } from '../App';

const Navbar = () => {

    const token = Cookies.get('token');
    // const userdata1 = useContext(UserContext)


    const navigator = useNavigate();
    const [modalShow, setModalShow] = React.useState(false);
    const [modalShow1, setModalShow1] = React.useState(false);

    let [formData, setFormData] = useState({
        apiKey: "",
        apiSecret: "",
        clientId: "",
        clientPassword: "",
        totpKey: ""
    })

    const [lotSize1, setLotSize1] = useState({ lotSize: "" })
    const setInputData1 = (e) => {
        const { name, value } = e.target;
        setLotSize1({ ...lotSize1, [name]: value })
    }


    const updateLotSize = async (e) => {
        e.preventDefault();
        try {
            const lotSize = await axios.post(`${process.env.REACT_APP_BASE_URL}api/user/update-settings`, {
                ...lotSize1
            }, {
                headers: {
                    'Authorization': token
                }
            });
            // console.log(lotSize.data)

            toast(lotSize.data.msg)
            setModalShow1(false);
        } catch (error) {
            console.log(error);
        }

    }

    const setInputData = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })

    }

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

            toast(userData.data.msg)
            setModalShow(false);

            // console.log("userdata", userData);
        } catch (error) {
            // alert(error.response.data.errors)
            toast(error.response.data.errors)
            console.log(error.response.data.errors)
        }
    }

    const logout = () => {
        Cookies.remove('token')
        // console.log('logout');
        navigator('/')
    }

    const [userDetails, setUserDetails] = useState({
        apiKey: "",
        apiSecret: "",
        clientId: "",
        clientPassword: "",
        totpKey: ""
    });



    const setUserData = async () => {

        try {
            const data = await axios.get(`${process.env.REACT_APP_BASE_URL}api/user/user-details`, {
                headers: {
                    'Authorization': token
                }
            })
            // console.log(data.data.data)
            setUserDetails(data.data.data)
        }
        catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        // setUserDetails(userdata1?.data?.data)
        setUserData()
    }, [])

    useEffect(() => {

        // Update formData when userDetails change
        setFormData(userDetails);
        setLotSize1(userDetails)
    }, [userDetails]);

    return (
        <>

            <div className={modalShow1 ? 'blockElement' : 'hideElement'} >
                <div className='formbox'>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem" }}>
                        <p style={{ margin: "0px" }}>update-settings</p>
                        <IoMdClose onClick={() => setModalShow1(false)} />
                    </div>
                    <hr />
                    <Form>
                        <Form.Group className="mb-1">
                            <Form.Label>LotSize</Form.Label>
                            <Form.Control name='lotSize' value={lotSize1?.lotSize} onChange={setInputData1} type="text" placeholder="lotSize" />
                        </Form.Group>
                        <Button onClick={updateLotSize} className='center' variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>




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
                            <Form.Control name='apiKey' value={formData?.apiKey} onChange={setInputData} type="text" placeholder="apiKey" />
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label>ApiSecret</Form.Label>
                            <Form.Control name='apiSecret' value={formData?.apiSecret} onChange={setInputData} type="text" placeholder="apiSecret" />
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label>ClientId</Form.Label>
                            <Form.Control name='clientId' value={formData?.clientId} onChange={setInputData} type="text" placeholder="clientId" />
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label>ClientPassword</Form.Label>
                            <Form.Control name='clientPassword' value={formData?.clientPassword} onChange={setInputData} type="text" placeholder="clientPassword" />
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label>TotpKey</Form.Label>
                            <Form.Control name='totpKey' value={formData?.totpKey} onChange={setInputData} type="text" placeholder="totpKey" />
                        </Form.Group>
                        <Button onClick={getData} className='center' variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>



            <div className='profile' style={{ textAlign: "right", margin: "3px" }}>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <CgProfile style={{ fontSize: "1.4rem" }} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigator('/home')} >Dashboard</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigator('/profile')} >profile</Dropdown.Item>
                        <Dropdown.Item onClick={() => setModalShow1(true)} >User Settings</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigator('/orders')} >My Orders</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigator('/daily-report')} >Daily Report</Dropdown.Item>
                        <Dropdown.Item onClick={() => setModalShow(true)}  >Zerodha Credentials</Dropdown.Item>
                        <Dropdown.Item ><Button variant="" className='buttonpadding' style={{ padding: "0px" }} onClick={logout} >LogOut</Button></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>


            </div>
            <ToastContainer />

        </>
    )
}

export default Navbar       