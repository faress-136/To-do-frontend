import React, { useEffect, useState } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import Loading from '../Loading/Loading.jsx'
import Joi from 'joi'

export default function Home() {

  let [notes, setNotes] = useState(null)
  let [isLoading, setIsLoading] = useState(false)
  let [dataChange, setDataChange] = useState(null)
  let [deletedNote, setDeletedNote] = useState(null)
  let [validationError, setValidationError] = useState([])
  let [token, setToken] = useState(localStorage.getItem('token'))
  let [flag, setFlag] = useState(false)
  // let [updateId, setUpdateId] = useState(null)
  let [newNote, setNewNote] = useState({
    _id: "",
    title: "",
    description: ""
  })

  async function getTasks(){
    // setIsLoading(true)
    let token = localStorage.getItem('token')
    const {data} = await axios.get('https://todobackend-2mvb.onrender.com/note/all',
    { headers: {"token" : `${token}`} })
    setNotes(data.allNotes)
    // setIsLoading(false)
  }
  async function updateStatus(_id, completed){
    let token = localStorage.getItem('token')
    completed = !completed
    await axios({
      method: 'put',
      url: "https://todobackend-2mvb.onrender.com/note/status",
      headers: {"token" : `${token}`}, 
      data: {
        _id,
        completed
      }
    }).then((res)=>{
      // console.log(res.data);
      setDataChange(res.data)
      getTasks()
      setIsLoading(false)
    })
    .catch((err)=>{
      setIsLoading(false)
      setDataChange(err)
    })
  }

  async function deleteNote(_id){
    let token = localStorage.getItem('token')
    await axios({
      method: 'delete',
      url: "https://todobackend-2mvb.onrender.com/note/delete",
      headers: {"token" : `${token}`}, 
      data: {
        _id,
      }
    }).then((res)=>{
      console.log(res.data);
      setDeletedNote(res.data)
      getTasks()
      setIsLoading(false)
    })
    .catch((err)=>{
      setIsLoading(false)
      setDeletedNote(err)
    })
  }

  function getNotesData(e){
      let myNote = {...newNote}
      myNote[e.target.name] = e.target.value
      setNewNote(myNote)
      // console.log(myNote);
  }

  function validateNote(){
    const schema = Joi.object({
      _id: Joi.optional(),
      title: Joi.string().min(3).max(20).required().messages({
        "string.empty":"Title must not be empty",
        "string.min":"Title must be greater than 3 characters",
        "string.max":"Title must be smaller than 20 characters"

      }),
      description: Joi.string().min(3).max(50).required().messages({
        "string.empty":"Description must not be empty",
        "string.min":"Desription must be greater than 3 characters",
        "string.max":"Desription must be smaller than 50 characters"
      })
    })

    let validateResult = schema.validate(newNote, {abortEarly: false})
    if(validateResult.error){
      console.log(validateResult.error);
      setValidationError(validateResult.error.details)
      return false
    }
    else{
      setValidationError([])
      return true
    }
  }

async function addNote(){
  let {_id, title, description} = newNote
  if(validateNote()){
    await axios({
      method: 'post',
      url: "https://todobackend-2mvb.onrender.com/note/add",
      headers: {"token" : `${token}`}, 
      data: {
        title,
        description
      }
    })
    .then(res => {
      console.log(res.data);
        getTasks()
        clearForm()
  })
  }
  
}

function clearForm(){
  setNewNote({
    title: "",
    description: ""
  })
}

function updateValues({_id, title, description}){

  setFlag(true)
  // console.log(_id, title, description);
  setNewNote({
    _id: _id,
    title: title,
    description: description
  })
}

async function updateNote(){
  let {_id, title, description} = newNote
  // console.log(_id, title, description);
  if(validateNote()){
    await axios({
      method: 'put',
      url: "https://todobackend-2mvb.onrender.com/note/update",
      headers: {"token" : `${token}`}, 
      data: {
        _id,
        title,
        description
      }
    })
    .then(res => {
      console.log(res.data);
        setFlag(false)
        getTasks()
        clearForm()
  })
  }
}


  useEffect(()=>{
    getTasks()
  },[])

  return (
    <div className='container-fluid px-5 mx-3'>
      <h2>To-do List:</h2>

      {isLoading && <Loading/>}

      
<div className="w-75 mx-auto">
  <div className='p-1'>
        <div className="row d-flex">
          <div className="col-md-5">
            <input value={newNote?.title} name='title'  onChange={(e) => getNotesData(e)} type="text" placeholder='Note Title' className='form-control form-control-lg' />
            <div className={validationError.filter((ele) => ele.context.label == 'title')[0] ? "alert alert-danger mt-2 p-2" : ""}>
            {validationError.filter((ele) => ele.context.label == 'title')[0]?.message}
          </div>
          </div>

          <div className="col-md-5">
            <input value={newNote?.description} name='description' onChange={(e) => getNotesData(e)} type="text" placeholder='Note Description' className='form-control form-control-lg' />
            <div className={validationError.filter((ele) => ele.context.label == 'description')[0] ? "alert alert-danger mt-2 p-2" : ""}>
            {validationError.filter((ele) => ele.context.label == 'description')[0]?.message}
          </div>
          </div>

          <div className="col-md-2 mb-0 mt-1">
            {flag ? <>
              <button className='btn text-white btn-info rounded-2 p-2 border-0' onClick={() => updateNote()}>Update Note</button>
            </> :
            <>
            <button className='btn text-white btn-green rounded-2 p-2 border-0' onClick={() => addNote()}>Add Note</button>
            </>}
          </div>
        </div>
        


  </div>

<table className="table text-white">
{!(notes) ? <>
    <h2 className='text-center p-5'>No Tasks Available...</h2>
    </> : <>
    <thead>
        <tr className='fs-5 w'>
            <th>Title</th> 
            <th>Description</th> 
            <th>Status</th> 
            <th>Update</th> 
            <th>Delete</th> 
        </tr>
    </thead>
    </>}
    
  
    {notes?.map((ele)=>(<>
  
      <tbody>
        <tr>
            <td className={ele.completed && 'text-decoration-line-through'}>{ele.title}</td>
            <td className={ele.completed && 'text-decoration-line-through'}>{ele.description}</td> 
            <td className={ele.completed ? 'icon-wrap' : 'icon-wrap-2'}>
            <span onClick={()=>updateStatus(ele._id, ele.completed)}>
           <FontAwesomeIcon className='mx-2' icon={faCircleCheck}></FontAwesomeIcon>
            </span>
            </td>
            <td><button className="btn btn-warning" onClick={() => updateValues(ele)}>Update</button></td>
            <td><button className="btn btn-danger" onClick={()=>{deleteNote(ele._id)}}>Delete</button></td>
        </tr>
        </tbody>
        </>))}
    
</table>
</div>

    </div>



  )
}
