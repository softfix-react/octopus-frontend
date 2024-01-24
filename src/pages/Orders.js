import { Table } from 'antd'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Row } from 'react-bootstrap'

const Orders = () => {

    const token = Cookies.get('token');

    const [orderData, setOrderData] = useState([])

    const getOrderData = async () => {
        try {

            const data = await axios.get(`${process.env.REACT_APP_BASE_URL}api/user/my-orders`, {
                headers: {
                    'Authorization': token
                }
            })

            if (data.data.status) {

                setOrderData(data?.data?.data?.list)
            } else {
                setOrderData([])

            }
            // setOrderData(data?.data?.data?.list)
            console.log("orderData", data.data)

        } catch (error) {

            console.log(error)
        }
    }

    const dataSource = [
        ...orderData
    ];

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
            key: 'status',
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
            key: 'transaction_type',
        },
        {
            title: 'createdAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_, elem) => `${(new Date(elem?.updatedAt))?.toLocaleString()} `
        },
        {
            title: 'updatedAt',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (_, elem) => `${(new Date(elem?.updatedAt))?.toLocaleString()} `
        },
    ]

    useEffect(() => {
        getOrderData();
    }, [])

    return (
        <>
            <Navbar />
            <div className='registration-container'>
                <Row className='registration-container-row-otp'>
                    <h5>My Orders</h5>
                    <br />
                    <Table dataSource={dataSource} columns={columns} />
                </Row>
            </div></>
    )
}

export default Orders