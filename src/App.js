import logo from './logo.svg';
import './App.css';
import Registration from './pages/Registration';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OtpValidation from './pages/OtpValidation';
import AfterOtp from './pages/AfterOtp';
import Home from './pages/Home';
import Historical_data from './pages/Historical_data';
import Profile from './pages/Profile';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { create } from 'd3';
import Cookies from 'js-cookie';
import Orders from './pages/Orders';
import Navbar from './pages/Navbar';

// export const UserContext = createContext();

function App() {

  const token = Cookies.get('token');
  const [userData, setUserData] = useState([])

  // const userDetails = async () => {
  //   try {
  //     const userDetails = await axios.get(`${process.env.REACT_APP_BASE_URL}api/user/user-details`, {
  //       headers: {
  //         'Authorization': token
  //       }
  //     })
  //     setUserData(userDetails)
  //     console.log("playdata", userDetails)
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  // useEffect(() => {
  //   userDetails()
  // }, [])


  return (
    <>

      <BrowserRouter>
        {/* <UserContext.Provider value={userData}> */}

        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/historical_data/:id' element={<Historical_data />} />
          <Route path='/afterOtp' element={<AfterOtp />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/home' element={<Home />} />
        </Routes>
        {/* </UserContext.Provider> */}
      </BrowserRouter>




    </>
  );
}

export default App;
