import React, { useCallback, useContext, useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Cookies from 'js-cookie';
import Login from './Login';
import Navbar from './Navbar';
import { Table } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import Marquee from "react-fast-marquee";

import { ToastContainer, toast } from 'react-toastify';

const Home = () => {
    const token = Cookies.get('token');
    // console.log("token12", token)

    // const userdata1 = useContext(UserContext)
    const [userData, setUserData] = useState([])
    const [data1, setData1] = useState([])

    const [notification, setNotification] = useState([])

    // console.log(notification?.data?.message)

    const playStop = async (type, recordType) => {
        try {
            const playstop = await axios.post(`${process.env.REACT_APP_BASE_URL}api/user/update-button-settings`, {
                type: type,
                recordType: recordType
            }, {
                headers: {
                    'Authorization': token
                }
            })
            toast(playstop.data.msg)
            // console.log("playstop", playstop)
        } catch (error) {
            console.log("error", error)
        }
    }


    // console.log("UserContext1", userData)

    const navigator = useNavigate();

    // console.log("instumentData", data1);

    const instumentData = useCallback(async () => {
        try {
            const data = await axios.get(`${process.env.REACT_APP_BASE_URL}api/user/instument-data`, {
                headers: {
                    'Authorization': token
                }
            })
            // console.log("instumentData", data)
            setData1(data.data.data)
        } catch (error) {
            console.log(error)
        }
    }, [token])


    const userDetails = async () => {
        try {
            const userDetail = await axios.get(`${process.env.REACT_APP_BASE_URL}api/user/user-details`, {
                headers: {
                    'Authorization': token
                }
            })
            setUserData(userDetail.data.data)
            // console.log("playdata", userDetails)
        } catch (error) {
            console.log(error);

        }
    }

    const userNotification = async () => {
        try {
            const notification = await axios.get(`${process.env.REACT_APP_BASE_URL}api/user/user-notification`, {
                headers: {
                    'Authorization': token
                }
            })
            // console.log("userNotification", notification.data)
            setNotification(notification.data)

        } catch (error) {
            console.log("userNotification error", error);
        }
    }

    const gotoHistoricalData = (token) => {
        // console.log("historical_token", token);
        navigator(`/historical_data/${token}`)

    }
    useEffect(() => {
        // setUserData(userdata1?.data?.data)
        userDetails()
        instumentData();
    }, [instumentData])



    useEffect(() => {
        userNotification();

        const intervalId = setInterval(() => {
            userNotification();
        }, 20000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, [])



    const dataSource = [...data1];

    const columns = [
        {
            title: 'Action',
            render: (_, elem) => {
                return (
                    <>
                        <button onClick={() => gotoHistoricalData(elem.instrument_token)} className='tableButton'>Historical_data</button>
                    </>
                )
            }
        },
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Exchange',
            dataIndex: 'exchange',
            key: 'exchange',
        },
        {
            title: 'Exchange_token',
            dataIndex: 'exchange_token',
            key: 'exchange_token',
        },
        {
            title: 'instrument_token',
            dataIndex: 'instrument_token',
            key: 'instrument_token',
        },
        {
            title: 'instrument_type',
            dataIndex: 'instrument_type',
            key: 'instrument_type',
        },
        {
            title: 'last_price',
            dataIndex: 'last_price',
            key: 'last_price',
        },
        {
            title: 'lot_size',
            dataIndex: 'lot_size',
            key: 'lot_size',
        },
        {
            title: 'segment',
            dataIndex: 'segment',
            key: 'segment',
        },
        {
            title: 'strike',
            dataIndex: 'strike',
            key: 'strike',
        },
        {
            title: 'tick_size',
            dataIndex: 'tick_size',
            key: 'tick_size',
        },
        {
            title: 'tradingsymbol',
            dataIndex: 'tradingsymbol',
            key: 'tradingsymbol',
        },

    ];


    if (!token) {
        return <Login />
    }
    return (
        <>
            <Navbar />

            {
                notification.status ?
                    // <div className='notification-container'>
                    //     <p className='m-0'>{notification.msg}</p>
                    // </div>
                    <div className='notification-container'>
                        <Marquee>
                            {notification?.data?.message}
                        </Marquee>
                    </div>
                    : ""
            }
            <div className='registration-container'>


                {/* <div className='notification-container'>
                    <Marquee>
                        I can be a React component, multiple React components, or just some text.
                    </Marquee>

                </div> */}



                <Row className='registration-container-row-otp'>
                    <div className='container-up-box'>
                        <div className='container-up-box1'>
                            <h6>Project Octopus</h6>
                            <p>Hi  {userData?.firstName} {userData?.lastName} !</p>
                        </div>
                        <div className='container-up-box1'>
                            <button>Lot Size : {userData?.lotSize}</button>
                        </div>
                    </div>
                    <div className='container-mid-box'>
                        <div className='box' >
                            <button onClick={() => playStop("play", 1)}  >Play</button>
                            <button onClick={() => playStop("play", 0)} >Stop</button>
                        </div>
                        <hr className='hrtag' />
                        <div className='box' >
                            <button onClick={() => playStop("recording", 1)}>Start Recording</button>
                            <button onClick={() => playStop("recording", 0)}>Stop Recording</button>
                        </div>
                    </div>
                    <div className='note'>
                        <p>Note : </p>
                        <ol>
                            <li>Play Button: "Click 'Play' to start retrieving and storing trading instruments data."</li>
                            <li>Stop Button: "Click 'Stop' to halt data retrieval and storage."</li>
                            <li>Start Recording Button: "Press 'Start Recording' to begin calculations and activate automated buy/sell decisions."</li>
                            <li>Stop Recording Button: "Press 'Stop Recording' to cease all calculations and automated trading activities."</li>
                        </ol>
                    </div>
                </Row>
            </div>

            <br />
            <div style={{ width: "90%", margin: "1rem auto", overflow: "auto" }}>
                <Table dataSource={dataSource} columns={columns} />;
            </div>
            <ToastContainer />
        </>
    )


}

export default Home