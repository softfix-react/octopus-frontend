import { Select, Table } from 'antd'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Button, Col, Form, Row } from 'react-bootstrap'

const Orders = () => {

    const token = Cookies.get('token');

    // console.log("token", token)

    const [date, setDate] = useState({
        fromDate: "",
        toDate: "",
        status: "",
        transaction_type: ""
    })
    // console.log(date)
    const onchangeData = (e) => {
        setDate({ ...date, [e.target.name]: e.target.value })
    }



    const [orderData, setOrderData] = useState([])

    const getOrderData = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}api/user/my-orders`, {
                ...date
            }, {
                headers: {
                    'Authorization': token
                }
            })

            // console.log("orderData", res.data)
            setOrderData(res?.data?.data?.list)


        } catch (error) {

            console.log(error)
        }
    }



    const dataSource = orderData;

    const columns = [

        {
            title: 'Order Id',
            dataIndex: 'order_id',
            key: 'order_id',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                {
                    text: 'Pending',
                    value: 'PENDING',
                },
                {
                    text: 'Complete',
                    value: 'COMPLETE',
                },
                {
                    text: 'Rejected',
                    value: 'REJECTED',
                },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
        },
        {
            title: 'stoploss',
            dataIndex: 'stoploss',
            key: 'stoploss',
        },
        {
            title: 'Trailing Stoploss',
            dataIndex: 'trailing_stoploss',
            key: 'trailing_stoploss',
        },
        {
            title: 'Trading Symbol',
            dataIndex: 'tradingsymbol',
            key: 'tradingsymbol',
        },
        {
            title: 'Transaction Type',
            dataIndex: 'transaction_type',
            filters: [
                {
                    text: 'Buy',
                    value: 'BUY',
                },
                {
                    text: 'Sell',
                    value: 'SELL',
                },

            ],
            onFilter: (value, record) => record.transaction_type.indexOf(value) === 0,
        },
        {
            title: 'createdAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_, elem) => `${(new Date(elem?.createdAt))?.toLocaleString()} `
        },
        {
            title: 'updatedAt',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (_, elem) => `${(new Date(elem?.updatedAt))?.toLocaleString()} `
        },
    ]

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    // const handleChange = (value: string) => {
    //     console.log(`selected ${value}`);
    // };

    const setFilter = () => {
        getOrderData();
    }

    useEffect(() => {
        getOrderData();
    }, [])




    return (
        <>
            <Navbar />
            <div className='registration-container'>
                <Row className='registration-container-row-otp'>

                    <div className="d-flex justify-content-between mb-2">
                        <h5>My Orders</h5>
                    </div>

                    <div style={{ margin: "1rem 0rem" }}>
                        <Form>
                            <Row >
                                <Col>
                                    <Form.Label>from</Form.Label>
                                    <Form.Control type="date" name='fromDate' value={date.fromDate} onChange={onchangeData} placeholder='fromDate' />
                                </Col>
                                <Col>
                                    <Form.Label>to</Form.Label>
                                    <Form.Control type="date" name='toDate' value={date.toDate} onChange={onchangeData} placeholder='toDate' />
                                </Col>

                                <Col >
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select aria-label="Default select example" name='status' onChange={onchangeData}>
                                        <option>Select Status</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="REJECTED ">Rejected</option>
                                        <option value="COMPLETE">Complete</option>
                                    </Form.Select>
                                </Col>
                                <Col >
                                    <Form.Label>transaction_type</Form.Label>
                                    <Form.Select aria-label="Default select example" name='transaction_type' onChange={onchangeData}>
                                        <option>Transaction type</option>
                                        <option value="BUY">Buy</option>
                                        <option value="SELL">Sell</option>

                                    </Form.Select>
                                </Col>
                                <Col sm={2} >
                                    {/* <Form.Label>.</Form.Label> */}
                                    <Button style={{ marginTop: "1.9rem" }} onClick={setFilter} >set</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>


                    <br />
                    <div style={{ overflow: "auto" }}>

                        <Table dataSource={dataSource} columns={columns} onChange={onChange} />
                    </div>
                </Row>
            </div></>
    )
}

export default Orders