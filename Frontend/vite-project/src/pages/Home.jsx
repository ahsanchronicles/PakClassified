import { useEffect, useState } from "react";
import CaresoulComp from "../components/Caresoul";
import Category from "../components/Category";
import LatestAdv from "../components/LatestAdv";
import SearchComp from "../components/SearchComp";
export default function Home(props) {
  const [latestPost, setLatestPost]=useState([]);
      const [cate, setCate]=useState([])
      const [err, setError]=useState("")
useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch("http://localhost:3700/api/advertisement/category-count");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setCate(data);
     
    } catch (err) {
      if (!err.response) {
        setError("⚠️ Please check your internet connection.");
      } else {
        setError("⚠️ Failed to fetch categories, try again later.");
      }
    }
  }

  fetchData(); 
}, []); 
useEffect(() => {
  fetch("http://localhost:3700/api/advertisement?limit=4&sort=desc")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Server error");
      }
      return res.json();
    })
    .then((data) => {
      setLatestPost(data.Advertisements);
    })
    .catch((err) => {
      if (err.message === "Failed to fetch") {
        setError("⚠️ Please check your internet connection.");
      } else {
        setError("⚠️ Failed to fetch latest posts, try again later.");
      }
    });
}, []);



  return (
    <>

     <CaresoulComp />
      <SearchComp carCategories={props.carCategories} cities={props.cities}/>
      {err?<div className="text-danger d-flex justify-content-center align-items-center" style={{minHeight:"40vh"}}>{err}</div>:<><Category cate={cate}/>
      <LatestAdv latestPost={latestPost} /></>}
      
      </>
    
  );
}
