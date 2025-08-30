export async function gtpTicketCreate(user_message){
    try{
 const result = await messageModel.find({ userId }).sort({ createdAt: -1 }).limit(10).lean();
  const previousMessages = await result.json();
  const gptResponse= await fetch("https://api.groq.com/openai/v1/chat/completions",{
    method:"post",
    headers:{
        "content-type":"application/json",
         Authorization: `Bearer ${process.env.GROQ_API_KEY}`
    },
    body:JSON.stringify({
            model:"llama3-70b-8192",
            messages:[{
                role:"user",
                content: `You are pakClassified chatbot, create by Mian AhsTumhein user ka message dya jaye ga, usmein sa intent detect karna hai,
                like " "login_issue",
    "signup_issue",
    "otp_issue",
    "profile_update_issue",
    "password_reset_issue",
    "account_blocked_issue",
    "unknown"
 "
 agar intent samaj naa aye to intent unknown set kar sakte ho, aur agar iska ilawa bhi  koi intent set karna chahte ho to kar sakte ho, you are free for it.
 
                
                
                
                `      
            }]})
  })

    }catch(err){
        console.log("Error in GPTIntentCreate");
        res.status(500).json({message:"Error in GPTIntentCreate"})
    }
}