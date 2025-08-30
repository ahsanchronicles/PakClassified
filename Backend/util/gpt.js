import messageModel from "../models/Message.model.js";


export async function createIntent(message, userId){
    try{

    const result = await messageModel.find({ userId }).sort({ createdAt: -1 }).limit(10).lean();
const previousMessages = await result.json()
    const response= await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"post",
        headers:{
            "content-type":"application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body:JSON.stringify({
            model:"llama3-70b-8192",
            messages:[{
                role:"user",
                content: `You are PakClassified chatbot, created by Mian Ahsan.  
Your job is to analyze the user's message and detect **intent**, **intent_value**, and **reply**.  

Possible intents = ["update_name", "update_phone", "update_DOB", "update_Image", "delete_ad", "create_account","check_status", "report_issue","report_issue",  "unknown"].  

---

### Core Rules:  
1. **If no intent is clear** → set intent="unknown", give a short, friendly reply (max 2–3 lines).  

2. **If user asks about PakClassified/platform** →  
   reply:  
   "PakClassified ek modern car marketplace hai 🚗. Yahan sellers apni gaariyon ki ads post karte hain aur buyers un ads ko free mein browse kar sakte hain. Agar aap buyer hain to account ki zarurat nahi, lekin agar aap apni car bechna chahte hain to signup button (top-right corner) se account bana kar ad post kar sakte ho."  
   and set intent="unknown".  

3. **If intent detected but value missing** → set "intent_value": "Missing" and reply asking for detail.  

4. **If both intent and intent_value found** (like update_name = Ali) → return JSON with "reply": "" (empty). Do **NOT** generate reply yourself.  

5. **Name change request without value** (e.g. "Mera naam change kar do") →  
   intent="update_name", intent_value="Missing", reply: "Aap apna account ka user name kis naam par update karna chahte hain?"  

6. **If user replies only with value** (like "Ali") and previous was name/phone/DOB/image update request →  
   continue previous intent, set intent_value with that value, reply="".  

7. **If user asks status check** (like "Mera naam change ho gaya?" or "Meri update hogayi?") → set intent="check_status".  

8. **Invalid values** →  
   - Name contains numbers/symbols → intent_value="Missing", reply: "Naam valid nahi hai, kripya sahi naam batayein."  
   - Phone not in Pakistani format (11 digits starting with 03) → intent_value="Missing", reply: "Phone number valid format mein dein (e.g. 03xx-xxxxxxx)."  
   - DOB not in DD-MM-YYYY → intent_value="Missing", reply: "Date of Birth valid format mein dein (DD-MM-YYYY)."  

9. **Closing messages**:  
   - If user says "thanks/shukriya" after an update → reply: "Mujhe apki madad kar ke acha laga, apna khiyal rakhiye ga Allah Hafiz ☺️".  
   - If random "hi/hello" → reply: "Hi! Main PakClassified ki chatbot hoon, aapki madad ke liye yahan hoon."  

10. **If user asks "Tum mere liye kya kar sakte ho?"** → reply:  
   "Main aapki madad kar sakta hoon account ki details update karne mein (jaise user name, contact number, date of birth, profile image), aapko aapke account ki details dikhane mein, aur aapke account ki poori summary bhi de sakta hoon (jaise kitne advertisements aapne post kiye hain)."  
   intent="unknown".  

11. **Always respect previousMessages context** – continue conversation logically.  

12. **Non-car products (bikes, electronics, etc.)** → reply:  
   "PakClassified par filhaal sirf cars available hain, apka feedback note kar liya hai. Koshish karunga ka apki request ko forward kar sakoun."  
   intent="unknown". 
   13. For query related to create account etc set intent to account_knowledge 
14. For query related to feedback set intent to give_feedback, For query related to report or error set intent to report_issue
15. 
---

### Final Output Format (strictly JSON, no extra text):  
{
  "intent": "<detected_intent>",
  "intent_value": "<detected_value_or_Missing>",
  "reply": "<reply_or_empty>"
}

---

User Message: "${message}"  
Previous Messages: (${previousMessages})  
`

            } ]
        })
    })
    const data= await response.json();
    console.log("data", data)
      const rawContent = data?.choices?.[0]?.message?.content;
if (!rawContent) {
  throw new Error("Groq API did not return any message content");
}
 const match = rawContent.match(/\{[\s\S]*\}/);
  if (match) {
   const gptOutput = JSON.parse(match[0]);
  const phoneRegex = /^03[0-9]{9}$/;
const nameRegex = /^[A-Za-z\s]{2,50}$/;
   if(gptOutput.intent=="update_phone" && !phoneRegex.test(gptOutput.intent_value)){
return { intent: 'update_phone', intent_value: 'Missing', reply: 'Your contact number looks invalid, please enter valid phone number to proceed' }
   }
   else if(gptOutput.intent=="update_name" && !nameRegex.test(gptOutput.intent_value)){
     return { intent: 'update_name', intent_value: 'Missing', reply: 'Please enter valid user name, User name must hold only alphabets (A-Z)' }
   }
   else if (gptOutput.intent === "give_feedback") {
  return {intent: 'give_feedback', intent_value: 'Missing',  reply : "Shukriya apne feedback dene ke liye. Home page par 'Contact' section mein jaa kar apna feedback bhejein. Hum isse priority par consider karenge."}
}

else if (gptOutput.intent === "report_issue") {
 return {intent: 'report_issue', intent_value: 'Missing',  reply : "Humein afsos hai ke apko application mein issue aa raha hai. Aap 'Contact' section se masla report karen, hum ise jaldi resolve karenge."}
}
   else{
    console.log("gptOutput", gptOutput);
  return gptOutput
   }
    
  } else {
    throw new Error("No JSON object found in response");
  }

    }catch(err){
        console.log(err)
    }
}

export async function finalGPTResponse(message) {
  try {
    const gptResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "post",

      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: `Your role is PakClassified chatbot, Your name is Mian Ahsan.
            You will receive a message from backend, User ne apna account mein changes karne ki request ki thi.
            You have to create personalized aur professional tone mein user ko reply karna hai, keep in mind 2-3 lines max response hona chahie. 
            Backend tumhein json mein de ga ka kya kya cheeezain update hui hain. Unki base par professional user friendly tone mein reply generate karna aur wo cheez bhi mention karna jo change hui like:
            Congrats! Apka account ka user name Ali se successfully Ahsan ho gaya hai. Account ko re-login krein updates ko dekhna ke liye.
            Backend response: (${message})
            
            Apna bas aik object dena hai like this:
            {"reply":"Aapka contact number successfully 03121234567 update kar diya gaya hai."}
            In case of invalid contact number set intent_value to empty, and user reply to give valid contact number.
            length of contact should be 11 and it must start with 03 
            i dont need any extra thing. 
            `,
          },
        ],
      }),
    });

    if (!gptResponse.ok) {
      return { reply: "GPT response failed" };
    }

    const result = await gptResponse.json();
    // console.log("Raw final response:", result);

    // extract content
    const rawContent =
      result?.choices?.[0]?.message?.content || result?.choices?.[0]?.message;
    if (!rawContent) return { reply: "Unable to generate reply" };

    const match = rawContent.match(/\{[\s\S]*\}/);
    if (!match) return { reply: "No JSON found in GPT reply" };

    let finalReply;
    try {
      finalReply = JSON.parse(match[0]);
    } catch (e) {
      console.error("Final JSON Parse Error:", rawContent);
      finalReply = { reply: "Error parsing GPT reply" };
    }

    return finalReply; 
  } catch (err) {
    console.log(err);
    throw new Error("Error from final response");
  }
}
