import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IgrFinancialChart } from 'igniteui-react-charts';
import { IgrFinancialChartModule } from 'igniteui-react-charts';
import { Button, Col, Form, Row } from 'react-bootstrap';

import Select from 'react-select';
import Navbar from './Navbar';



IgrFinancialChartModule.register();

const Historical_data = () => {
    // GET TOKEN
    let token = Cookies.get('token');

    const params = useParams();
    const [intervalId, setIntervalId] = useState(null);
    const [selectData, setSelectData] = useState({
        select: ""
    })
    const [chartTitle, setChartTitle] = useState("Financial Prices"); // Initial title

    let [historical_data, setHistorical_data] = useState([])
    let [ema12, setEma12] = useState([])
    let [vwap, setVwap] = useState([])
    let [VOLSMA20, setVOLSMA20] = useState([])

    const [bodydata, setbodydata] = useState({
        instrument_token: params.id,
        interval: "day",
        fromDate: `${new Date().getFullYear()}-01-01`,
        toDate: new Date().toISOString().split('T')[0],
    })

    // console.log("select value", selectData.select)


    const [selectedData, setSelectedData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([{ value: 'historical_data', label: 'Historical Data' }]);

    useEffect(() => {
        const selectedValues = selectedOptions.map(option => option.value);
        const selectedDataArray = selectedValues.map(value => {
            switch (value) {
                case "historical_data":
                    return historical_data;
                case "vwap":
                    return vwap;
                case "ema12":
                    return ema12;
                case "volsma20":
                    return VOLSMA20;
                default:
                    return null;
            }
        });

        // Update the selectedData state
        setSelectedData(selectedDataArray);
    }, [selectedOptions, historical_data, ema12, vwap, VOLSMA20]);


    const options = [
        { value: 'historical_data', label: 'Historical Data' },
        { value: 'ema12', label: 'EMA12' },
        { value: 'volsma20', label: 'VOLSMA20' },
        { value: 'vwap', label: 'VWAP' },
    ];


    const onchangeSelect = (e) => {
        const selectedValue = e.target.value;
        setSelectData({ ...selectData, [e.target.name]: e.target.value })

        // graph title Change
        switch (selectedValue) {
            case "historical_data":
                setChartTitle("Historical Data");
                break;
            case "vwap":
                setChartTitle("VWAP");
                break;
            case "ema12":
                setChartTitle("EMA12");
                break;
            case "volsma20":
                setChartTitle("VOLSMA20");
                break;
            case "MultiSelect":
                setChartTitle("Historical Data , EMA12 , VOLSMA20");
                break;
            default:
                setChartTitle("Financial Prices"); // Default title
                break;
        }
    }


    const onChangeSelect = (selected) => {
        setSelectedOptions(selected);
    };

    historical_data.__dataIntents = {
        close: ["SeriesTitle/historical_data"],
    };

    ema12.__dataIntents = {
        close: ["SeriesTitle/ema12"],
    };
    VOLSMA20.__dataIntents = {
        close: ["SeriesTitle/VOLSMA20"],
    };



    let data = [];


    const setdate = (e) => {
        setbodydata({ ...bodydata, [e.target.name]: e.target.value })
    }


    const historicalData = async (e) => {

        try {
            const history = await axios.post(`${process.env.REACT_APP_BASE_URL}api/user/historical-data`, {
                ...bodydata
            }, {
                headers: {
                    'Authorization': token
                }
            })
            setHistorical_data(history.data.data.history.map((elm, ind) => ({ ...elm, date: new Date(elm.date) })))
            setVwap(history.data.data.vwap.map((elm, ind) => ({ ...elm, date: new Date(elm.date) })))
            setEma12(history.data.data.ema12.map((elm, ind) => ({ ...elm, date: new Date(elm.date) })))
            setVOLSMA20(history.data.data.volsma20.map((elm, ind) => ({ ...elm, date: new Date(elm.date) })))

        } catch (error) {
            console.log(error)
        }
    }


    const historicalData1 = (e) => {
        e.preventDefault();
        historicalData();

        if (intervalId) {
            clearInterval(intervalId);
        }
        const newIntervalId = setInterval(() => {
            historicalData();
        }, 5000);
        setIntervalId(newIntervalId);
    };

    useEffect(() => {
        historicalData();
        const newIntervalId = setInterval(() => {
            historicalData();
        }, 5000);
        setIntervalId(newIntervalId);

        return () => {
            clearInterval(newIntervalId);
        };
    }, []);


    return (
        <>
            <Navbar />

            <div style={{ margin: "1rem" }}>
                <Form>
                    <Row >
                        <Col>
                            <Form.Label>from</Form.Label>
                            <Form.Control type="date" name='fromDate' value={bodydata.fromDate} onChange={setdate} placeholder='fromDate' />
                        </Col>
                        <Col>
                            <Form.Label>to</Form.Label>
                            <Form.Control type="date" name='toDate' value={bodydata.toDate} onChange={setdate} placeholder='toDate' />
                        </Col>
                        <Col>
                            <Form.Label>interval</Form.Label>
                            <Form.Select aria-label="Default select example" name='interval' onChange={setdate}>
                                <option value="day">day</option>
                                <option value="minute">minute</option>
                                <option value="3minute">3minute</option>
                                <option value="5minute">5minute</option>
                                <option value="10minute">10minute</option>
                                <option value="15minute">15minute</option>
                                <option value="30minute">30minute</option>
                                <option value="60minute">60minute</option>
                            </Form.Select>
                        </Col>
                        <Col >
                            <Button style={{ marginTop: "1.9rem" }} onClick={historicalData1}>set</Button>
                        </Col>
                    </Row>
                </Form>
            </div>



            <div className="container sample" style={{ width: "100%", height: "80vh" }} >
                <div className="container" >
                    <Select
                        isMulti
                        options={options}
                        value={selectedOptions}
                        onChange={onChangeSelect}
                        placeholder="Select options..."
                    />

                    <IgrFinancialChart
                        width="100%"
                        height="100%"
                        isToolbarVisible={false}
                        chartType="auto"
                        chartTitle={chartTitle}
                        titleAlignment="Left"
                        titleLeftMargin="25"
                        titleTopMargin="10"
                        titleBottomMargin="10"
                        subtitleAlignment="Left"
                        subtitleLeftMargin="25"
                        subtitleTopMargin="5"
                        subtitleBottomMargin="10"
                        negativeOutlines="rgb(213, 94, 0)"
                        yAxisLabelLocation="OutsideLeft"
                        yAxisMode="Numeric"
                        yAxisTitle="Financial Prices"
                        yAxisTitleLeftMargin="10"
                        yAxisTitleRightMargin="5"
                        yAxisLabelLeftMargin="0"
                        zoomSliderType="None"
                        dataSource={selectedData}

                    >
                    </IgrFinancialChart>
                </div>
            </div >
        </>
    )
}

export default Historical_data