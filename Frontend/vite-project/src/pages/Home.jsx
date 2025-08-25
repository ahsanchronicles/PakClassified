import CaresoulComp from "../components/Caresoul";
import Category from "../components/Category";
import LatestAdv from "../components/LatestAdv";
import SearchComp from "../components/SearchComp";
export default function Home(props) {
  console.log("render home page") 
  return (
    <>

     <CaresoulComp />
      <SearchComp carCategories={props.carCategories} cities={props.cities}/>
      <Category/>
      <LatestAdv latestPost={props.latestPost} /></>
    
  );
}
