import React, { useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
export default function Signup(props) {
  const navigate =useNavigate()
  const [check, setCheck]=useState(false);
  const [loading, setLoading]=useState(false)
function  handleClose(){
  props.setModals(prev=>({...prev, signup:false}))
}
const fileRef=useRef()
const [data, setData]=useState({
  name:{Value:"", error:"", valid:false},
  email:{Value:"", error:"", valid:false},
  password:{Value:"", error:"", valid:false},
  security_Qus:{Value:"", error:"", valid:false},
  security_Ans:{Value:"", error:"", valid:false},
  birth:{Value:"", error:"", valid:false},
  contact:{Value:"", error:"", valid:false},
  image:{Value:[], error:"", valid:false}
})
async function handleSignUpSubmit(){
  try{
    setCheck(true);
    if(!data.name.Value){
           setData((prev)=>({...prev, name:{Value:"", error:"Required", valid:false}}))
           return
    }
    if(!data.email.Value){
           setData((prev)=>({...prev, email:{Value:"", error:"Required", valid:false}}))
           return
    }if(!data.password.Value){
           setData((prev)=>({...prev, password:{Value:"", error:"Required", valid:false}}))
           return
    }
    if(!data.security_Qus.Value){
           setData((prev)=>({...prev, security_Qus:{Value:"", error:"Required", valid:false}}))
           return
    }
   if(!data.security_Ans.Value){
           setData((prev)=>({...prev, security_Ans:{Value:"", error:"Required", valid:false}}))
           return
    }
     if(!data.birth.Value){
           setData((prev)=>({...prev, birth:{Value:"", error:"Required", valid:false}}))
           return
    }
    if(!data.contact.Value){
           setData((prev)=>({...prev, contact:{Value:"", error:"Required", valid:false}}))
           return
    }
    if(!data.image.Value.length>0){
           setData((prev)=>({...prev, image:{Value:[], error:"Required", valid:false}}))
           return
    }

    if(!data.name.valid || !data.email.valid || !data.password.valid || !data.security_Qus.valid || !data.security_Ans.valid || !data.birth.valid || !data.contact.valid || !data.image.valid){
      return
    }
    setLoading(true);
  
const otpRes= await fetch("http://localhost:3700/api/email/otp",{
  method:"post",
  headers:{
    "content-type":"application/json"
  },
  body:JSON.stringify({email:data.email.Value})
})
if(otpRes.ok){
  navigate("/otp-verification", { state: { email: data.email.Value, data } });
  setData({
  name:{Value:"", error:"", valid:false},
  email:{Value:"", error:"", valid:false},
  password:{Value:"", error:"", valid:false},
  security_Qus:{Value:"", error:"", valid:false},
  security_Ans:{Value:"", error:"", valid:false},
  birth:{Value:"", error:"", valid:false},
  contact:{Value:"", error:"", valid:false},
  image:{Value:[], error:"", valid:false}
})
setLoading(false);
  handleClose();
return
}
else if(otpRes.status == 409){
  Swal.fire({
    title:"Email conflict",
    text:"User with this email already exist",
    icon:"warning"
  })
  setLoading(false);
  return
}
else{
Swal.fire({
  icon:"error",
  title:"Signup Failed",
  text:"Failed to create account, please try again later"
})
setLoading(false)
return

}
  }catch(err){
    setLoading(false)
     Swal.fire({
    icon:"error",
    title:"Server Error",
    text:"Server not responded, please try again later"
  })
    console.log(err);
    console.log("Error in signup submission");
  }
}
function nameHandler(e){
  try{
    const temp= e.target.value;
    if(temp.length>2){
      setData((prev)=>({...prev, name:{Value:temp, error:"", valid:true}}))
    }else{
     setData((prev)=>({...prev, name:{Value:temp, error:"Invalid name", valid:false}}))

    }
  }catch(err){
    console.log("Error in nameHandler (signup)")
    console.log(err);
  }
}
function emailHandler(e){
  try{
    const temp= e.target.value;
    if(temp.includes("@gmail.")){
      setData((prev)=>({...prev, email:{Value:temp, error:"", valid:true}}))
    }else{
     setData((prev)=>({...prev, email:{Value:temp, error:"Invalid email", valid:false}}))

    }
  }catch(err){
    console.log("Error in emailHandler (signup)")
    console.log(err);
  }
}
function passwordHandler(e){
  try{
    const temp= e.target.value;
    if(temp.length>=8 && /[!@#$%&*]/.test(temp) && /[A-Z]/.test(temp)){
      setData((prev)=>({...prev, password:{Value:temp, error:"", valid:true}}))
    }else{
     setData((prev)=>({...prev, password:{Value:temp, error:"Password must be at least 8 characters long, include one capital letter, and one special character (!@#$%&*)", valid:false}}))

    }
  }catch(err){
    console.log("Error in emailHandler (signup)")
    console.log(err);
  }
}
function secQuestionHandler(e){
  try{
    const temp= e.target.value;
    if(temp.length>=10){
      setData((prev)=>({...prev, security_Qus:{Value:temp, error:"", valid:true}}))
    }else{
     setData((prev)=>({...prev, security_Qus:{Value:temp, error:"Minimum 10 characters allowed", valid:false}}))

    }
  }catch(err){
    console.log("Error in nameHandler (signup)")
    console.log(err);
  }
}
function secAnswerHandler(e){
  try{
    const temp= e.target.value;
    if(temp.length>=5){
      setData((prev)=>({...prev, security_Ans:{Value:temp, error:"", valid:true}}))
    }else{
     setData((prev)=>({...prev, security_Ans:{Value:temp, error:"Minimum 5 characters allowed", valid:false}}))

    }
  }catch(err){
    console.log("Error in nameHandler (signup)")
    console.log(err);
  }
}
function imageChange(){
  try{
  setData((prev)=>({...prev, image:{Value:[], error:"", valid:true}}));
  }catch(err){
    console.log("Error");
    console.log(err);
  }
}
function imageHandler(e){
  try{
 const file=e.target.files[0];
 if(file){
  setData((prev)=>({...prev, image:{Value:[file], error:"", valid:true}}));
 }  
  }catch(err){
    console.log(err)
    console.log("Error in imageHandler")
  }
}
  function dobHandler(e){
    try{
      const temp= e.target.value;
      const selectedDate= new Date(temp);
      const minDate= new Date();
      minDate.setFullYear(minDate.getFullYear() - 18);
      if(selectedDate <= minDate){
        setData((prev)=>({...prev, birth:{Value:temp, error:"", valid:true}}))
      }else{  
      setData((prev)=>({...prev, birth:{Value:temp, error:"You must be at least 18 years old", valid:false}}))

      }
    }catch(err){
      console.log("Error in nameHandler (signup)")
      console.log(err);
    }
  }
function contactHandler(e){
  try{
const temp= e.target.value;
if(temp.length==11 && /^\d+$/.test(temp)){
          setData((prev)=>({...prev, contact:{Value:temp, error:"", valid:true}}))

  }
  else{
   setData((prev)=>({...prev, contact:{Value:temp, error:"Invalid Contact", valid:false}}))
  }
}
  catch(err){
    Swal.fire({
    title:"Server Error",
    icon:'error',
    text:"Server not responded, please try again later"


    })
    console.log("Error in Contact Handler");
    console.log(err)
  }
}
  return (
<Modal show={props.modals.signup} onHide={handleClose}>
      <div className='d-flex p-3 justify-content-between border-bottom '>  <h3 className='text-green'>SignUp</h3>
          <IoMdClose size={30} style={{float:"right", cursor:"pointer"}} onClick={handleClose}/></div>
           <Form className='p-3'>
     <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control onChange={nameHandler} type="text" disabled={loading} value={data.name.Value} placeholder="Enter Name"/>
        {check && data.name.error && <div className='text-danger'>{data.name.error}</div>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control onChange={emailHandler} disabled={loading} value={data.email.Value} type="email" placeholder="Enter email"/>
          {check && data.email.error && <div className='text-danger'>{data.email.error}</div>}

      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control onChange={passwordHandler} disabled={loading} value={data.password.Value} type='password' placeholder="Enter password"/>
        {check && data.password.error && <div className='text-danger'>{data.password.error}</div>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Security Question</Form.Label>
        <Form.Control onChange={secQuestionHandler} disabled={loading} value={data.security_Qus.Value} type="text" placeholder="Enter security question"/>
        {check && data.security_Qus.error && <div className='text-danger'>{data.security_Qus.error}</div>}
      </Form.Group> 
      <Form.Group className="mb-3">
        <Form.Label>Security Answer</Form.Label>
        <Form.Control onChange={secAnswerHandler} disabled={loading} value={data.security_Ans.Value} type="text" placeholder="Enter security answer"/>
        {check && data.security_Ans.error && <div className='text-danger'>{data.security_Ans.error}</div>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Birth Date</Form.Label>
        <Form.Control onChange={dobHandler} disabled={loading} value={data.birth.Value} type="date"/>
      {check && data.birth.error && <div className='text-danger'>{data.birth.error}</div>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Contact Number</Form.Label>
        <Form.Control onChange={contactHandler} disabled={loading} value={data.contact.Value} type="text" placeholder="Enter contact number"/>
        {check && data.contact.error && <div className='text-danger'>{data.contact.error}</div>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control onChange={imageHandler} disabled={loading} ref={fileRef} className='d-none'  type="file"/>
      </Form.Group> 
      <p>Upload Profile picture</p>
      {(data.image.Value && data.image.Value.length> 0)?
      <div style={{height:"60px", width:"60px", cursor:"pointer", position:"relative", marginLeft:"7px"}} disabled={loading}>
          <span style={{position:"absolute", top:"-5px", background:"white", borderRadius:"5px"}} onClick={()=>imageChange()}><IoClose size={15} color='red' /></span>
          <img src={URL.createObjectURL(data.image.Value[0])} alt="Car img" className='h-100 w-100 rounded object-fit-cover border'  />

        </div>:
        <div className='rounded border d-flex justify-content-center align-items-center ms-1 mb-3 ' style={{height:"60px", width:"60px", cursor:"pointer"}} onClick={()=>{fileRef.current.click();}}>
    <IoMdAdd size={42} color='gray'/>
  </div>}
 {check && data.image.error && <div className='text-danger'>{data.image.error}</div>}

<Button variant="primary" disabled={loading} onClick={handleSignUpSubmit}>
{loading ? "Loading please wait...":"Signup"}
      </Button>
      
    </Form>
      </Modal>

  )
}
