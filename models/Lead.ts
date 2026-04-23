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
  notes: String, // Initial notes from creation
  followUpNotes: String, // Kept for backward compatibility
  followUpHistory: [{
    note: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models.Lead) {
  delete mongoose.models.Lead;
}

const Lead = model("Lead", LeadSchema);
export default Lead;
