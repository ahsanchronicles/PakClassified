import { ticketModel } from "../models/ticket.model";
export async function TicketCreating(ticketData){
    try{
    const {contact_number, intent, user_message, issue, troubleShoot_attempts, mood }=ticketData;
    if(!contact_number ) return res.status(400).json({Message:"Contact number is missing"});
    if(!intent ) return res.status(400).json({Message:"Intent is missing"});
    if(!user_message ) return res.status(400).json({Message:"User message is missing"});
    if(!issue ) return res.status(400).json({Message:"Issue is missing"});
    const ticket= await ticketModel.create({contact_number, intent, user_message, issue, troubleShoot_attempts, mood })
if(!ticket){
    return res.status(400).json({Message:"Failed to create ticket"})
}
else{
    return res.status(201).json({Message:"Ticket created now you can trouble shoot"});
}
    }catch(err){
        console.log("Internal server error at TicketCreating");
        res.status(500).send("Internal server error")
    }
}