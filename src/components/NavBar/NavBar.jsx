import React, { useEffect, useState } from 'react'
import "./NavBar_module.css"
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';


export default function NavBar({userData, logout}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [deleted, setdeleted] = useState(false)

  async function deleteUser(){
    console.log(localStorage.getItem('token'));
    await axios({
      method: 'delete',
      url: 'https://todobackend-2mvb.onrender.com/user/delete',
      headers: {"token" : `${localStorage.getItem('token')}`}
    })
    .then(res => {
      console.log(res.data);
      if(res.data.message == 'Deleted Successfully'){
        setdeleted(true)
        logout()

      }
  })
  }

  // useEffect(()=>{

  // }, [deleted,])


  return (
    <>
<nav className="navbar navbar-expand-lg bg-transparent border-2 border-bottom border-dark navbar-dark">
  <div className="container-fluid mx-5">
    <Link className="navbar-brand logo_shadow" to="">
      To-Do List
    </Link>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    {userData ? <>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
     <ul className="navbar-nav mx-auto">
        <li className="nav-item me-2">
        <Link className="nav-link active d-flex  justify-content-center  align-items-center" aria-current="page" to="profile">Hi,<p className='text-capitalize mx-1 my-0'>{userData?.name}</p> </Link>
        </li>

        <li className="nav-item dropdown">
        <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Settings
        </Link>
        <ul className="dropdown-menu">
            <li><Link className="dropdown-item black_link" to="profile">Update Profile</Link></li>
            <li><Link className="dropdown-item black_link"  onClick={() => (handleShow(), setdeleted(false))}>Delete Profile</Link></li>
        </ul>
        </li>
     </ul>
    </div></> : ""}

    { <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='text-dark' > Delete User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-dark'>
        <>
            <div className="form-group py-3">
              <div className='d-flex justify-content-center align-items-center '>
              <h4>Are you sure you want to delete this user ?</h4>
              </div>
            </div>
        </>


        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center align-items-center'>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => deleteUser()}>
            Delete
          </Button>

          {deleted ? <Alert className='w-100 text-center d-block my-2' variant='danger'> Deleted Successfully</Alert> : "" }


        </Modal.Footer>
      </Modal>}
    
   

    <div className="navbar">
      {userData ?
        <button className="btn outline_btn mx-3" ><Link className='text-decoration-none text_color' onClick={()=>logout()} to={"login"}>Log Out</Link></button>
      :
      <>
      <h6 className='m-0 mx-3'><Link className='text-decoration-none text-white' to={"login"}>Login</Link></h6>
      <button className="btn outline_btn mx-3" ><Link className='text-decoration-none text_color' to={"signup"}>Register</Link></button>
      </>}
      
    </div>
    
  </div>
</nav>
    </>
  )
}
