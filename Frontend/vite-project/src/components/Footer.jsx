import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { RiMessageFill } from "react-icons/ri";
import { FaFacebookF } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { GrFormNext } from "react-icons/gr";
import { FaLinkedinIn } from "react-icons/fa6";
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate =useNavigate()
  const {ref, inView}=useInView({
threshold: 0.02,
  })
  return (
    <Container fluid className={`bg-dark text-light px-3 pt-5 `} >
    <Row ref={ref}>
        <Col className={`col-lg-3 col-md-6 col-12 mb-4 animate_animated ${inView ? "animate__wobble":""}`}>
        <h4 className='mb-4 '>Company</h4>
        <small >Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae doloribus beatae illo accusamus eius quisquam nostrum ipsa veritatis. Esse consectetur eveniet asperiores sequi ipsam omnis animi perferendis voluptatum quae praesentium?</small>
        </Col>
        <Col className={`col-lg-3 col-md-6 col-12  ps-lg-5 mb-4 animate_animated ${inView ? "animate__backInDown":""}`}>
<h4 className='mb-4 '>Quick Links</h4>
<ul className='footer-list'>
    <li onClick={()=>navigate("/about")}>
        <GrFormNext/> About Us
     </li>
     <li onClick={()=>navigate("/contact")}><GrFormNext/> Contact Us</li>
     <li><GrFormNext/> Privacy Policy</li>
     <li><GrFormNext/> Terms & Conditions</li>
</ul>
        </Col>
        <Col className={`col-lg-3 col-md-6 col-12 mb-4 animate_animated ${inView ? "animate__backInDown":""} `}>
<h4 className='mb-4'>Contact</h4>
<ul className='footer-list'>
    <li className=''><FaLocationDot/> Ferozpure Road, Gulberg III Lahore </li>
    <li><FaPhone/> 0325-4007162</li>
    <li><RiMessageFill/> mianahsan428a@gmail.com</li>
    <li className='footer-icons'><FaTwitter size={40} onClick={() => window.location.href = "https://x.com"} /> <FaFacebookF size={40} onClick={() => window.location.href = "https://www.facebook.com/"}/> <FaYoutube size={40} onClick={() => window.location.href = "https://www.youtube.com/"}/> <FaLinkedinIn size={40} onClick={() => window.location.href = "https://x.com"}/></li>
</ul>
        </Col>
        <Col className={`col-lg-3 col-md-6 col-12 animate_animated ${inView ? "animate__backInDown":""}`}>
<h4 className='mb-4'>Newsletter</h4>    
<p>Subscribe to our Newsletter for latest updates and news</p>
<div className='footer-search'><input type="text" placeholder='Your email' /><button className='btn btn-green'>SignUp</button></div>
    </Col>
    </Row>
    </Container>
  )
}
