import React, { useEffect, useState } from 'react'
import Navbar from '../pages/Navbar'
import { Button, Col, Form, Row } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'js-cookie'

const DailyReport = () => {
    // get token 
    let token = Cookies.get('token');


    const [dailyData, setDailyData] = useState([])


    // cred for get daily-report
    const [date, setDate] = useState({
        fromDate: `${new Date().getFullYear()}-01-01`,
        toDate: new Date().toISOString().split('T')[0]
    })

    // filter onchnage function 
    const onchangeData = (e) => {
        setDate({ ...date, [e.target.name]: e.target.value })
    }


    // get daily-report
    const dailyReportData = async (e) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/user/get-daily-report`, {
                ...date
            }, {
                headers: {
                    'Authorization': token
                }
            })
            setDailyData(response?.data.data)
            // console.log(response?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        dailyReportData()
    }, [])



    return (
        <>
            <Navbar />
            <div className='registration-container'>
                <div className='registration-container-row-otp'>
                    <h3>Daily Report</h3>
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
                                    {/* <Form.Label>.</Form.Label> */}
                                    <Button style={{ marginTop: "1.9rem" }} onClick={dailyReportData}>set</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div className='row mt-4'>
                        <div class=" col-6 col-sm-3 gy-4 text-center " >
                            <div className='border p-3 text-secondary'>
                                <h5>Total Invest</h5>
                                <h2>{dailyData?.totalInvest}</h2>
                            </div>
                        </div>
                        <div class="col-6 col-sm-3 gy-4 text-center" >
                            <div className={((dailyData?.totalOutput) < 0) ? 'border p-3 text-danger' : 'border p-3 text-secondary'}>
                                <h5>Total Output</h5>
                                <h2>{dailyData?.totalOutput}</h2>
                            </div>
                        </div>
                        <div class=" col-6 col-sm-3 gy-4 text-center" >
                            <div className={((dailyData?.totalProfit) < 0) ? 'border p-3 text-danger' : 'border p-3 text-secondary'}>
                                <h5>Total Profit</h5>
                                <h2>{dailyData?.totalProfit}</h2>
                            </div>
                        </div>
                        <div class=" col-6 col-sm-3 gy-4 text-center" >
                            <div className={((dailyData?.profitPercentage) < 0) ? 'border p-3 text-danger' : 'border p-3 text-secondary'}>
                                <h5>Profit Percentage</h5>
                                <h2>{dailyData?.profitPercentage}%</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DailyReport