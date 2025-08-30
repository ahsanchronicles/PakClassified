import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import CreateAdv from "../pages/CreateAdv";
import LoginPage from "../pages/Login";
import Signup from "../pages/Signup";
import OTPInput from "../pages/OTPInput";
import PasswordReste from "../pages/PasswordReste";

export default function Layout({ modals, setModals, carCategories, cities, setUserEmail }) {

  return (
    <>
      <NavBar
        modals={modals}
        setModals={setModals}
        carCategories={carCategories}
      />
          
      <Outlet/>
            <Footer />  
          <CreateAdv
            modals={modals}
            cities={cities}
            setModals={setModals}
            carCategories={carCategories}
          />
          <LoginPage modals={modals} setModals={setModals} />
          <PasswordReste modals={modals} setModals={setModals}/>
          <Signup modals={modals} setModals={setModals} setUserEmail={setUserEmail} />
       </>)
  

}
