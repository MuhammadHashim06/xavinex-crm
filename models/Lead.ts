import mongoose, { Schema, model, models } from "mongoose";

const LeadSchema = new Schema({
  clientName: { type: String, required: true },
  source: { type: String, enum: ["Direct", "Fiverr"], required: true },
  status: { 
    type: String, 
    enum: ["New Leads", "In Conversation", "Follow Up", "Strong Lead", "Not Interested"],
    default: "New Leads"
  },
  whatsapp: String,
  email: String,
  fiverrUsername: String,
  orderId: String,
  followUpNotes: String, // Added field for follow-up descriptions
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models.Lead) {
  delete mongoose.models.Lead;
}

const Lead = model("Lead", LeadSchema);
export default Lead;
