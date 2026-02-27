import mongoose from "mongoose";

const StorageSchema = new mongoose.Schema({
  // Only one document will ever exist to track the global total
  type: { type: String, default: "global", unique: true },
  
  // Total bytes used
  totalBytesUsed: { type: Number, default: 0 },
  
  // 2GB in bytes
  maxBytesLimit: { type: Number, default: 2 * 1024 * 1024 * 1024 },
}, { timestamps: true });

export default mongoose.models.Storage || mongoose.model("Storage", StorageSchema);
