import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useUser } from '../context/userContext'
import Swal from 'sweetalert2';

export default function Chat() {
    const [text, setText]=useState("");
    const {user, setUser}=useUser()
    const [data, setData]=useState([])
    const[disabled, setDisabled]=useState(true)
async function sendHandler(){
    setDisabled(true)
    try{
const res= await fetch("http://localhost:3700/api/message",{
    method:"post",
    headers:{
        "content-type":"application/json"
    },
    body:JSON.stringify({userId:user.id, text:text})
})
if(!res.ok){
    setDisabled(false)
    alert("Message sent failed!")
return
}
else{
    setText("");
const data= await res.json();
if(data.intent == "update_name" && data.intent_value != "Missing"){
    Swal.fire({
        title:"Name Update request",
        text:`Would you like to update your user name from ${user.name} to ${data.intent_value}?`,
        icon:"warning",
        showConfirmButton:true,
        showCancelButton:true
    }).then(async(response)=>{
        if(response.isConfirmed){
             const updated= await fetch(`http://localhost:3700/api/user/update/${user.id}`,{
    method:"PUT",
    headers:{
        "content-type":"application/json"
    },
    body:JSON.stringify({name:data.intent_value})
   })
   const result= await updated.json();

   if(result){
    console.log("result.user", result.user)
    Swal.fire({
        title:"Name updated",
        text:`Now your user name is ${result.user.name}.`,
        icon:"success"
    })
   }else{
 Swal.fire({
        title:"Failed to update Name",
        text:`Your user name is not changed `,
        icon:"warning"
    })
   }
            
        }
    })
  
}
else if(data.intent == "update_phone" && data.intent_value != "Missing"){
    Swal.fire({
        title:"Contact Update",
        text:`Would you like to update your contact from ${user.contact} to ${data.intent_value}?`,
        icon:"warning",
        showConfirmButton:true,
        showCancelButton:true
    }).then(async(response)=>{
        if(response.isConfirmed){
             const updated= await fetch(`http://localhost:3700/api/user/update/${user.id}`,{
    method:"PUT",
    headers:{
        "content-type":"application/json"
    },
    body:JSON.stringify({name:data.intent_value})
   })
   const result= await updated.json();

   if(result){
    console.log("result.user", result.user)
    setUser(result.user)
    Swal.fire({
        title:"Name updated",
        text:`Now your user name is ${result.name}.`,
        icon:"success"
    })
   }else{
 Swal.fire({
        title:"Failed to update Name",
        text:`Your user name is not changed `,
        icon:"warning"
    })
   }  
        }
    })
  
}

}
    }
catch(err){
    console.log(err)
    alert("Something wrong in sending message to gpt")
}
}
function textHandler(e){
    const temp=e.target.value;
   if(temp){
setText(temp)
setDisabled(false)
   }else{
    setText(temp)
    setDisabled(true)
   }
}

useEffect(()=>{
    const fetchMessages=async()=>{
        try{
            const res= await fetch("http://localhost:3700/api/message");
        
        if(!res.ok){
alert("Failed to fetch user messages")
return
        }
        const result= await res.json()
        console.log(result.messages)
    setData(result.messages)
    
    }
        catch(err){
            console.log(err)
            alert("Error in fetching user messages")
        }
        

    }
    fetchMessages()
},[])
    return (
    <Container style={{minHeight:"83vh"}}>
    <div className='chat-div' style={{overflowY:"scroll"}}>
        {data && data.length>0?  data.map((message)=>(
            <div className={message.sender ==="user"? "text-end mt-4":" text-start mt-4"}><p className={message.sender === "user"? "user-messages":"gpt-messages"}>{message.text}</p></div>
        )): <div className='d-flex justify-content-center h-100 align-items-center text-danger'>No messages found...</div>}
    </div>
<input type="text" className='textarea'  onChange={textHandler} value={text} placeholder='Type a message... '/>
    <button className='bg-success btn text-white' disabled={disabled} style={{border:"none", height:"46px", width:"64px"}} onClick={sendHandler}>Send</button>
    </Container>
    
  )
}
