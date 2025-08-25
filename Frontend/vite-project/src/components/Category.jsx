import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

export default function Category() {
    const { ref, inView } = useInView({
          threshold: 0.02, 
        });
    const navigate = useNavigate();
    const [cate, setCate]=useState([])
    const imageMap = {
  "Sedan": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJFTU6UeMFAA-Rms-iYu72xtfzT3EDnen9vA&s",
  "Hatchback": "https://hips.hearstapps.com/hmg-prod/images/hyundai-veloster-2019-1280-03-1540924925.jpg?crop=1xw:1xh;center,top&resize=980:*",
  "SUV": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlo-3qHuVhQ71rQNX62YMtR7xHgkygECf9ZA&s",
  "Crossover": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUw4SXFM1lvR_CVZwx2plgEgIyXtbpjpH9hQ&s",
  "Coupe": "https://cdn-ds.com/blogs-media/sites/178/2022/04/15044507/2022-Mercedes-AMG%C2%AE-GT-43-4-Door-Coupe-A_o.jpg",
  "Convertible": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMndUAWin-_zHxadKGMA7EA0HUlRNIe6HSFw&s",
  "Pickup Truck": "https://ei.marketwatch.com/Multimedia/2020/08/12/Photos/ZH/MW-IM345_at_sil_20200812150210_ZH.jpg?uuid=53012486-dcce-11ea-a718-9c8e992d421e",
  "Minivan": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPRsoxItMW3aKoUrZd-pZDMbkwNh2gTL8Fng&s",
  "Station Wagon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmq9hMvOpWPPXb8rsHvTIlStKYCRYSGThnjw&s",
  "Luxury": "https://i.ytimg.com/vi/zEr-mm8OSGo/maxresdefault.jpg",
  "Electric": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLL2cRg1yM_LVHEle4e99z2QFjUevpHnWBSg&s",
  "Hybrid": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTshjhaj_P5jULP_azWwT-uJMRTAcSOEpeXQ&s"
};



useEffect(() => {
  async function fetchData() {
  
    try {
      const res = await fetch("http://localhost:3700/api/advertisement/category-count");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setCate(data);
     
    } catch (err) {
     
      console.error(err);
    } 
  }

  fetchData(); 
}, []); 



return (
        <Container fluid>
        <h1 className={`text-green text-center mt-4 mb-4 animate__animated ${
              inView ? 'animate__backInLeft ' : ''
            }`}>Explore by categories</h1>
   <Row ref={ref}>
{cate && cate.length>0 && cate.map((e)=>{

  return (
  <Col
            key={e._id}
            
            className={`col-lg-3 col-md-4 col-6 mb-3 animate__animated ${
              inView ? 'animate__backInRight animate__wobble' : ''
            }`}
          >
<Card style={{height:"300px", cursor:"pointer"}} className='card-hover' onClick={()=>navigate(`/category/${e._id}`)}>
    <Card.Img src={imageMap[e._id]} alt={e._id} style={{width:"100%", height:"90%", overflow:"hidden"}}>
    </Card.Img> 
    <Card.Body>
        <strong>{e._id}</strong>
        <div className='text-green'>{e.count} Cars</div>
    </Card.Body>
   </Card>

</Col>
)})}
</Row>
</Container>
)
}


