import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';

export default function ExploreByCategory() {
  const [loading, setLoading]=useState(false);
  const[error, setError]=useState("")
  const navigate=useNavigate()
    const {categoryName}=useParams();
    console.log("categoryName", categoryName)
    const [data, setData]=useState(null);
    useEffect(()=>{
async function searchByCategory(){
    try{
      setError("")
 setLoading(true)
const response=await fetch(`http://localhost:3700/api/advertisement?category=${categoryName}`);
const result= await response.json();
if (!response.ok) {
  setError("Failed to fetch data, please try again later")
  setLoading(false);
  
  return;
}

if (!result.Advertisements || result.Advertisements.length === 0) { 
  setData([]); 
  return;
}
setLoading(false)
setData(result.Advertisements);

    }catch(err){
      setLoading(false)
       console.error("Network/server error:", err);
 
    }
}
searchByCategory();
    },[categoryName])
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
    <div style={{height:"100px", width:"70px", position:"absolute", top:"40px", left:"50px"}} className='border-green'></div>
    <h1 className='text-pure-white top-m' style={{position:"absolute", left:"80px"}} >Advertisement Categories</h1>
  </div>
  <Container >
<h1  className='text-green text-center py-3' >
      {categoryName}
    </h1>
  {error? <div  style={{minHeight:"40vh"}} className='d-flex justify-content-center align-items-center text-danger'>{error}</div>:loading?<div className="text-center my-4 d-flex justify-content-center align-items-center" style={{minHeight:"50vh"}}><span className="loader"></span></div>: <Row className='m-0'>
    {data &&
      data.length > 0 &&
      data.map((car) => (
        <Col className='col-12 border-black p-1 ps-3 rounded my-1' key={car._id}>
          <Row>
            <Col className='col-4 col-lg-2 p-0' style={{ height: "150px" }}>
              <img
                src={car.img[0]}
                alt={car.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Col>
            <Col className='d-flex flex-column justify-content-center p-2 ps-3'>
              <h3 className='text-green'>{car.name}</h3>
              <p className="truncate-description">{car.description}</p>
              <button className='btn-green p-1' style={{ width: "110px" }} onClick={()=>navigate(`/more-details/${car._id}`)}>
                More Details
              </button>
            </Col>
          </Row>
        </Col>
      ))}
  </Row>}
</Container>
</>
  )
}
