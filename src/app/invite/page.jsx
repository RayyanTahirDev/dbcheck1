"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function InviteUsersPage() {
  const [departments, setDepartments] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [subExpanded, setSubExpanded] = useState({});
  const [members, setMembers] = useState({});
  const [teammembers, setTeammembers] = useState({});
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = Cookies.get("token");
      const { data } = await axios.get("/api/departments/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const fetchTeammembers = async (departmentId, subIdx) => {
    const token = Cookies.get("token");
    const { data } = await axios.get(
      `/api/teammembers?departmentId=${departmentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTeammembers((prev) => ({
      ...prev,
      [`${departmentId}-${subIdx}`]: data.filter(
        (tm) => tm.subfunctionIndex === subIdx
      ),
    }));
  };

  const handleExpand = (deptId) =>
    setExpanded((prev) => ({ ...prev, [deptId]: !prev[deptId] }));
  const handleSubExpand = (deptId, subIdx) => {
    setSubExpanded((prev) => ({
      ...prev,
      [`${deptId}-${subIdx}`]: !prev[`${deptId}-${subIdx}`],
    }));
    if (!subExpanded[`${deptId}-${subIdx}`]) fetchTeammembers(deptId, subIdx);
  };

  const handleMemberChange = (deptId, subIdx, field, value) => {
    setMembers((prev) => ({
      ...prev,
      [`${deptId}-${subIdx}`]: {
        ...prev[`${deptId}-${subIdx}`],
        [field]: value,
      },
    }));
  };

  const handleAddMember = async (deptId, subIdx) => {
    const member = members[`${deptId}-${subIdx}`];
    if (!member?.name || !member?.email) return alert("Fill all fields");
    setLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.post(
        "/api/teammembers",
        {
          name: member.name,
          email: member.email,
          departmentId: deptId,
          subfunctionIndex: subIdx,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTeammembers(deptId, subIdx);
      setMembers((prev) => ({ ...prev, [`${deptId}-${subIdx}`]: {} }));
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleInvite = async () => {
    if (selected.length === 0) return alert("Select teammembers to invite.");
    setLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.post(
        "/api/teammembers/invite",
        { teammemberIds: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Invited!");
      setSelected([]);
      Object.keys(teammembers).forEach((key) => {
        const [deptId, subIdx] = key.split("-");
        fetchTeammembers(deptId, Number(subIdx));
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Invite Users and Get Started
      </h1>

      {departments.map((dept) => (
        <div
          key={dept._id}
          className="mb-6 border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
        >
          <div
            className="cursor-pointer font-semibold text-lg flex items-center text-blue-600"
            onClick={() => handleExpand(dept._id)}
          >
            <span className="mr-2 text-xl">
              {expanded[dept._id] ? "▼" : "►"}
            </span>
            {dept.departmentName}
          </div>

          {expanded[dept._id] &&
            dept.subfunctions?.map((sf, idx) => (
              <div
                key={idx}
                className="ml-6 mt-4 border-l-4 border-blue-300 pl-4"
              >
                <div
                  className="cursor-pointer font-medium text-gray-700 flex items-center"
                  onClick={() => handleSubExpand(dept._id, idx)}
                >
                  <span className="mr-2 text-sm">
                    {subExpanded[`${dept._id}-${idx}`] ? "▼" : "►"}
                  </span>
                  {sf.name}
                </div>

                {subExpanded[`${dept._id}-${idx}`] && (
                  <div className="ml-4 mt-4">
                    <div className="flex flex-col sm:flex-row gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={members[`${dept._id}-${idx}`]?.name || ""}
                        onChange={(e) =>
                          handleMemberChange(
                            dept._id,
                            idx,
                            "name",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={members[`${dept._id}-${idx}`]?.email || ""}
                        onChange={(e) =>
                          handleMemberChange(
                            dept._id,
                            idx,
                            "email",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddMember(dept._id, idx)}
                        disabled={loading}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="border rounded-lg mt-6 overflow-x-auto shadow-sm">
                      {(teammembers[`${dept._id}-${idx}`] || []).length > 0 && (
                        <div className="grid grid-cols-12 font-semibold text-sm bg-gray-100 px-4 py-3 border-b">
                          <div className="col-span-1">Select</div>
                          <div className="col-span-2">Name</div>
                          <div className="col-span-2">Role</div>
                          <div className="col-span-2">Reports To</div>
                          <div className="col-span-5">Email</div>
                        </div>
                      )}

                      {(teammembers[`${dept._id}-${idx}`] || []).map((tm) => (
                        <div
                          key={tm._id}
                          className="grid grid-cols-12 items-center text-sm px-4 py-3 border-b hover:bg-gray-50 transition-all"
                        >
                          {/* Select checkbox */}
                          <div className="col-span-1 flex items-center">
                            <input
                              type="checkbox"
                              checked={selected.includes(tm._id)}
                              onChange={() => handleSelect(tm._id)}
                              disabled={tm.invited}
                              className="accent-blue-500 w-4 h-4"
                            />
                          </div>

                          {/* Name */}
                          <div className="col-span-2 font-medium text-gray-800">
                            {tm.name}
                          </div>

                          {/* Role */}
                          <div className="col-span-2 text-gray-600">
                            {tm.role}
                          </div>

                          {/* Reports To */}
                          <div className="col-span-2 text-gray-600">
                            {tm.reportTo}
                          </div>

                          {/* Email + Invited */}
                          <div className="col-span-5 flex flex-wrap justify-between items-center gap-2 text-gray-700">
                            <span className="break-words">{tm.email}</span>
                            {tm.invited && (
                              <span className="text-xs text-blue-500 font-medium whitespace-nowrap">
                                Invited
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}

      <div className="text-center">
        <Button
          className="mt-6 px-6 py-2"
          onClick={handleInvite}
          disabled={loading || selected.length === 0}
        >
          Send Invitation
        </Button>
      </div>
    </div>
  );
}
