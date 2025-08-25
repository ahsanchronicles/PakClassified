import { useEffect, useState } from "react";
import { Card, Col, Row, Container } from "react-bootstrap";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io("http://localhost:3700");
export default function LatestAdv() {
  const navigate =useNavigate()
  const [latestPost, setLatestPost]=useState([]);
  
 useEffect(() => {
    
    fetch("http://localhost:3700/api/advertisement?limit=4&sort=desc").then((res)=>{
      return res.json();
    
    }).then((data)=>{
      
      setLatestPost(data.Advertisements)}
    ).catch((error) => {
        console.error('Error fetching data:', error);
      })
    
    socket.on("new-ad-posted", (newAdv)=>{
          console.log("📢 New Ad Received via socket:", newAdv)
      
          setLatestPost((prev)=>{
            const exist=prev.find(item => item._id=== newAdv._id);
            if(exist){
              return prev;
            }
              const trimmedPrev = prev.slice(0, 3);
            return [newAdv, ...trimmedPrev]
          }
        )
  })  
     return () => {
      socket.off("new-ad-posted");
    }}
    ,[])
    

  return (
    
    <Container className="bg-light">
    <h1 className="text-center text-green pt-2 mb-4">Latest Posting</h1> 
  <Row>
    {latestPost && latestPost.length >0 && latestPost.map(e=>(
        <Col className="col-md-6 col-12 mb-3" key={e._id}>
            <Card>
                <Card.Img src={e.img[0]} height="400px" style={{objectFit:"cover"}}></Card.Img>
                <Card.Body className="px-3 pt-3"><strong>{e.name}</strong> <br /> <p className="truncate-description">{e.description}</p> <br />
                <button className="btn btn-green" style={{width:"200px"}} onClick={()=>navigate(`/more-details/${e._id}`)}>View Details</button>
                </Card.Body>
            </Card>
        </Col>
    ))}
  </Row>
  </Container>
)
}   
