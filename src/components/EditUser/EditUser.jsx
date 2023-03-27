import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import Joi from 'joi';


function EditUser({updateProfile, data}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [newData, setNewData]= useState({
    name: "",
    email: "",
    age: 0
  })
  let [token, setToken] = useState(localStorage.getItem('token'))
  let [flag, setFlag] = useState(false)
  let [validationError, setValidationError]= useState([])

  function validateUpdate(){
    const schema = Joi.object({
      name: Joi.string().min(3).max(20).required().messages({
        "string.empty":"Name must not be empty",
        "string.min":"Name must be greater than 3 characters",
        "string.max":"Name must be smaller than 20 characters"
      }),
      email: Joi.string().email({minDomainSegments: 2, tlds: {allow: false}}).messages({
        "string.empty":"Email must be valid",
      }),
      age: Joi.number().min(10).max(100).required().messages({
        "number.min":"Age must be greater than 10",
        "number.max":"Please enter a valid age"
      })
    })

    let validateResult = schema.validate(newData, {abortEarly: false})
    if(validateResult.error){
      setValidationError(validateResult.error.details)
      return false
    }
    else{
      setValidationError([])
      return true
    }
  }


  function getUpdateData(e){
    let myUpdate = {...newData}
    myUpdate[e.target.name] = e.target.value
    setNewData(myUpdate)
    console.log(myUpdate);
}

async function updateUser(){
  // Update user
  let {name, email, age} = newData
  // console.log(_id, title, description);
  if(validateUpdate()){
    await axios({
      method: 'put',
      url: "https://todobackend-2mvb.onrender.com/user/update",
      headers: {"token" : `${token}`}, 
      data: {
        name,
        email,
        age
      }
    })
    .then(res => {
      console.log(res.data);
      if(res.data.message == 'User Updated Successully' || res.data.message == 'Success. Email Already Exist.'){
        setFlag(true)
        updateProfile()
      }
  })
  }
    
}



  return (
    <>
      <Button variant="primary" onClick={()=>(handleShow(), setFlag(false))}>
       Update User
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='text-dark' >Update
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-dark'>
        <>
            <div className="form-group">
              <div className='d-flex justify-content-center  align-items-center '>
              <label htmlFor="name" className="py-1 fs-5 fw-bold mx-5"> Name:</label>
              <input type="text"  id="name" name='name' className="form-control w-50" onChange={(e) => getUpdateData(e)}/>
              </div>
              <div className={validationError.filter((ele) => ele.context.label == 'name')[0] ? "alert alert-danger mt-2 p-2  d-flex justify-content-center  align-items-center" : ""}>
                {validationError.filter((ele) => ele.context.label == 'name')[0]?.message}
              </div>

              <div className='d-flex justify-content-center  my-3 align-items-center '>
              <label htmlFor="email" className="py-1 fs-5 fw-bold mx-5"> Email:</label>
              <input type="text"  id="email" name='email' className="form-control w-50" onChange={(e) => getUpdateData(e)}/>
              </div>
              <div className={validationError.filter((ele) => ele.context.label == 'email')[0] ? "alert alert-danger mt-2 p-2  d-flex justify-content-center  align-items-center" : ""}>
                {validationError.filter((ele) => ele.context.label == 'email')[0]?.message}
              </div>

              {/* <div className='d-flex justify-content-center  my-3 align-items-center '>
              <label htmlFor="password" className="py-1 fs-5 fw-bold mx-4 px-1"> Password:</label>
              <input type="text"  id="password" name='password' className="form-control w-50"/>
              </div> */}

              <div className='d-flex justify-content-center  my-3 align-items-center '>
              <label htmlFor="age" className="py-1 fs-5 fw-bold mx-5 px-2"> Age:</label>
              <input type="text"  id="age" name='age' className=" form-control w-50" onChange={(e) => getUpdateData(e)}/>
              </div>
              <div className={validationError.filter((ele) => ele.context.label == 'age')[0] ? "alert alert-danger mt-2 p-2  d-flex justify-content-center  align-items-center" : ""}>
                {validationError.filter((ele) => ele.context.label == 'age')[0]?.message}
              </div>

              
            </div>
        </>


        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center align-items-center'>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=> updateUser()}>
            Save Changes
          </Button>
          
          {flag ? <Alert className='w-100 text-center d-block my-2' variant='success'> Updated </Alert> : "" }

        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditUser