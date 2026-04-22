import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  projectName: { type: String, required: true },
  clientName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalBudget: { type: String, required: true },
  outstandingBalance: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["In Progress", "Completed", "On Hold", "Cancelled"],
    default: "In Progress"
  },
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

const Project = model("Project", ProjectSchema);
export default Project;
