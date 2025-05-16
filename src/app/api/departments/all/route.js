// pages/api/departments/all.js
import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Department } from "../../../../../models/Departments";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await connectDb();
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    const departments = await Department.find({ user: userId }).lean();
    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
