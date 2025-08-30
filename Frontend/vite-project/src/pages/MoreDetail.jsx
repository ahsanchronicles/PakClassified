import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai";
import { GrNext } from "react-icons/gr";
import { useParams } from "react-router-dom";
export default function MoreDetail() {
  const [loading, setLoading]=useState(false)
  const [data, setData] = useState([]);
  const [sellerDetail, setSellerDetail] = useState(null);
  const { carId } = useParams();
  useEffect(() => {
    async function fetchCarDetail() {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost:3700/api/advertisement?id=${carId}`
        );
        const result = await response.json();
        setData(result.Advertisements);
        if (result.Advertisements.length > 0) {
          const sellerId = result.Advertisements[0].sellerId;
          const sellerRes = await fetch(
            `http://localhost:3700/api/user/${sellerId}`
          );
          const sellerData = await sellerRes.json();
          setSellerDetail(sellerData.user);
        }
      } catch (err) {
        console.log("Error in Fetching");
        console.log(err.message);
      }finally{
        setLoading(false)
      }
    }
    fetchCarDetail();
  }, [carId]);
  return (
    <Container className="p-0 mb-5" fluid>
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
          className="text-pure-white top-m"
          style={{ position: "absolute", left: "80px" }}
        >
          Car Details
        </h1>
      </div>
 {loading?(<div className="text-center my-4 d-flex justify-content-center align-items-center" style={{minHeight:"50vh"}}><span class="loader"></span></div>)  :
      (data &&
        data.length > 0 &&
        data.map((car) => (
          <Row className="m-0 p-lg-5 p-3" key={car._id}>
            <Col className="col-md-7 col-12 border rounded">
              <Row>
                <Col className="col-md-3 col-4 p-0 " style={{ height: "100px" }}>
                  <img
                    src={car.img[0]}
                    className="h-100 w-100 object-fit-cover rounded"
                  />
                </Col>
                <Col className="col">
                  <h3 className="p-2 ">{car.name}</h3>
                  <p className="p-2 py-0">
                    <FaLocationDot size={20} className="text-green mb-2" />
                    &nbsp; {car.city} &nbsp; &nbsp; &nbsp;{" "}
                    <FaRegMoneyBillAlt size={25} className="text-green mb-1" />{" "}
                    &nbsp; {car.price}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col className="col-12 pt-3">
                  <h2>Car Description</h2>
                  <p>{car.description} </p>
                </Col>
                <Col className="col-12">
                  <h2>Features</h2>
                  <ul className=" p-2">
                    {car.features.map((feature, index) => (
                      <li key={index}>
                        <AiOutlineCheck size={22} className="text-green" />{" "}
                        {feature}{" "}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Col>
            <Col className="col-md-5 col-12 m-md-0 mt-4">
              <div className=" rounded bg-light-green p-3" style={{ width: "fit-content" }}>
                <h4 className="mb-0 pb-0 mx-2">Advertisement Summary</h4>
                <ul className=" ps-1 py-3">
                  <li className="pt-2">
                    <GrNext className="text-green" /> &nbsp;{" "}
                    <strong>Posted By</strong>:{" "}
                    {sellerDetail ? sellerDetail.name : "No Seller Name"}{" "}
                  </li>
                  <li className="pt-2">
                    <GrNext className="text-green" /> &nbsp;{" "}
                    <strong>Posted At</strong>:
                    {data[0] && data[0].createdAt
                      ? new Date(data[0].createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : " No created date mention"}
                  </li>
                  <li className="pt-2">
                    <GrNext className="text-green" /> &nbsp;{" "}
                    <strong>City</strong>:{" "}
                    {data ? data[0].city : "No city mention"}{" "}
                  </li>
                  <li className="pt-2">
                    <GrNext className="text-green" /> &nbsp;{" "}
                    <strong>Price</strong>:{" "}
                    {data ? data[0].price + " PKR" : "No Price mention"}{" "}
                  </li>
                  <li className="pt-2">
                    <GrNext className="text-green" /> &nbsp;{" "}
                    <strong>Contact</strong>:{" "}
                    {sellerDetail ? sellerDetail.contact : "No contact mention"}{" "}
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        )))}
    </Container>
  );
}
