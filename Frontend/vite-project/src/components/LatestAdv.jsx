import { Card, Col, Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function LatestAdv({latestPost}) {
  const navigate =useNavigate()

    

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
