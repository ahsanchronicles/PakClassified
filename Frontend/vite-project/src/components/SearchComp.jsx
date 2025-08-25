import React, { useState, useRef } from 'react';
import { IoMdClose } from "react-icons/io";
import { Card, Container, Row, Col, Dropdown, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function SearchComp({ carCategories = [], cities = [] }) {
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const [search, setSearch] = useState({
    keyword: { Value: "", isValid: false },
    categoryDrop: { Value: "", isValid: false },
    cityDrop: { Value: "", isValid: false },
  });

  const handleClose = () => {
    setSearch({
      keyword: { Value: "", isValid: false },
      categoryDrop: { Value: "", isValid: false },
      cityDrop: { Value: "", isValid: false },
    });
    setModalShow(false);
    setData([]);
    setError(null);
  };

  const keywordChange = (e) => {
    const val = e.target.value.trim();
    setSearch(prev => ({
      ...prev,
      keyword: { Value: val, isValid: val.length >= 1 }
    }));
  };

  const handleSearch = async () => {
    setError(null);

    const { keyword, categoryDrop, cityDrop } = search;

    if (!keyword.isValid && !categoryDrop.isValid && !cityDrop.isValid) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Search",
        text: "Please enter a keyword or select a category or city to search.",
      });
      return;
    }

    setLoading(true);
    setModalShow(true);

    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const queryParams = new URLSearchParams();

      if (keyword.isValid) queryParams.append("name", keyword.Value);
      if (categoryDrop.isValid && categoryDrop.Value !== "All Categories") queryParams.append("category", categoryDrop.Value);
      if (cityDrop.isValid && cityDrop.Value !== "All Cities") queryParams.append("city", cityDrop.Value);

      const response = await fetch(`http://localhost:3700/api/advertisement?${queryParams.toString()}`);

      if (!response.ok) {
        if (response.status === 404) {
          setData([]);
          setLoading(false);
          return;
        }
        throw new Error("Something went wrong. Please check your internet connection.");
      }

      const json = await response.json();
      setData(json.Advertisements || []);
    } catch (err) {
      setError(err.message || "Something went wrong. Please check your internet connection.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid >
      <Row ref={topRef} className="bg-green d-flex justify-content-between  p-3 search-row align-items-center">

        <Col xs={12} md={3} lg={3} className="mb-2 mb-md-0">
          <input
            type="text"
            placeholder="Search By Keyword..."
            value={search.keyword.Value}
            onChange={keywordChange}
            className="keyword w-100"
            style={{ padding: '10px', borderRadius:"12px" }}
          />
        </Col>

        <Col xs={6} md={3} lg={2} className="mb-2 mb-md-0">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-category"
              className="dropdown-toggle-custom w-100"
              style={{ padding: '10px' }}
            >
              {search.categoryDrop.Value || "Select Category"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => setSearch(prev => ({ ...prev, categoryDrop: { Value: "All Categories", isValid: true } }))}
              >
                All Categories
              </Dropdown.Item>
              {carCategories.map(category => (
                <Dropdown.Item
                  key={category.title}
                  onClick={() => setSearch(prev => ({ ...prev, categoryDrop: { Value: category.title, isValid: true } }))}
                >
                  {category.title}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col xs={6} md={3} lg={2} className="mb-2 mb-md-0">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-city"
              className=" dropdown-toggle-custom w-100"
              style={{ padding: '10px 14px' }}
            >
              {search.cityDrop.Value || "Select City Area"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => setSearch(prev => ({ ...prev, cityDrop: { Value: "All Cities", isValid: true } }))}
              >
                All Cities
              </Dropdown.Item>
              {cities.map(city => (
                <Dropdown.Item
                  key={city}
                  onClick={() => setSearch(prev => ({ ...prev, cityDrop: { Value: city, isValid: true } }))}
                >
                  {city}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col xs={12} lg={2} md={3}>
          <Button
            variant="dark"
            className="w-100"
            style={{ padding: '10px 14px', borderRadius:"12px" }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Col>
      </Row>

      {modalShow && (
        <div className="w-100" style={{ minHeight: '50vh', position: 'relative' }}>
          <IoMdClose
            size={40}
            className="close"
            style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', zIndex: 10 }}
            onClick={handleClose}
          />

          <Container>
            <h1 className="text-green text-center pt-4 pb-4">Search Result</h1>

            {loading ? (
              <div className="h-450p w-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="success" role="status" />
                <span className="ms-2">Loading...</span>
              </div>
            ) : error ? (
              <div className="text-center pt-5 text-danger">{error}</div>
            ) : data.length > 0 ? (
              <Row>
                {data.map(car => (
                  <Col key={car._id} xs={12} md={6} className="pb-3">
                    <Card className="h-100">
                      <Card.Img
                        src={car.img?.[0]}
                        height="400px"
                        style={{ objectFit: "cover" }}
                        alt={car.name}
                      />
                      <Card.Body className="p-3 d-flex flex-column">
                        <strong>{car.name}</strong>
                        <p>{car.description}</p>
                        <Button
                          variant="success"
                          className="mt-auto"
                          style={{ width: "200px" }}
                          onClick={() => navigate(`/more-details/${car._id}`)}
                        >
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center pt-5 text-danger">Nothing found...</div>
            )}
          </Container>
        </div>
      )}
    </Container>
  );
}
