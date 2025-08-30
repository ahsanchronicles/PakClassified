import './App.css'
import Home from './pages/Home'
import CreateAdv from './pages/CreateAdv';
import {useState } from 'react';
import LoginPage from './pages/Login';
import Signup from './pages/Signup';
import SearchComp from './components/SearchComp';
import ExploreByCategory from './pages/ExploreByCategory';
import { Route, Routes } from 'react-router-dom';
import Category from './components/Category';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import Layout from './components/Layout';
import MoreDetail from './pages/MoreDetail';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';  
import UserDashboard from './pages/UserDashboard';
import OTPInput from './pages/OTPInput';
import Chat from './pages/Chat';

function App() {

  const [modals, setModals]=useState({
    postAdv:false,
    login:false,
    signup:false,
    passwordForgot:false
  })
    const pakistaniCities =[
  
      "Karachi",  
      "Lahore",
      "Islamabad",
      "Rawalpindi",
      "Faisalabad",
      "Multan",
      "Peshawar",
      "Quetta",
      "Hyderabad",
      "Gujranwala",
      "Sialkot",
      "Bahawalpur",
      "Sargodha",
      "Sukkur",
      "Larkana",
      "Sheikhupura",
      "Mirpur (AJK)",
      "Abbottabad",
      "Mardan",
      "Dera Ghazi Khan",
      "Sahiwal",
      "Okara",
      "Rahim Yar Khan",
      "Chiniot",
      "Kasur",
      "Muzaffarabad (AJK)",
      "Bannu",
      "Kohat",
      "Jhelum",
      "Dera Ismail Khan",
      "Nawabshah",
      "Gilgit",
      "Skardu",
      "Turbat",
      "Gwadar",
      "Khuzdar",
      "Mingora (Swat)",
      "Mansehra",
      "Jacobabad",
      "Hafizabad",
      "Attock",
      "Tando Adam",
      "Khairpur",
      "Kotri",
      "Vehari",
      "Mandi Bahauddin",
      "Nowshera",
      "Gojra",
      "Chakwal",
      "Bhakkar",
      "Jhang",
      "Kāmoke",
      "Tando Allahyar",
      "Shikarpur"
    ];
const carCategories = [
 
  {
    title: "Sedan",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJFTU6UeMFAA-Rms-iYu72xtfzT3EDnen9vA&s"
  },
  {
    title: "Hatchback",
    img: "https://hips.hearstapps.com/hmg-prod/images/hyundai-veloster-2019-1280-03-1540924925.jpg?crop=1xw:1xh;center,top&resize=980:*"
  },
  {
    title: "SUV",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlo-3qHuVhQ71rQNX62YMtR7xHgkygECf9ZA&s"
  },
  {
    title: "Crossover",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUw4SXFM1lvR_CVZwx2plgEgIyXtbpjpH9hQ&s"
  },
  {
    title: "Coupe",
    img: "https://cdn-ds.com/blogs-media/sites/178/2022/04/15044507/2022-Mercedes-AMG%C2%AE-GT-43-4-Door-Coupe-A_o.jpg"
  },
  {
    title: "Convertible",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMndUAWin-_zHxadKGMA7EA0HUlRNIe6HSFw&s"
  },
  {
    title: "Pickup Truck",
    img: "https://ei.marketwatch.com/Multimedia/2020/08/12/Photos/ZH/MW-IM345_at_sil_20200812150210_ZH.jpg?uuid=53012486-dcce-11ea-a718-9c8e992d421e"
  },
  {
    title: "Minivan",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPRsoxItMW3aKoUrZd-pZDMbkwNh2gTL8Fng&s"
  },
  {
    title: "Station Wagon",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmq9hMvOpWPPXb8rsHvTIlStKYCRYSGThnjw&s"
  },
  {
    title: "Luxury",
    img: "https://i.ytimg.com/vi/zEr-mm8OSGo/maxresdefault.jpg"
  },
  {
    title: "Electric",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLL2cRg1yM_LVHEle4e99z2QFjUevpHnWBSg&s"
  },
  {
    title: "Hybrid",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTshjhaj_P5jULP_azWwT-uJMRTAcSOEpeXQ&s",
  }
];




  return (
    <>
    <Routes>
      <Route  path="/"  element={<Layout modals={modals} setModals={setModals} cities={pakistaniCities} carCategories={carCategories}/>}>
      <Route index element={<Home carCategories={carCategories} cities={pakistaniCities} modals={modals} setModals={setModals}/>} />
      <Route path="/categories" element={<Category />} />
        <Route path='/contact' element={<Contact/>}></Route>
         {/* <Route path='/chat' element={<Chat/>}></Route> */}
      <Route path='/about' element={<AboutUs/>}></Route>
        <Route path='/user-dashboard' element={<UserDashboard carCategories={carCategories} cities={pakistaniCities}/>}></Route>
        <Route path="/category/:categoryName" element={<ExploreByCategory />} />
        <Route path='/more-details/:carId' element={<MoreDetail/>}></Route>
        <Route path='/otp-verification' element={<OTPInput setModals={setModals}/>}></Route>
        </Route>
     </Routes>
    </> 
  )
}
export default App;

