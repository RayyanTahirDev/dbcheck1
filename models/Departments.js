import mongoose from "mongoose";

const subfunctionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String },
});

const departmentSchema = new mongoose.Schema(
  {
    departmentName: { type: String, required: true },
    hodName: { type: String, required: true },
    hodPic: { type: String },
    hodEmail: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    role: { type: String, required: true },
    departmentDetails: { type: String },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subfunctions: [subfunctionSchema], // Array of subfunctions
  },
  { timestamps: true }
);

departmentSchema.index(
  { organization: 1, user: 1, departmentName: 1 },
  { unique: true }
);

if (mongoose.models.Department) {
  delete mongoose.models.Department;
}

export const Department = mongoose.model("Department", departmentSchema);
