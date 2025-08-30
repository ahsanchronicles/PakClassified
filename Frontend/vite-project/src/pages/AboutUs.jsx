import React from 'react'
import { GrNext } from "react-icons/gr";

import { Col, Container, Row } from 'react-bootstrap'
import { useInView } from 'react-intersection-observer';

export default function AboutUs() {
  const {ref, inView}=useInView({
    threshold:0.5
  })
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
    <h1 className='text-pure-white md-mt-6 top-m' style={{position:"absolute", left:"80px"}}>About Us</h1>
  </div>
  <Container>
    <Row style={{minHeight:"400px"}} ref={ref}>
        <Col className={`col-md-6 col-12 animate__animated ${inView?"animate__backInLeft":""}`}>
        <Row className=' d-flex justify-content-center g-0 align-items-center left-about-section'>
            <Col className='col-5'>
        <div className='h-250p w-100'>
            <img src="https://masterpiecer-images.s3.yandex.net/5845122b7d3e11ee827f1e5d9776cfa6:upscaled" alt="Car image" />
        </div>
        <div className='h-250p w-100 '>
            <img src="https://hips.hearstapps.com/hmg-prod/images/bmw-z4-134-1542814292.jpg?crop=1xw:1xh;center,top&resize=980:*" alt="Car image" />
        </div>
        </Col>
        <Col className='col-5 mt-40p'> <div className='h-250p w-100'>
            <img src="https://static.wixstatic.com/media/a81051_1a04c0f0166645539d8bec9570ed9208~mv2.jpg/v1/fill/w_568,h_378,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/a81051_1a04c0f0166645539d8bec9570ed9208~mv2.jpg" alt="Car image" />
        </div>
        <div className='h-250p w-100 '>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC9NtgdXqqMQbfadpq_kJ31SOzRbt4iOAsmg&s" alt="Car image" /></div></Col>
        </Row>
       
        </Col>
        <Col className={`col-md-6 col-12 pt-3 animate__animated ${inView?"animate__backInRight":""}`}>
  <div className='mt-3'>
    <h2 style={{fontFamily:"serif", fontWeight:600} }>
      PakClassified is a <br /> comprehensive online platform where users can browse, buy, sell, and compare cars
    </h2>
    <p>
      Welcome to PakClassified, your premier destination for all things automotive in Pakistan. Our platform is designed to offer a seamless experience for users looking to browse, buy, sell, and compare cars. Whether you are a car enthusiast or a first-time buyer, PakClassified is committed to making your car shopping journey smooth and hassle-free.
    </p>
  </div>
  <ul>
    <li><GrNext className='text-green' /> &nbsp; Customer Support</li>
    <li><GrNext className='text-green' /> &nbsp; Technical Assistance</li>
    <li><GrNext className='text-green' /> &nbsp; Feedback and Suggestions</li>
  </ul>
</Col>
    </Row>
</Container>
</>
)
}
