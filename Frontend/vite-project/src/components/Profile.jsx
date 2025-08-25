import { Dropdown } from "react-bootstrap"
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import Swal from "sweetalert2";
import { useState } from "react";
export default function Profile({user}) {
  const navigate= useNavigate();
  const {setUser}=useUser();
    const [isLogingOut, setLogingOut]=useState(false)
    const logoutHandler=async()=>{
      try{
        setLogingOut(true)
     const res = await fetch("http://localhost:3700/api/user/logout", {
        method: "GET",
        credentials: "include", 
      });
        await res.json();
        console.log("res", res)
        if(res.ok){
          setUser(null);
          Swal.fire({
            icon:"success",
            timer:900,
            showConfirmButton:false,
            title:'Logout Successfull'
          })
        setTimeout(() => {
    navigate("/");
  }, 1000);
        }else{
          Swal.fire({
            icon:"error",
            timer:900,
            showConfirmButton:false,
            title:'Failed to Logout'
          })
        }
      }
     catch(err){
      console.log("Error in Logout");
      console.log(err)
     }
  
    }
  return (
    <>
     <Dropdown style={{ position: "relative" }}>
            <Dropdown.Toggle
              as="div"
              className="custom-toggle bg-light"
              style={{ cursor: "pointer", textAlign: "right" }}
            >
              <div className=" px-3 pt-1">
                <img
                  src={user.image || "/images/user.png"}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "60%",
                    overflow: "hidden",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" style={{
    right: 0,
    left: "auto",
  }}>
              <Dropdown.Item href="#/action-1">{user.name || "No name"}</Dropdown.Item>
              <Dropdown.Item onClick={()=>navigate('/user-dashboard')}>View Profile</Dropdown.Item>
              <Dropdown.Item onClick={()=>logoutHandler()} disabled={isLogingOut}>
                <IoIosLogOut /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
  </>
  )
} 
