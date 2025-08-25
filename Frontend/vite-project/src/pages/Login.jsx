import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { IoMdClose } from "react-icons/io";
import { Form, Button } from 'react-bootstrap';
import { useUser } from '../context/userContext';
import Swal from 'sweetalert2';
export default function LoginPage(props) {
  const [localLoading, setlocalLoading]=useState();
  const {setUser}=useUser()
   const [data, setData]=useState({
    email:{value:"", valid:false},
    password:{value:"", valid:false}
  })
function  handleClose(){
  setlocalLoading(false)
  props.setModals(prev=>({...prev, login:false}))
}
async function handleLogin(e){
  e.preventDefault();
   if (!data.email.valid || !data.password.valid) 
   return Swal.fire({
  title:"Incomplete Details",
  text:"It looks like something User name or Password missing",
  icon:"warning"
  })
    
  try{
 if(data.email.valid && data.password.valid){
    setlocalLoading(true);
    const response= await fetch("http://localhost:3700/api/user/login",{
      method:"POST",
      "credentials":"include",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email:data.email.value, password:data.password.value})
    })
    setlocalLoading(false);
    if(response.ok){
const result= await response.json();
   
    setUser(result.payLoad);
    Swal.fire({
      title:"Login Successfully!",
      icon:"success",
      timer:900,
      timerProgressBar:true,
      showConfirmButton:false
    }).then(()=>{
      handleClose()
    }
    )
    }
   else if(response.status == 401){
      
  Swal.fire({
      title:"Invalid Email or Password",
      icon:"error"
    })
    }
    else{
  Swal.fire({
    icon:"error",
      title:"Login failed",
      text:"Failed to login your account, Please try again later",
      showCloseButton:true
    })
    }
  }
  }catch(err){
    setlocalLoading(false); 
     Swal.fire({
      title:"Login Failed!",
      text:"Failed to login, please check your internet connection",
      icon:"error"
    })
   
    console.log(err)
    console.log("Error in login function");
  }
 
}
function emailHandler(e){
  const temp=e.target.value;
  if (temp.includes("@") && temp.includes(".")) {
  setData((prev) => ({
    ...prev,
    email: { value: temp, valid:true }
  }))}
  else{
     setData((prev) => ({
    ...prev,
    email: { value: temp, valid:false }
  }))
  }
}
function passwordHandler(e){
  const temp=e.target.value;
  if(temp){
 setData((prev) => ({
    ...prev,
    password: { value: temp, valid:true }
  }))}
  else{
    setData((prev) => ({
    ...prev,
    password: { value: temp, valid:false }
  }))
  }
  }
 
  

  return (
<Modal show={props.modals.login} onHide={handleClose}>
      <div className='d-flex p-3 justify-content-between border-bottom '>  <h3 className='text-green'>Login</h3>
          <IoMdClose size={30} style={{float:"right", cursor:"pointer"}}  onClick={handleClose}/></div>
           <Form className='p-3' onSubmit={handleLogin}>
     <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control value={data.email.value} disabled={localLoading} onChange={emailHandler} type="email"/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control onChange={passwordHandler} disabled={localLoading} type='password' />
      </Form.Group>
<Button variant="primary" type="submit" disabled={localLoading}>
    {localLoading? "Loading please wait..." : "Login"}  
      </Button>
      
    </Form>
      </Modal>

  )
}
