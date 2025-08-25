import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from "react-icons/io";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useUser } from '../context/userContext';

export default function CreateAdv(props) {
  const [valid, setValid]=useState(false)
  const fileRef=useRef();
  const {user}=useUser()
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
function removeImageHandler(im){
  setData((prev)=>({...prev, image:{...prev.image, Value:prev.image.Value.filter((e)=> e != im)}}))
}
  const handleClose = () => props.setModals(prev => ({ ...prev, postAdv: false }));
async function formSubmit(e){
  e.preventDefault(); 
  try{
    setValid(true)
    if(!data.name.valid || !data.price.valid || !data.description.valid || !data.features.valid || !data.startDate.valid || !data.endDate.valid || !data.category.valid || !data.city.valid || !data.type.valid || !data.city.valid){
      Swal.fire({
        icon:"warning",
        title:"Incomplete Details!",
        text:"Please enter complete detail"
      })
      setValid(false);
      return
    }
    const featuresArray=data.features.Value.split(",");
    let imagesArray=[];
    for(let i of data.image.Value){
      if(typeof i == "string"){
        imagesArray.push(i);
      }else{
        const formdata= new FormData();
        formdata.append("file", i);
        formdata.append("upload_preset", "ecommerce_unsigned");
        formdata.append("cloud_name", "dl8ivfga7"); 

        const res= await fetch("https://api.cloudinary.com/v1_1/dl8ivfga7/image/upload",{
          method:"post",
          body: formdata
        })
        const result=await res.json();
        if(!res.ok){
          setValid(false)
          Swal.fire({
            title:"Failed to save images",
            text:"Please check your internet or try again later",
            icon:"error",
          })
        }
        imagesArray.push(result.secure_url);
      }
    }
    const payLoad={
      name:data.name.Value,
      price:Number(data.price.Value),
      description:data.description.Value,
      features:featuresArray,
     startDate:data.startDate.Value,
     endDate:data.endDate.Value,
     category:data.category.Value,
     city:data.city.Value,
     type: data.type.Value, 
     img:imagesArray,
     sellerId:user.id
    }
    const res=await fetch("http://localhost:3700/api/advertisement/create",{
      method:"POST",
      headers:{
            "Content-Type": "application/json"
      },
      body: JSON.stringify(payLoad)
    })
if(res.ok){
  setData({
    name: { Value: "", error: "", valid: false },
    price: { Value: "", error: "", valid: false },
    description: { Value: "", error: "", valid: false },
    features: { Value: [], error: "", valid: false },
    startDate: { Value: "", error: "", valid: false },
    endDate: { Value: "", error: "", valid: false },
    category: { Value: "", error: "", valid: false },
    city: { Value: "", error: "", valid: false },
    type: { Value: "", error: "", valid: false },
    image: { Value:[], error: "", valid: false }
  })
  await Swal.fire({
    title: "Good job!",
    text: "Advertisement created successfully",
    icon: "success"
  });
  props.setModals(prev => ({ ...prev, postAdv: false }));
  
  }
else{
  Swal.fire({
  title: "Error!",
  text: "Failed to create Advertisement",
  icon: "error"
});
}
  }catch(err){
    console.log("Error in creating Advertisement");
    console.log(err)
  }
}
  function nameHandler(e) {
    const temp = e.target.value;
    if (temp.trim().length > 3) {
      setData(prev => ({ ...prev, name: { Value: temp, error: "", valid: true } }));
    } else {
      setData(prev => ({ ...prev, name: { Value: temp, error: "Invalid name", valid: false } }));
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
  return (
    <Modal show={props.modals.postAdv} onHide={handleClose}>
      <div className='d-flex p-3 justify-content-between border-bottom '>
        <h3 className='text-green'>Post Advertisement</h3>
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
            placeholder="Enter features separated by commas (e.g. Sunroof, Leather Seats, Bluetooth)"
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

          <Form.Group className="mb-3">
            <Form.Label>City Area</Form.Label>
            <DropdownButton variant='success'  title={data.city.Value || "Select City"}>
              {props.cities && props.cities.length > 0 && props.cities.map((city, index) => (
                <Dropdown.Item key={index} onClick={()=>{setData(prev => ({ ...prev, city: { Value: city, error: "", valid: true } }))}}>
                  {city}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Group>

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
          <Form.Label>Image</Form.Label>
          <Form.Control type='file' accept='image/*' ref={fileRef} className='d-none' onChange={e=>{
            const file= e.target.files[0];
            if(file){
              setData((prev)=>({...prev, image: {
        ...prev.image,
        Value: [...(prev.image?.Value || []), file],
        error: "",
        valid: true,
      } }))
            }
            console.log(data)
          }}/>
        </Form.Group>
<div className='mb-2 border rounded p-2 d-flex justify-content-start' style={{height:"80px"}}>
  {Array.isArray(data.image.Value) && data.image.Value.length>0 && data.image.Value.map((im)=>(
<div style={{height:"60px", width:"60px", cursor:"pointer", position:"relative", marginLeft:"7px"}}>
    <span style={{position:"absolute", top:"-5px", background:"white", borderRadius:"5px"}}><IoClose size={15} onClick={()=>removeImageHandler(im)} color='red' /></span>
    <img src={URL.createObjectURL(im)} alt="Car img" className='h-100 w-100 rounded object-fit-cover border'  />

  </div>
  ))}
  
  {data.image.Value.length < 5 && <div className='rounded border d-flex justify-content-center align-items-center ms-1 ' style={{height:"60px", width:"60px", cursor:"pointer"}} onClick={()=>{
    fileRef.current.click();
    }}>
    <IoMdAdd size={42} color='gray'/>
  </div>}
</div>
        <Button variant="primary" type="submit" onClick={formSubmit}
        disabled={valid}>
        {valid? "Loading please wait..." : "Post Advertisement"}      
        </Button>
      </Form>
    </Modal>
  );
}
