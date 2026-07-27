import { useState, useEffect, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { X, Upload } from "lucide-react";

import { api } from "../../lib/api";

interface Department {
  _id: string;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",

    role: "student",

    // Teacher
    avatarUrl: "",
    department: "",
    designation: "",
    qualification: "",
    phone: "",
    bio: "",

    // Student
    faculty: "",
    semester: "",
    rollNumber: "",
  });

  // Load departments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");

      console.log("Departments:", res.data.departments);

      setDepartments(res.data.departments);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load departments");
    }
  };

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm((prev) => ({
        ...prev,
        avatarUrl: res.data.fileUrl,
      }));

      toast.success("Photo uploaded successfully");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to upload photo"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/users", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,

        // Teacher
        avatarUrl: form.avatarUrl,
        department: form.department,
        designation: form.designation,
        qualification: form.qualification,
        phone: form.phone,
        bio: form.bio,

        // Student
        faculty: form.faculty,
        semester: form.semester,
        rollNumber: form.rollNumber,
      });

      toast.success("User created successfully");

      onSuccess();
      onClose();

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",

        role: "student",

        avatarUrl: "",
        department: "",
        designation: "",
        qualification: "",
        phone: "",
        bio: "",

        faculty: "",
        semester: "",
        rollNumber: "",
      });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Unable to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-xl font-semibold">Add User</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2"
        >
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Profile Photo */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Profile Photo
            </label>

            <div className="flex items-center gap-4">
              {form.avatarUrl ? (
                <img
                  src={`http://localhost:5000${form.avatarUrl}`}
                  alt="Profile"
                  className="h-20 w-20 rounded-full border object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border bg-gray-100">
                  <Upload size={26} />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={uploading}
              />
            </div>
          </div>

          {/* Teacher fields */}
          {form.role === "teacher" && (
            <>
              <div>
                <label className="text-sm font-medium">Department</label>

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                >
                  <option value="">Select Department</option>

                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Designation</label>
                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Qualification</label>
                <input
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  value={form.bio}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>
            </>
          )}

          {/* Student fields */}
          {form.role === "student" && (
            <>
              <div>
                <label className="text-sm font-medium">Faculty</label>
                <input
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Semester</label>
                <input
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Roll Number</label>
                <input
                  name="rollNumber"
                  value={form.rollNumber}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="col-span-full flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-5 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || uploading}
              className="rounded bg-maroon-600 px-5 py-2 text-white hover:bg-maroon-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : uploading
                ? "Uploading..."
                : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}