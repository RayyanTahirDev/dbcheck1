import { connectDb } from "@/connectDb";
import { NextResponse } from "next/server";
import { Department } from "../../../../models/Departments";
import { Organization } from "../../../../models/Organization";
import jwt from "jsonwebtoken";
import uploadFile from "../../../../middlewares/upload";

export async function GET(request) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    const url = new URL(request.url);
    const orgId = url.searchParams.get("organizationId");
    let filter = { user: userId };
    if (orgId) filter.organization = orgId;

    // Populate organization and subfunctions
    const departments = await Department.find(filter)
      .populate("organization")
      .lean();

    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDb();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const userId = decoded.id;

    const formdata = await request.formData();

    const departmentName = formdata.get("departmentName");
    const hodName = formdata.get("hodName");
    const hodPicFile = formdata.get("hodPic");
    const hodEmail = formdata.get("hodEmail");
    const role = formdata.get("role");
    const departmentDetails = formdata.get("departmentDetails");
    const subfunctionsRaw = formdata.get("subfunctions"); // JSON string of subfunctions

    if (!departmentName || !hodName || !hodEmail || !role) {
      return NextResponse.json(
        { message: "All required fields are required." },
        { status: 400 }
      );
    }

    let subfunctions = [];
    if (subfunctionsRaw) {
      try {
        subfunctions = JSON.parse(subfunctionsRaw);

        // Validate unique subfunction names within this department
        const names = subfunctions.map((sf) => sf.name.trim());
        const uniqueNames = new Set(names);
        if (names.length !== uniqueNames.size) {
          return NextResponse.json(
            { message: "Subfunction names must be unique within the department." },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { message: "Invalid subfunctions format." },
          { status: 400 }
        );
      }
    }

    const organization = await Organization.findOne({ user: userId });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found for the user." },
        { status: 404 }
      );
    }

    let hodPic = "";
    if (hodPicFile && hodPicFile.size > 0) {
      const uploadedHodPic = await uploadFile(hodPicFile);
      hodPic = uploadedHodPic.url;
    }

    const department = await Department.create({
      departmentName,
      hodName,
      hodPic,
      hodEmail,
      role,
      departmentDetails,
      organization: organization._id,
      user: userId,
      subfunctions,
    });

    return NextResponse.json(
      {
        department,
        message: "Department created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000 && error.keyPattern) {
      if (
        error.keyPattern.organization &&
        error.keyPattern.user &&
        error.keyPattern.departmentName
      ) {
        return NextResponse.json(
          {
            message:
              "Department with this name already exists in this organization for this user.",
          },
          { status: 400 }
        );
      }
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
