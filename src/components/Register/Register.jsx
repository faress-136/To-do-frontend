import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import "../NavBar/NavBar_module.css"
import axios from 'axios'
import Joi from 'joi'
import { useNavigate } from 'react-router-dom'
import {Helmet} from 'react-helmet'

export default function Register() {

  let navigate = useNavigate()

  let [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    age: 0
  })

  let [apiError, setApiError] = useState(null)
  let [isLoading, setIsLoading] = useState(false)
  let [valiationError, setValidationError] = useState([])

  let getUserData = (e)=>{
    let myUser = {...user}
    myUser[e.target.name] = e.target.value
    setUser(myUser)
  }

  let signUp = async (e)=>{
    e.preventDefault()
    if(validateSignUp()){

      setIsLoading(false)
      let {data} = await axios.post('https://todobackend-2mvb.onrender.com/user/signup', user)
      setIsLoading(true)
      console.log(data);
      if(data.message == "Success"){
        setIsLoading(false)
        setApiError(null)
        navigate('/login')
      }
      else{
        setIsLoading(false)
        setApiError(data.message)
      }
    }
    
  }

  function validateSignUp(){
    const schema = Joi.object({
      name: Joi.string().min(3).max(20).required().messages({
        "string.empty":"Name must not be empty",
        "string.min":"Name must be greater than 3 characters",
        "string.max":"Name must be smaller than 20 characters"
      }),
      email: Joi.string().email({minDomainSegments: 2, tlds: {allow: false}}).messages({
        "string.empty":"Email must be valid",
      }),
      password: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{6,30}$/)).messages({
        "string.empty":"Password must not be empty",
        "string.pattern.base":"Password must be between 6-30"
      }),
      age: Joi.number().min(10).max(100).required().messages({
        "number.min":"Age must be greater than 10",
        "number.max":"Please enter a valid age"
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
    <title>SignUp Form</title>
   </Helmet>
    <div className="container my-auto">
      <div className='mx-auto w-50'>
      <h2 className='my-4'>Sign Up</h2>
       
       {apiError && <div className='alert alert-danger'>{apiError}</div>}

      <form onSubmit={(e)=>{ signUp(e) }}>
        <div className='form-group mb-3'>
          <label className='mb-1' htmlFor="name">Name</label>
          <input onChange={(e)=>getUserData(e) }  className='form-control py-2' type="text"  id='name' name='name'/>
          <div className={valiationError.filter((ele) => ele.context.label == 'name')[0] ? "alert alert-danger mt-2 p-2" : ""}>
            {valiationError.filter((ele) => ele.context.label == 'name')[0]?.message}
          </div>
        </div>

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

        <div className='form-group mb-3'>
        <label className='mb-1' htmlFor="age">Age</label>
        <input onChange={(e)=>getUserData(e) } className='form-control py-2' type="number"  id='age' name='age'/>
        <div className={valiationError.filter((ele) => ele.context.label == 'age')[0] ? "alert alert-danger mt-3 p-2" : ""}>
            {valiationError.filter((ele) => ele.context.label == 'age')[0]?.message}
        </div>    
        </div>

      <button className='btn outline_btn mt-3 d-flex ms-auto mt-4 mb-5'>
        {isLoading ? <i className='fa fa-spinner fa-spin px-2'></i> : "Sign Up"}
      </button>


      </form>

      </div>
    </div>





   </>
  )
}
