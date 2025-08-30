import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Row, Modal, Form, DropdownButton, Dropdown, Button  } from 'react-bootstrap'
import { useUser } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import { IoMdAdd } from "react-icons/io";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

export default function UserDashboard(props) {
  const [editId, setEditId] = useState(null);

    const imageInputRef=useRef()
const navigate=useNavigate()
    const [advData, setAdvData]=useState()
    const {user, setUser}=useUser();
  const [showModal, setShowModal]=useState(false)
  const [isLogingOut, setLogingOut]=useState(false)
  const [data, setData] = useState({
      name: { Value: "", error: "", valid: false },
      price: { Value: "", error: "", valid: false },
      description: { Value: "", error: "", valid: false },
      features: { Value: "", error: "", valid: false },
      startDate: { Value: "", error: "", valid: false },
      endDate: { Value: "", error: "", valid: false },
      category: { Value: "", error: "", valid: false },
      city: { Value: "", error: "", valid: false },
      type: { Value: "", error: "", valid: false },
      image: { Value: [], error: "", valid: false }
    });
  const logoutHandler=async()=>{
    try{
      setLogingOut(true)
   const res = await fetch("http://localhost:3700/api/user/logout", {
      method: "GET",
      credentials: "include", 
    });
      await res.json();
      console.log("res", res)
      if(res.ok){
        setUser(null);
        Swal.fire({
          icon:"success",
          timer:900,
          showConfirmButton:false,
          title:'Logout Successfull'
        })
      setTimeout(() => {
  navigate("/");
}, 1000);
      }else{
        Swal.fire({
          icon:"error",
          timer:900,
          showConfirmButton:false,
          title:'Failed to Logout'
        })
      }
    }
   catch(err){
    console.log("Error in Logout");
    console.log(err)
   }

  }
    const handleClose = () => {setShowModal(false)};

    function nameHandler(e) {
      const temp = e.target.value;
      if (temp.trim().length > 3) {
        setData(prev => ({ ...prev, name: { Value: temp, error: "", valid: true } }));
      } else {
        setData(prev => ({ ...prev, name: { Value: temp, error: "Invalid name", valid: false } }));
      }
    }
  function editHandler(e){
    try{
        setEditId(e._id);
      setShowModal(true)
 setData({
      name: { Value: e.name, error: "", valid: false },
      price: { Value: e.price, error: "", valid: false },
      description: { Value: e.description, error: "", valid: false },
      features: { Value: e.features, error: "", valid: false },
      startDate: { Value: new Date(e.startDate).toISOString().split("T")[0], error: "", valid: false },
endDate: {
  Value: new Date(e.endDate).toISOString().split("T")[0],
  error: "",
  valid: false
},

      category: { Value: e.category, error: "", valid: false },
      city: { Value: e.city, error: "", valid: false },
      type: { Value: e.type, error: "", valid: false },
image: {
  Value: Array.isArray(e.img) ? e.img : [],
  error: "",
  valid: true
}    })
    console.log(e.img)
    console.log("data", data)
    }catch(err){
      console.log("Error in edit");
      console.log(err);
    }
  }
  
    function priceHandler(e) {
    const value = e.target.value;
    if (value && Number(value) > 0) {
      setData(prev => ({ ...prev, price: { Value: value, error: "", valid: true } }));
    } else {
      setData(prev => ({ ...prev, price: { Value: value, error: "Enter a valid price", valid: false } }));
    }
  }
  
  function descriptionHandler(e) {
    const value = e.target.value;
    if (value.length >= 10) {
      setData(prev => ({ ...prev, description: { Value: value, error: "", valid: true } }));
    } else {
      setData(prev => ({ ...prev, description: { Value: value, error: "Description too short", valid: false } }));
    }
  }
  function featuresHandler(e) {
    const value = e.target.value;
    if (value.length >= 10) {
      setData(prev => ({ ...prev, features: { Value: value, error: "", valid: true } }));
    } else {
      setData(prev => ({ ...prev, features: { Value: value, error: "Feature length too short", valid: false } }));
    }
  }
  function handleDateChange(field, value){
    const today=new Date().toISOString().split("T")[0];
    if (today > value) {
    setData(prev => ({
      ...prev,
      [field]: { Value: value, error: "Invalid Date", valid: false }
    }));
    return; 
  }
  
    const start= field === "startDate"? value: data.startDate.Value;
      const end= field === "endDate"? value: data.endDate.Value;
  
  if (start && end && start >= end) {
      setData(prev => ({  
        ...prev,
        [field]: { Value: value, error: "Start date must be before end date", valid: false }
      }));
      return;
    }
  
    setData(prev => ({
      ...prev,
      [field]: { Value: value, error: "", valid: true }
    }));
  }

    async function getData(){
        try{
            const response= await fetch(`http://localhost:3700/api/advertisement?sellerId=${user.id}`
            );
            const result= await response.json()
            setAdvData(result.Advertisements)
        }
        catch(err){
             console.log("Error in Fetch");
             console.log(err)
        }
     }

    async function deleteHandler(id){
      try{
        Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then(async (result) => {
  if (result.isConfirmed) {
const response= await fetch(`http://localhost:3700/api/advertisement/delete/${id}`,
          {method:"DELETE"}
         );
           await response.json();
           if(response.ok){
            getData();
              Swal.fire({
      title: "Deleted!",
      text: "Advertisement has been deleted.",
      icon: "success",
      });
           }else{
            Swal.fire({
              title:"Failed to Delete",
           icon: "error",
            })
           }
  
  }
});
         
      }catch(err){
        console.log(err);
        console.log("Error in deleting button")
      }
    }
    useEffect(()=>{
     getData()
    }, [user])
  return (
<Container>
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
    <h1 className='text-pure-white' style={{position:"absolute", top:"65px", left:"80px"}}>User Dashboard</h1>
  </div>
    <Row>
        <Col className='col-md-5 col-lg-3  col-12'>
        <div className='border rounded px-2 py-4'>
        <div  style={{width:"150px", height:"150px", margin:"auto"}}>
            <img src={user?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s"} alt="User img" style={{borderRadius:"50%", width:"100%", height:"100%", background:"dark"}} />
        </div>
        <h2 className='text-center text-green'>{user && user.name}</h2>
        <hr />  
        <p className='p-0 mt-1'><strong>Email:</strong> {user && user.email}</p>
        <p className='p-0 mt-1'> <strong>Contact Number: </strong> { user &&user.contact}</p>
        <p className='p-0 mt-1'><strong>Birth Date: </strong> {user &&   new Date(user.dob).toLocaleDateString('en-GB')}</p>
        <button className='btn btn-success' onClick={()=>alert("Profile update")}>Edit Info</button>
        <button className='btn btn-success ms-2' disabled={isLogingOut} onClick={()=>logoutHandler()}>{isLogingOut? "Loging out": "Logout"}</button>
        {/* <button className='btn btn-success ms-2' onClick={()=>{navigate("/chat")}}>Help </button> */}
        </div>
        </Col>
        <Col className='col-md-7 col-lg-9 col-12'>
            <h2 className='text-green'>Post Advertisements</h2>
        {(advData && advData.length>0)? advData.map((adv)=>(
          <div className="border rounded mb-3">
          <Row key={adv._id} className='p-2 my-1'>
            <Col className='col-lg-4 col-5 m-0 ps-2' style={{height:"180px"}}>
            <img src={adv.img[0]} className='rounded' style={{width:"100%",height:"100%", objectFit:"cover"}} />
            </Col>
            <Col className='col'>
            <p className='fs-4 m-0'><strong>{adv.name}</strong></p>
            <p className='m-0 truncate-description'>{adv.description}</p>
            <p className='m-0 mt-2'><strong>Price: </strong>{adv.price}</p>
            <p className='m-0 my-2'><strong>City Area: </strong>{adv.city}</p>
          
            </Col>
        </Row>
            <Row>
              <Col className='text-end pb-2'>
              <button className='btn btn-danger me-2' onClick={()=>deleteHandler(adv._id)}>Delete</button>
            <button className='btn btn-success me-2' onClick={()=>editHandler(adv)}>Edit</button>
            <button className='btn btn-success' onClick={()=>navigate(`/more-details/${adv._id}`)}>View More</button>
            </Col>
            </Row>
       </div>  

        )):<div className=' h-50 d-flex justify-content-center align-items-center'>You don't have Advertisement yet</div>}
        </Col>
    </Row>
{/* Edit modal */}
<Modal show={showModal} onHide={handleClose} >
      <div className='d-flex p-3 justify-content-between border-bottom '>
        <h3 className='text-green'>Edit Advertisement</h3>
        <IoMdClose size={30} style={{ cursor: "pointer" }} onClick={handleClose} />
      </div>

      <Form className='p-3'>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={data.name.Value} onChange={nameHandler} />
          {data.name.error && <small className="text-danger">{data.name.error}</small>}
        </Form.Group>

       <Form.Group className="mb-3">
  <Form.Label>Price</Form.Label>
  <Form.Control
    type="number"
    min={0}
    value={data.price.Value}
    onChange={priceHandler}
  />
  {data.price.error && <small className="text-danger">{data.price.error}</small>}
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Description</Form.Label>
  <Form.Control
    as="textarea"
    rows={3}
    value={data.description.Value}
    onChange={descriptionHandler}
  />
  {data.description.error && <small className="text-danger">{data.description.error}</small>}
</Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Features</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={data.features.Value}
            onChange={featuresHandler}
          />
          {data.features.error && <small className="text-danger">{data.features.error}</small>}
        </Form.Group>

        <div className="d-flex gap-3">
          <Form.Group className="mb-3 w-50">
            <Form.Label>Starts On</Form.Label>
            <Form.Control
              type='date'
              value={data.startDate.Value}
  onChange={e => handleDateChange("startDate", e.target.value)}
            />
{data.startDate.error && <small className="text-danger">{data.startDate.error}</small>}
            </Form.Group>

          <Form.Group className="mb-3 w-50">
            <Form.Label>Ends On</Form.Label>
            <Form.Control
              type='date'
              value={data.endDate.Value}
  onChange={e => handleDateChange("endDate", e.target.value)}
            />
            {data.endDate.error && <small className="text-danger">{data.endDate.error}</small>}
          </Form.Group>
        </div>

        <div className='d-flex gap-3'>
          {/* Category Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <DropdownButton variant='success' title={data.category.Value || "Select Category"}>
              {props.carCategories && props.carCategories.length > 0 && props.carCategories.map((Cate) => (
                <Dropdown.Item key={Cate._id} onClick={()=>{setData(prev => ({ ...prev, category: { Value: Cate.title, error: "", valid: true } }))}}>
                  {Cate.title}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Group>

          {/* City Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>City Area</Form.Label>
            <DropdownButton variant='success' title={data.city.Value || "Select City"}>
              {props.cities && props.cities.length > 0 && props.cities.map((city, index) => (
                <Dropdown.Item key={index} onClick={()=>{setData(prev => ({ ...prev, city: { Value: city, error: "", valid: true } }))}}>
                  {city}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Group>

          {/* Type Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <DropdownButton variant='success' title={data.type.Value || "Select Type"}>
              {["For Sale", "For Rent", "Exchange"].map((type, index) => (
                <Dropdown.Item key={index} onClick={()=>{setData(prev => ({ ...prev, type: { Value: type, error: "", valid: true } }))}}>
                  {type}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Group>
        </div>

       <Form.Group className="mb-3">
  <Form.Control
    type="file"
    accept="image/*"
    ref={imageInputRef}
    className="d-none"
   onChange={(e) => {
  const file = e.target.files[0];
  if (file) {
    setData((prev) => ({
      ...prev,
      image: {
        ...prev.image,
        Value: [...(prev.image?.Value || []), file],
        error: "",
        valid: true,
      },
    }));
  } else {
    setData((prev) => ({
      ...prev,
      image: {
        ...prev.image,
        error: "Invalid image",
        valid: false,
      },
    }));
  }
}}

  />
</Form.Group>

    <div className='border rounded mb-2' style={{height:"80px"}}>
     {data?.image?.Value?.length > 0 &&
  data.image.Value.map((img, i) => (
    <div
      key={i}
      style={{
        width: "70px",
        height: "70px",
        position: "relative",
        margin: "3px",
        display: "inline-block",
      }}
    >
      <IoMdCloseCircleOutline
        color="red"
        size={27}
        className="position-absolute p-1 bg-white rounded"
        style={{ top: "1px", cursor: "pointer" }}
        onClick={() => {
          const updated = [...data.image.Value];
          updated.splice(i, 1);
          setData((prev) => ({
            ...prev,
            image: { ...prev.image, Value: updated },
          }));
        }}
      />
      <img
        src={typeof img === "string" ? img : URL.createObjectURL(img)}
        className="w-100 h-100 rounded"
      />
    </div>
  ))}

      <button className='border text-center rounded' style={{width:"70px", height:"70px", position:"relative", margin:"3px", display:"inline-block",cursor:"pointer"}} >
<IoMdAdd  color='gray' className='w-75 h-100' onClick={(e)=>{
  e.preventDefault();
  imageInputRef.current.click()}}/>
      </button>
    </div>
        <div className='text-end'>
<Button
  className='btn btn-primary'
  onClick={async () => {
    try {
      let uploadedImages = [];

      for (let img of data.image.Value) {
        if (typeof img === "string") {
          uploadedImages.push(img); 
        }else {
          const formData = new FormData();
          formData.append("file", img);
          formData.append("upload_preset", "ecommerce_unsigned"); 
          formData.append("cloud_name", "dl8ivfga7"); 

          const res = await fetch(`https://api.cloudinary.com/v1_1/dl8ivfga7/image/upload`, {
            method: "POST",
            body: formData
          });

          const cloudData = await res.json();
          uploadedImages.push(cloudData.secure_url);
        }
      }

      const updatedAd = {
        name: data.name.Value,
        price: data.price.Value,
        description: data.description.Value,
        features: data.features.Value,
        startDate: data.startDate.Value,
        endDate: data.endDate.Value,
        category: data.category.Value,
        city: data.city.Value,
        type: data.type.Value,
        img: uploadedImages
      };

      const response = await fetch(`http://localhost:3700/api/advertisement/update/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedAd)
      });

      if (response.ok) {
        Swal.fire("Success", "Advertisement updated!", "success");
        handleClose();
        getData(); 
      } else {
        Swal.fire("Error", "Failed to update ad", "error");
      }
    } catch (err) {
      console.log("Save Changes Error:", err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  }}
>
  Save Changes
</Button>
        <Button className='btn btn-primary ms-2' onClick={()=>handleClose()}>Close</Button>
        </div>
      </Form>
    </Modal>
</Container>
  )
}
