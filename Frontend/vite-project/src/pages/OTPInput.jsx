import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function OTPInput() {
  const navigate=useNavigate()
  const [loading, setLoading]=useState(false);
  const [error, setError]=useState("")
  const location = useLocation();

  const inputs = useRef([]);
  const userEmail = location.state?.email;
  const data = location.state?.data;
 

  const handleChange = (e, index) => {
    let value = e.target.value;

    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(0, 1);
      e.target.value = value;
    }

    if (value.length === 1 && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }

    // If last input filled → send request
    if (index === inputs.current.length - 1 && value.length === 1) {
      const otp = inputs.current.map((input) => input.value).join("");
      verifyOTP(otp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const verifyOTP = async (otp) => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:3700/api/email/otp-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, email: userEmail }),
      });

      if (res.ok) {
        let imageArray = [];

        if (
          data.image.Value[0].type === "string" &&
          data.image.Value[0].startsWith("https://res.cloudinary.com/")
        ) {
          imageArray.push(data.image.Value[0]);
        } else {
          const formdata = new FormData();
          formdata.append("file", data.image.Value[0]);
          formdata.append("upload_preset", "ecommerce_unsigned");
          formdata.append("cloud_name", "dl8ivfga7");

          const cloudRes = await fetch(
            "https://api.cloudinary.com/v1_1/dl8ivfga7/image/upload",
            {
              method: "post",
              body: formdata,
            }
          );

          if (!cloudRes.ok) {
            Swal.fire({
              title: "Failed to save user Image",
              text: "May be due to network issue or Server error. Try again later",
              icon: "error",
            });
            return;
          } else {
            const result = await cloudRes.json();
            imageArray.push(result.secure_url);
          }
        }

        const payLoad = {
          name: data.name.Value,
          email: data.email.Value,
          password: data.password.Value,
          sequrityQuestion: data.security_Qus.Value,
          sequrityAnswer: data.security_Ans.Value,
          birthDate: data.birth.Value,
          contact: data.contact.Value,
          image: imageArray,
        };

        const res2 = await fetch("http://localhost:3700/api/user/register", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payLoad),
        });

        const result2 = await res2.json();

        if (res2.ok) {
          Swal.fire({
            icon: "success",
            title: "Signup Successfull!",
            text: "Congratulations your account has been created",
          });

         navigate("/")
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops",
            text: result2.message,
          });
        }
      }else if(res.status == 401){
        setLoading(false);
        setError("Looks invalid OTP code please enter valid code")
      }
      else if (res.status == 500){
        setLoading(false)
          setError("Looks poor internet connection, please try again")

      }
      else{
        setLoading(false)
          setError("Something unexpected happening from your side. Please try again.")
      }
    } catch (err) {
      console.log(err);
       setLoading(false)
      setError("Server Error, please try again later");
    }
  };

  return (
    <>
      <div
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
        <div
          style={{
            height: "100px",
            width: "70px",
            position: "absolute",
            top: "40px",
            left: "50px",
          }}
          className="border-green"
        ></div>
        <h1
          className="text-pure-white"
          style={{ position: "absolute", top: "65px", left: "80px" }}
        >
          OTP Verification
        </h1>
      </div>

      {loading?<div className="text-center my-4 d-flex justify-content-center align-items-center" style={{minHeight:"50vh"}}><span class="loader"></span></div>  : <div className="text-center my-4">
        <p>We have sent OTP at <strong>{userEmail}</strong> </p>
        <p className="fs-3 mb-0">Enter OTP</p>
        <div className="otp-container">
          {Array(6)
            .fill("")
            .map((_, index) => (
              <input
                key={index}
                type="number"
                min="0"
                max="9"
                className="text-center"
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputs.current[index] = el)}
              />
            ))}
        </div>
        {error && <p className="mt-3 text-danger">{error}</p>}
              </div>}
    </>
  );
}
