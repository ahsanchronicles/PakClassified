import React, { useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";4
import { HiOutlineMailOpen } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";
import { Col, Container, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import { useInView } from 'react-intersection-observer';

export default function Contact() {
  const {ref, inView}=useInView({
     threshold: 0.3,
     triggerOnce:true
  })
  const [localLoading, setLocalLoading]=useState(false)
  const [check, setCheck]=useState(false)
  const [data, setData]=useState({
    name:{Value:"", error:"", valid:false},
    email:{Value:"", error:"", valid:false},
    subject:{Value:"", error:"", valid:false},
    message:{Value:"", error:"", valid:false},
  })
  async function sendHandler(e){
    e.preventDefault()
    try{
if(!data.name.valid || !data.email.valid || !data.subject.valid || !data.message.valid){
  if(!data.name.Value){
      setData((prev)=>({...prev, name:{Value:'', error:"Name is required", valid:false} }));
  }
  if(!data.email.Value){
      setData((prev)=>({...prev, email:{Value:'', error:"Email is required", valid:false} }));
  }
  if(!data.subject.Value){
      setData((prev)=>({...prev, subject:{Value:'', error:"subject is required", valid:false} }));
  }
  if(!data.message.Value){
      setData((prev)=>({...prev, message:{Value:'', error:"Message is required", valid:false} }));
  }
  setCheck(true);
  return
}
setLocalLoading(true)
const payLoad={
  name: data.name.Value,
  email:data.email.Value,
  subject:data.subject.Value,
  message:data.message.Value
}
const res= await fetch("http://localhost:3700/api/email/",{
  method:"post",
  headers:{
    "content-type":"application/json"
  },
  body:JSON.stringify(payLoad)
});
setLocalLoading(false)
if(res.ok){
  Swal.fire({
    icon:"success",
    title:"Message Sent Successully!",
    text:"Thanks our team contact you shortly."
  })
  setData({
    name:{Value:"", error:"", valid:false},
    email:{Value:"", error:"", valid:false},
    subject:{Value:"", error:"", valid:false},
    message:{Value:"", error:"", valid:false},
  })
}
else{
  
  Swal.fire({
    icon:"error",
    title:"Message sent failed!",
    text: "Failed to send your message, please try again later"
  })
}
    }catch(err){
      setLocalLoading(false)
       Swal.fire({
    icon:"error",
    title:"Message sent failed!",
    text:"Server not responed, please try again later"
  })
      console.log("Error in send Email message")
      console.log(err)
    }
  }
  function nameHandler(e){
    try{
const temp= e.target.value;
if(temp.length>2){
  setData((prev)=>({...prev, name:{Value:temp, error:"", valid:true} }));
}
else{
    setData((prev)=>({...prev, name:{Value:temp, error:"Invalid Name", valid:false} }));
}
    }catch(err){
      console.log("Error in name handler (contact)")
      console.log(err)
    }
  }

    function subjectHandler(e){
    try{
const temp= e.target.value;
if(temp.length>=10){
  setData((prev)=>({...prev, subject:{Value:temp, error:"", valid:true} }));
}
else{
    setData((prev)=>({...prev, subject:{Value:temp, error:"Subject must be at least 10 characters", valid:false} }));
}
    }catch(err){
      console.log("Error in name handler (contact)")
      console.log(err)
    }
  }
    function messageHandler(e){
    try{
const temp= e.target.value;
if(temp.length>=20){
  setData((prev)=>({...prev, message:{Value:temp, error:"", valid:true} }));
}
else{
    setData((prev)=>({...prev, message:{Value:temp, error:"Message look to short", valid:false} }));
}
    }catch(err){
      console.log("Error in name handler (contact)")
      console.log(err)
    }
  }


  function emailHandler(e){
    try{
const temp= e.target.value;
if(/@gmail\./.test(temp)){
  setData((prev)=>({...prev, email:{Value:temp, error:"", valid:true} }));
}
else{
    setData((prev)=>({...prev, email:{Value:temp, error:"Invalid Email", valid:false} }));
}
    }catch(err){
      console.log("Error in name handler (contact)")
      console.log(err)
    }
  }

  return (
<>
     <div
     className='mb-4'
    style={{
      position: "relative",
      height: "200px",
      backgroundImage:
        "url('https://c4.wallpaperflare.com/wallpaper/9/669/180/cars-high-resolution-desktop-wallpaper-preview.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div
      style={{

        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 1,
      }}
    ></div>
    <div style={{height:"100px", width:"70px", position:"absolute", top:"40px", left:"50px"}} className='border-green'></div>
    <h1 className='text-pure-white md-mt-6 top-m' style={{position:"absolute", left:"80px"}}>Contact</h1>
  </div>
  <Container>
    <h2 className={`text-center my-3 fw-bold animate__animated ${inView? "animate__zoomInDown":""}`} ref={ref}>Contact for any Query</h2>
    <Row className={`gap-2 me-1 animate__animated ${inView? "animate__zoomInDown":""}`}>
        <Col className='p-3 bg-light-green rounded col-md-4 col-12 md-text-small'>
        <FaLocationDot size={40} className='mb-1 p-2 border bg-white text-green rounded'/> Gulberg III, Lahore
        </Col>
            <Col className='p-3 bg-light-green rounded text-small col-md-4 col-12 md-text-small'>
         <HiOutlineMailOpen size={40} className='mb-1 p-2 border bg-white text-green rounded '/>   mianahsan428a@gmail.com
        </Col>
            <Col className='p-3 bg-light-green rounded md-text-small'>
           <FaPhoneAlt size={40} className='mb-1 p-2 border bg-white text-green rounded '/> 0300 -123454
        </Col>  
    </Row>
   
    
    <Row className={`me-1`}>
        <Col className={`col-md-6 col-12 h-450p my-3   animate__animated ${inView? "animate__backInLeft":""}`}>
        <img src="/images/map.png" style={{objectFit:"cover"}} alt="" className='w-100 h-100 rounded' />
        </Col>
        <Col className={`col-12 col-md-6 my-3 h-450p  animate__animated ${inView? "animate__backInRight":""}`}>
         <Form className='h-100'>
            <p >For any inquiries, assistance, or feedback, please fill out our contact form below. Our team is committed to responding promptly to ensure your experience with PakClassified is exceptional.</p>
      <Row className=''>
        <Col className='col-6'>
        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control type="text" value={data.name.Value} onChange={nameHandler} className='py-3' disabled={localLoading} placeholder='Your Name'/>
        {check && data.name.error && <div className='text-danger'>{data.name.error}</div>}
      </Form.Group>
        </Col>
        <Col className='col-6'>
        <Form.Group className="mb-3" controlId= "formBasicEmail">
        <Form.Control type="email" value={data.email.Value}  disabled={localLoading}  onChange={emailHandler} className='py-3' placeholder='Your Email'/>
                {check && data.email.error && <div className='text-danger'>{data.email.error}</div>}

      </Form.Group>
        </Col>
         <Col className='col-12'>
        <Form.Group className="mb-3" controlId= "formBasicEmail">
        <Form.Control type="text" className='py-3' value={data.subject.Value}  disabled={localLoading}  onChange={subjectHandler} placeholder='Subject'/>
        {check && data.subject.error && <div className='text-danger'>{data.subject.error}</div>}

      </Form.Group>
        </Col>
         <Col className='col-12'>
      <Form.Group className="mb-3" controlId="formBasicSubject">
  <Form.Control as="textarea" rows={3}  disabled={localLoading}  value={data.message.Value} onChange={messageHandler} className="py-3" placeholder="Leave a message here" />
          {check && data.message.error && <div className='text-danger'>{data.message.error}</div>}

</Form.Group>
<button className='btn btn-success w-100 py-3' disabled={localLoading } onClick={sendHandler}>{localLoading ? "Sending your message please wait....": "Send message "}</button>
        </Col>
      </Row>
    </Form>
        </Col>
    </Row>

</Container>
</>
)
}
