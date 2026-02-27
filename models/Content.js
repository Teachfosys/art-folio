import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    // The section name: "hero", "services", "partners", "case_studies", etc.
    section: { type: String, required: true, unique: true },
    
    // The flexible JSON data for this section
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Content || mongoose.model("Content", ContentSchema);
