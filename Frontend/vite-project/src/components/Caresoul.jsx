import { Button, Carousel } from "react-bootstrap";

export default function CarouselComponent() {
  return (
    <Carousel
      data-bs-theme="success"
      className="position-relative"
      style={{height:"80vh"}}
    >
      {[1, 2].map((item) => (
        <Carousel.Item key={item}  style={{height:"80vh"}}>
          <img
            className="d-block w-100 h-100"
            style={{ maxHeight: "80vh", objectFit: "cover" }}
            src="https://res.cloudinary.com/dl8ivfga7/image/upload/v1755891755/Red_Minimalist_Modern_Automotive_Youtube_Channel_Art_1_kgnvy4.png"
            alt={`Slide ${item}`}
          />
          <Carousel.Caption
            className="text-start d-flex flex-column justify-content-center align-items-start"
            style={{
              padding: "3rem 1.5rem",
              maxWidth: "600px",
              left: "5%",
              right: "auto",
              bottom: "auto",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <h1 className="text-white display-5 fw-bold">
              Shift Into Gear: <br /> Your Destination <br /> For Car Excellence
            </h1>
            <p className="text-white fs-5">
              Drive Your Dreams: Find Your Perfect Car Today.
            </p>
            <div className="d-flex gap-3 mt-3 flex-wrap">
              <Button variant="success" className="px-4 py-2">
                Search A Car
              </Button>
              <Button variant="primary" className="px-4 py-2">
                Post Advertisement
              </Button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
