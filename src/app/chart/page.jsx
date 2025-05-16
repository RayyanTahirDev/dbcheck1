"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getOrganization } from "@/redux/action/org";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { logoutSuccess } from "@/redux/reducer/userReducer";
import axios from "axios";

function ChevronIcon({ up }) {
  return up ? (
    <svg
      className="w-4 h-4 mr-1"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 mr-1"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function ChartPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isAuth } = useSelector((state) => state.user);
  const { organization } = useSelector((state) => state.organization);

  const [departments, setDepartments] = useState([]);
  const [teammembers, setTeammembers] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [deptCollapsed, setDeptCollapsed] = useState({});

  useEffect(() => {
    if (!isAuth) {
      router.replace("/login");
    }
  }, [isAuth, router]);

  useEffect(() => {
    if (isAuth && !organization) {
      dispatch(getOrganization());
    }
  }, [isAuth, organization, dispatch]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!organization) return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `/api/departments?organizationId=${organization._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDepartments(data);
        setDeptCollapsed(
          data.reduce((acc, d) => ({ ...acc, [d._id]: false }), {})
        );
      } catch (err) {
        setDepartments([]);
      }
    };
    if (organization) fetchDepartments();
  }, [organization]);

  // Fetch only invited team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!organization) return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get("/api/teammembers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeammembers(data.filter((tm) => tm.invited));
      } catch (err) {
        setTeammembers([]);
      }
    };
    if (organization) fetchTeamMembers();
  }, [organization]);

  const logoutHandler = () => {
    Cookies.remove("token", { path: "/" });
    dispatch(logoutSuccess());
    router.push("/login");
  };

  if (!isAuth) return null;

  const orgBoxWidth = 340;
  const deptBoxWidth = 340;
  const deptBoxGap = 32;
  const subfuncBoxWidth = 180;
  const subfuncBoxGap = 16;
  const teamLeadBoxWidth = 180;
  const teamLeadBoxHeight = 60;
  const teamMemberBoxWidth = 140;
  const teamMemberBoxHeight = 50;
  const teamMemberBoxGap = 12;

  const totalDeptWidth =
    departments.length * deptBoxWidth + (departments.length - 1) * deptBoxGap;
  const svgWidth = Math.max(orgBoxWidth, totalDeptWidth);

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <header className="flex justify-between items-center max-w-5xl w-full mb-6">
        <h1 className="text-2xl font-bold">Organization Chart</h1>
        <div className="flex items-center gap-3">
          {!organization && (
            <Link href="/organization">
              <Button variant="outline" size="sm">
                Create New Chart
              </Button>
            </Link>
          )}
          <Link href="/invite">
            <Button variant="outline" size="sm">
              Add Team Member
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={logoutHandler}>
            Logout
          </Button>
        </div>
      </header>

      {/* Organization Name in black */}
      {organization && (
        <div className="text-3xl font-bold text-black mb-2">
          {organization.name}
        </div>
      )}

      {organization ? (
        <div className="flex flex-col items-center w-full">
          {/* Organization Box */}
          <div
            className="relative mx-auto bg-white rounded-xl shadow border border-gray-200 px-7 py-6 flex flex-col items-center"
            style={{ minWidth: orgBoxWidth, maxWidth: orgBoxWidth }}
          >
            <div className="flex items-center w-full mb-2">
              <div className="flex-shrink-0 mr-4">
                {organization.ceoPic ? (
                  <img
                    src={organization.ceoPic}
                    alt={`${organization.ceoName} Picture`}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold">{organization.ceoName}</div>
                <div className="text-base text-gray-900 font-medium">CEO</div>
                <div className="text-sm text-gray-400">Executive</div>
                <div className="text-sm text-gray-700">
                  {organization.email}
                </div>
              </div>
            </div>
            <div className="flex w-full justify-between mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCollapsed((c) => !c)}
                className="flex items-center"
              >
                <ChevronIcon up={!collapsed} />
                {collapsed ? "Expand" : "Collapse"}
              </Button>
              <Link href="/departments">
                <Button size="sm" variant="outline">
                  + Add
                </Button>
              </Link>
            </div>
          </div>

          {/* SVG lines from org to departments */}
          {!collapsed && departments.length > 0 && (
            <svg
              width={svgWidth}
              height="54"
              className="block mx-auto"
              style={{ marginTop: 0, marginBottom: -12 }}
            >
              <line
                x1={svgWidth / 2}
                y1={0}
                x2={svgWidth / 2}
                y2={24}
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <line
                x1={svgWidth / 2 - totalDeptWidth / 2 + deptBoxWidth / 2}
                y1={24}
                x2={svgWidth / 2 + totalDeptWidth / 2 - deptBoxWidth / 2}
                y2={24}
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              {departments.map((_, idx) => {
                const x =
                  svgWidth / 2 -
                  totalDeptWidth / 2 +
                  deptBoxWidth / 2 +
                  idx * (deptBoxWidth + deptBoxGap);
                return (
                  <line
                    key={idx}
                    x1={x}
                    y1={24}
                    x2={x}
                    y2={54}
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          )}

          {/* Departments and Subfunctions */}
          {!collapsed && departments.length > 0 && (
            <div
              className="flex flex-row justify-center items-start gap-8 mt-0"
              style={{ minWidth: svgWidth }}
            >
              {departments.map((department, deptIdx) => {
                const subfuncCount = department.subfunctions?.length || 0;
                const subfuncsWidth =
                  subfuncCount * subfuncBoxWidth +
                  (subfuncCount - 1) * subfuncBoxGap;

                return (
                  <div key={department._id} className="flex flex-col items-center">
                    {/* Department Box */}
                    <div
                      className="relative bg-white rounded-xl shadow border border-gray-200 px-7 py-6 flex flex-col items-center mb-6"
                      style={{ minWidth: deptBoxWidth, maxWidth: deptBoxWidth }}
                    >
                      <div className="flex items-center w-full mb-2">
                        <div className="flex-shrink-0 mr-4">
                          {department.hodPic ? (
                            <img
                              src={department.hodPic}
                              alt={`${department.hodName} Picture`}
                              className="w-12 h-12 rounded-full object-cover border border-gray-300"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                              <span>No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-bold">
                            {department.hodName}
                          </div>
                          <div className="text-base text-gray-900 font-medium">
                            {department.role}
                          </div>
                          <div className="text-sm text-gray-400">
                            {department.departmentName}
                          </div>
                          <div className="text-sm text-gray-700">
                            {department.hodEmail}
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full justify-between mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setDeptCollapsed((prev) => ({
                              ...prev,
                              [department._id]: !prev[department._id],
                            }))
                          }
                          className="flex items-center"
                        >
                          <ChevronIcon up={!deptCollapsed[department._id]} />
                          {deptCollapsed[department._id] ? "Expand" : "Collapse"}
                        </Button>
                        <Link href="/departments">
                          <Button size="sm" variant="outline">
                            + Add
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Subfunctions */}
                    {subfuncCount > 0 && !deptCollapsed[department._id] && (
                      <div
                        className="flex flex-row gap-4"
                        style={{ minWidth: subfuncsWidth, justifyContent: "center" }}
                      >
                        {department.subfunctions.map((sf, idx) => {
                          // Find team lead and team members for this subfunction
                          const teamLead = teammembers.find(
                            (tm) =>
                              tm.department === department._id &&
                              tm.subfunctionIndex === idx &&
                              tm.role === "Team Lead"
                          );
                          const teamMembers = teammembers.filter(
                            (tm) =>
                              tm.department === department._id &&
                              tm.subfunctionIndex === idx &&
                              tm.role === "Team Member"
                          );

                          // SVG line from department to subfunction
                          // (vertically centered under department box)
                          return (
                            <div
                              key={idx}
                              className="flex flex-col items-center"
                              style={{ minWidth: subfuncBoxWidth }}
                            >
                              {/* Line from department to subfunction */}
                              <svg
                                width={subfuncBoxWidth}
                                height="30"
                                style={{ display: "block" }}
                              >
                                <line
                                  x1={subfuncBoxWidth / 2}
                                  y1={0}
                                  x2={subfuncBoxWidth / 2}
                                  y2={30}
                                  stroke="#e5e7eb"
                                  strokeWidth="2"
                                />
                              </svg>
                              {/* Subfunction Box */}
                              <div
                                className="bg-white rounded-xl shadow border border-gray-400 px-4 py-2 flex flex-col items-center"
                                style={{
                                  minWidth: subfuncBoxWidth,
                                  maxWidth: subfuncBoxWidth,
                                }}
                              >
                                <div className="text-md font-semibold text-center text-black">
                                  {sf.name}
                                </div>
                              </div>
                              {/* Line from subfunction to team lead */}
                              {teamLead && (
                                <svg
                                  height="30"
                                  width={subfuncBoxWidth}
                                  style={{ display: "block" }}
                                >
                                  <line
                                    x1={subfuncBoxWidth / 2}
                                    y1={0}
                                    x2={subfuncBoxWidth / 2}
                                    y2={30}
                                    stroke="#e5e7eb"
                                    strokeWidth="2"
                                  />
                                </svg>
                              )}
                              {/* Team Lead Box */}
                              {teamLead && (
                                <div
                                  className="bg-gray-100 rounded-lg shadow border border-gray-400 px-4 py-2 flex flex-col items-center"
                                  style={{
                                    minWidth: teamLeadBoxWidth,
                                    maxWidth: teamLeadBoxWidth,
                                    minHeight: teamLeadBoxHeight,
                                    marginBottom: teamMembers.length ? 16 : 0,
                                  }}
                                >
                                  <span className="font-bold text-black">
                                    {teamLead.name}
                                  </span>
                                  <span className="text-xs text-gray-700">
                                    Team Lead
                                  </span>
                                </div>
                              )}
                              {/* Lines from team lead to team members */}
                              {teamLead && teamMembers.length > 0 && (
                                <svg
                                  height="30"
                                  width={
                                    teamMembers.length * teamMemberBoxWidth +
                                    (teamMembers.length - 1) * teamMemberBoxGap
                                  }
                                  style={{ display: "block" }}
                                >
                                  {teamMembers.map((_, i) => {
                                    const x =
                                      (teamMemberBoxWidth + teamMemberBoxGap) * i +
                                      teamMemberBoxWidth / 2;
                                    return (
                                      <line
                                        key={i}
                                        x1={
                                          (teamMembers.length *
                                            (teamMemberBoxWidth + teamMemberBoxGap) -
                                            teamMemberBoxGap) /
                                            2
                                        }
                                        y1={0}
                                        x2={x}
                                        y2={30}
                                        stroke="#e5e7eb"
                                        strokeWidth="2"
                                      />
                                    );
                                  })}
                                </svg>
                              )}
                              {/* Team Members */}
                              {teamLead && teamMembers.length > 0 && (
                                <div className="flex flex-row gap-3 mt-0">
                                  {teamMembers.map((tm) => (
                                    <div
                                      key={tm._id}
                                      className="bg-gray-50 rounded-lg shadow border border-gray-300 px-3 py-2 flex flex-col items-center"
                                      style={{
                                        minWidth: teamMemberBoxWidth,
                                        maxWidth: teamMemberBoxWidth,
                                        minHeight: teamMemberBoxHeight,
                                      }}
                                    >
                                      <span className="font-semibold text-black">
                                        {tm.name}
                                      </span>
                                      <span className="text-xs text-gray-700">
                                        Team Member
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600 max-w-md mx-auto">
          No organization chart available. Please create a new chart.
        </p>
      )}
    </div>
  );
}
