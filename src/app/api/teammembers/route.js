// pages/api/teammembers/index.js
import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { TeamMember } from "../../../../models/TeamMember";
import { Department } from "../../../../models/Departments";
import { Organization } from "../../../../models/Organization";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await connectDb();
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    const url = new URL(request.url);
    const orgId = url.searchParams.get("organizationId");
    const deptId = url.searchParams.get("departmentId");

    let filter = { user: userId };
    if (orgId) filter.organization = orgId;
    if (deptId) filter.department = deptId;

    const teammembers = await TeamMember.find(filter).lean();
    return NextResponse.json(teammembers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDb();
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;
    const body = await request.json();

    const { name, email, departmentId, subfunctionIndex } = body;
    if (!name || !email || !departmentId || subfunctionIndex === undefined)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    // Find department and subfunction
    const department = await Department.findById(departmentId).lean();
    if (!department) return NextResponse.json({ message: "Department not found" }, { status: 404 });
    const subfunctions = department.subfunctions || [];
    if (!subfunctions[subfunctionIndex])
      return NextResponse.json({ message: "Subfunction not found" }, { status: 404 });

    // Find existing teammembers in this subfunction
    const existing = await TeamMember.find({
      department: departmentId,
      subfunctionIndex,
    }).sort({ createdAt: 1 }).lean();

    let role, reportTo;
    if (existing.length === 0) {
      role = "Team Lead";
      reportTo = department.hodName;
    } else {
      role = "Team Member";
      // Find the team lead in this subfunction
      const teamLead = existing.find((tm) => tm.role === "Team Lead");
      reportTo = teamLead ? teamLead.name : department.hodName;
    }

    const organization = await Organization.findById(department.organization);

    const teammember = await TeamMember.create({
      name,
      email,
      role,
      reportTo,
      organization: organization._id,
      user: userId,
      department: departmentId,
      subfunctionIndex,
    });

    return NextResponse.json({ teammember, message: "Team member added" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
