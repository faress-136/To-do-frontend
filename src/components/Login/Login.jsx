import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import "../NavBar/NavBar_module.css"
import axios from 'axios'
import Joi from 'joi'
import { useNavigate } from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {Spinner} from 'react-bootstrap'

export default function Login({saveUser}) {

  let navigate = useNavigate()

  let [user, setUser] = useState({
    email: "",
    password: "",
  })

  let [apiError, setApiError] = useState(null)
  let [isLoading, setIsLoading] = useState(false)
  let [valiationError, setValidationError] = useState([])

  let getUserData = (e)=>{
    let myUser = {...user}
    myUser[e.target.name] = e.target.value
    setUser(myUser)
  }

  let signIn = async (e)=>{
    e.preventDefault()
    if(validateSignIn()){
      setIsLoading(true)
      let {data} = await axios.post('https://todobackend-2mvb.onrender.com/user/signin', user)
      // console.log(data);
      if(data.message == "Success"){
        localStorage.setItem('token', data.token)
        saveUser()
        setIsLoading(false)
        setApiError(null)
        navigate('/')
      }
      else{
        setIsLoading(false)
        setApiError(data.message)
      }
    }
    
  }

  function validateSignIn(){
    const schema = Joi.object({
      email: Joi.string().email({minDomainSegments: 2, tlds: {allow: false}}).messages({
        "string.empty":"Email must be valid",
      }),
      password: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{6,30}$/)).messages({
        "string.empty":"Password must not be empty",
        "string.pattern.base":"Password must be between 6-30"
      })
    })

    let validateResult = schema.validate(user, {abortEarly: false})
    if(validateResult.error){
      setValidationError(validateResult.error.details)
      return false
    }
    else{
      setValidationError([])
      return true
    }
  }

  useEffect(()=>{
    console.log(user);
  }, [user])


  return (
   <>
   <Helmet>
    <title>SignIn Form</title>
   </Helmet>
    <div className="container my-auto">
      <div className='mx-auto w-50'>
      <h2 className='my-4'>Sign In</h2>
       
       {apiError && <div className='alert alert-danger'>{apiError}</div>}

      <form onSubmit={(e)=>{ signIn(e) }}>
        <div className='form-group mb-3'>
          <label className='mb-1' htmlFor="email">Email</label>
          <input onChange={(e)=>getUserData(e) } className='form-control py-2' type="email"  id='email' name='email'/>
          <div className={valiationError.filter((ele) => ele.context.label == 'email')[0] ? "alert alert-danger mt-3 p-2" : ""}>
            {valiationError.filter((ele) => ele.context.label == 'email')[0]?.message}
          </div>
        </div>

        <div className='form-group mb-3'>
        <label className='mb-1' htmlFor="password">Password</label>
        <input onChange={(e)=>getUserData(e) } className='form-control py-2' type="password"  id='password' name='password'/>
        <div className={valiationError.filter((ele) => ele.context.label == 'password')[0] ? "alert alert-danger mt-3 p-2" : ""}>
            {valiationError.filter((ele) => ele.context.label == 'password')[0]?.message}
        </div>    
       </div>

      <button className='btn outline_btn mt-3 d-flex ms-auto mt-4 mb-5'>
        {isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}
      </button>



      </form>

      </div>
    </div>





   </>
  )
}
