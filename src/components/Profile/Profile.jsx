import React, { useEffect, useState } from 'react'
import {IconContext} from "react-icons";
import {FaRegUserCircle} from 'react-icons/fa'
import {Helmet} from 'react-helmet'
import EditUser from '../EditUser/EditUser.jsx';
import axios from 'axios';

export default function Profile({userData}) {

    let [data, setData] = useState(null)

    async function getUserDetails(){
        let token = localStorage.getItem('token')
        const {data} = await axios.get('https://todobackend-2mvb.onrender.com/user/getById',
        { headers: {"token" : `${token}`} })
        setData(data.user)
        // console.log(data.user);
    }

    useEffect(()=>{
        getUserDetails()
    }, [])
  return (
    <>
     <Helmet>
    <title>Profile Page</title>
   </Helmet>
    <div className="container pt-5">
        <div className='mx-auto'>
        <div className="text  text-center py-2">
                <h1 >Profile</h1>
        </div>
        <div className="container-fluid my-5 w-75 d-flex justify-content-evenly align-items-start">
    
        <div>
        <div className='d-flex'>
            <h4 className='my- text-capitalize'>Welcome, </h4>
            <h4 className='ms-4'> {data?.name}</h4>
        </div>
        <div className='d-flex my-4'>
            <h4 className='my- text-capitalize'>ID :</h4>
            <h4 className='ms-4'> {data?._id}</h4>
        </div>

        <div className='d-flex'>
            <h4 className='my- text-capitalize'>Email :</h4>
            <h4 className='ms-4'> {data?.email}</h4>
        </div>
        <div className='d-flex my-4'>
            <h4>Age :</h4>
            <h4 className='ms-2'> {data?.age}</h4>
        </div>

        <EditUser data = {data} updateProfile = {getUserDetails}></EditUser>
        </div>

        </div>
        </div>
    </div>
    </>
  )
}
