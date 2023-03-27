import logo from './logo.svg';
import './App.css';
import {createBrowserRouter, RouterProvider, useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode'
import MainLayout from './components/MainLayout/MainLayout.jsx';
import Home from './components/Home/Home.jsx';
import Register from './components/Register/Register.jsx';
import Login from './components/Login/Login.jsx';
import Update from './components/Update/Update.jsx';
import Profile from './components/Profile/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';




function App() {

  let [userData, setUserData] = useState(null)

  function saveUser(){
    let token = localStorage.getItem('token')
    let decoded = jwt_decode(token)
    console.log(decoded);
    setUserData(decoded)
  }

  function logout(){
    localStorage.removeItem('token')
    setUserData(null)
  }

  useEffect(()=>{
    if(localStorage.getItem('token')){
      saveUser()
    }

  }, [])

  const routers = createBrowserRouter([
    {path:"/", element:<MainLayout userData={userData} logout={logout}/>, children:[
      {index: true, element:<ProtectedRoute userData = {userData}> <Home/> </ProtectedRoute>},
      {path:"/signup", element: <Register/>},
      {path:"/login", element: <Login saveUser = {saveUser}/>},
      {path:"/update", element:<ProtectedRoute userData = {userData}> <Update saveUser = {saveUser}/> </ProtectedRoute>},
      {path:"/profile", element:<ProtectedRoute userData = {userData}> <Profile  userData = {userData}/> </ProtectedRoute>},



    ]}
  ])

  return (
    <>
    <RouterProvider router={routers}></RouterProvider>
    </>
  );
}

export default App;
