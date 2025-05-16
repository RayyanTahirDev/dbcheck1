"use client";

import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DepartmentForm() {
  const { isAuth } = useSelector((state) => state.user);
  const router = useRouter();

  const [form, setForm] = useState({
    departmentName: "",
    hodName: "",
    hodEmail: "",
    role: "",
    departmentDetails: "",
  });
  const [hodPic, setHodPic] = useState(null);
  const [subfunctions, setSubfunctions] = useState([{ name: "", details: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuth) router.push("/login");
  }, [isAuth, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setHodPic(e.target.files[0]);
  };

  const handleSubfunctionChange = (index, field, value) => {
    const updated = [...subfunctions];
    updated[index][field] = value;
    setSubfunctions(updated);
  };

  const addSubfunction = () => {
    setSubfunctions([...subfunctions, { name: "", details: "" }]);
  };

  const removeSubfunction = (index) => {
    setSubfunctions(subfunctions.filter((_, i) => i !== index));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.departmentName || !form.hodName || !form.hodEmail || !form.role) {
      setError("Please fill in all required fields.");
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.hodEmail)) {
      setError("Please enter a valid HOD email address.");
      return;
    }

    // Validate subfunctions: all names required and unique
    const names = subfunctions.map((sf) => sf.name.trim());
    if (names.some((n) => n === "")) {
      setError("All subfunctions must have a name.");
      return;
    }
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      setError("Subfunction names must be unique.");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get("token");
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val);
      });
      if (hodPic) formData.append("hodPic", hodPic);

      formData.append("subfunctions", JSON.stringify(subfunctions));

      const { data } = await axios.post("/api/departments", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.department?._id) {
        router.push(`/chart?departmentId=${data.department._id}`);
      } else {
        setError("Failed to save department.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white py-10">
      <div className="w-full max-w-md border border-gray-200 rounded-lg shadow p-6 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Add Department
        </h1>
        <p className="text-gray-700 mb-6">
          Please fill out the department details below.
        </p>
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form className="space-y-4 text-gray-900" onSubmit={submitHandler}>
          <div>
            <label className="block font-medium">Department Name *</label>
            <input
              name="departmentName"
              type="text"
              value={form.departmentName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">HOD Name *</label>
            <input
              name="hodName"
              type="text"
              value={form.hodName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">HOD Email *</label>
            <input
              name="hodEmail"
              type="email"
              value={form.hodEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">HOD Picture</label>
            <input
              name="hodPic"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Role *</label>
            <input
              name="role"
              type="text"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Department Details</label>
            <textarea
              name="departmentDetails"
              value={form.departmentDetails}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Subfunctions Section */}
          <div>
            <label className="block font-medium mb-2">Subfunctions</label>
            {subfunctions.map((sf, idx) => (
              <div key={idx} className="mb-3 border p-3 rounded relative">
                <input
                  type="text"
                  placeholder="Subfunction Name *"
                  value={sf.name}
                  onChange={(e) =>
                    handleSubfunctionChange(idx, "name", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
                  required
                />
                <textarea
                  placeholder="Subfunction Details"
                  value={sf.details}
                  onChange={(e) =>
                    handleSubfunctionChange(idx, "details", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                />
                {subfunctions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubfunction(idx)}
                    className="absolute top-2 right-2 text-red-600 font-bold"
                    aria-label="Remove subfunction"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSubfunction}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
            >
              + Add Subfunction
            </button>
          </div>

          <Button
            type="submit"
            className="w-full mt-2 font-[550]"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Department"}
          </Button>
        </form>
      </div>
    </div>
  );
}
