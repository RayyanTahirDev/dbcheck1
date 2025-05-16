// models/TeamMember.js
import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    reportTo: { type: String, required: true },
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
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    subfunctionIndex: { type: Number, required: true }, // index in subfunctions array
    invited: { type: Boolean, default: false }
  },
  { timestamps: true }
);

if (mongoose.models.TeamMember) {
  delete mongoose.models.TeamMember;
}

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
