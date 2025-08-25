import { createContext, useContext, useEffect, useState } from "react";

const UserContext=createContext();
export const useUser=()=>useContext(UserContext)
export const UserProvider=({children})=>{

    const [user, setUser]=useState(null);
   useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:3700/api/user/me",{
  credentials: "include",
})

      if (res.status === 401){
        console.warn("Not logged in");
        return; 
      }
      const result = await res.json();
      if (result.payLoad) {
        setUser(result.payLoad);
      }
    } catch (err){
      console.log("Error in Fetching user", err);
    }
  }
  fetchUser()
}, []);

return(
    <>
<UserContext.Provider value={{user, setUser}}>
    {children}
</UserContext.Provider>
    </>
)
    
}


