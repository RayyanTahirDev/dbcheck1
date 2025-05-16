// pages/api/teammembers/invite.js
import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { TeamMember } from "../../../../../models/TeamMember";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDb();
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;
    const body = await request.json();  
    const { teammemberIds } = body;

    if (!Array.isArray(teammemberIds) || teammemberIds.length === 0)
      return NextResponse.json({ message: "No teammembers selected" }, { status: 400 });

    await TeamMember.updateMany(
      { _id: { $in: teammemberIds }, user: userId },
      { $set: { invited: true } }
    );

    return NextResponse.json({ message: "Team members invited" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
