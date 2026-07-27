import { useEffect, useState, ChangeEvent } from "react";
import { X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;

  avatarUrl?: string;

  department?: string;
  designation?: string;
  qualification?: string;
  phone?: string;
  bio?: string;

  faculty?: string;
  semester?: string;
  rollNumber?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: Props) {

  const [form, setForm] = useState({
  name: "",

  role: "",

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

const [uploading, setUploading] = useState(false);
const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!user) return;

  setForm({
    name: user.name,

    role: user.role,

    avatarUrl: user.avatarUrl || "",

    department: user.department || "",
    designation: user.designation || "",
    qualification: user.qualification || "",
    phone: user.phone || "",
    bio: user.bio || "",

    faculty: user.faculty || "",
    semester: user.semester || "",
    rollNumber: user.rollNumber || "",
  });
}, [user]);

  if (!isOpen || !user) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) return;

  try {
    setLoading(true);

    await api.put(`/users/${user._id}`, {
      name: form.name,
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

    toast.success("User updated successfully");

    onSuccess();
    onClose();
  } catch (err: any) {
    toast.error(
      err.response?.data?.message || "Unable to update user"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            Edit User
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2"
        >

          <div>
            <label>Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label>Role</label>

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

    <label className="cursor-pointer rounded-md bg-maroon-600 px-4 py-2 text-white hover:bg-maroon-700">

      {uploading ? "Uploading..." : "Choose Photo"}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
        disabled={uploading}
      />

    </label>

  </div>
</div>
{form.role === "teacher" && (
  <>
    <div>
      <label>Department</label>

      <input
        required
        name="department"
        value={form.department}
        onChange={handleChange}
        className="mt-1 w-full rounded border px-3 py-2"
      />
    </div>

    <div>
      <label>Designation</label>

      <input
        required
        name="designation"
        value={form.designation}
        onChange={handleChange}
        className="mt-1 w-full rounded border px-3 py-2"
      />
    </div>

    <div>
      <label>Qualification</label>

      <input
        required
        name="qualification"
        value={form.qualification}
        onChange={handleChange}
        className="mt-1 w-full rounded border px-3 py-2"
      />
    </div>

    <div>
      <label>Phone</label>

      <input
        required
        name="phone"
        value={form.phone}
        onChange={handleChange}
        className="mt-1 w-full rounded border px-3 py-2"
      />
    </div>

    <div className="md:col-span-2">
      <label>Bio</label>

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
{form.role === "student" && (
  <>
    <div>
      <label>Faculty</label>

      <input
        required
        name="faculty"
        value={form.faculty}
        onChange={handleChange}
        className="mt-1 w-full rounded border px-3 py-2"
      />
    </div>

    <div>
      <label>Semester</label>

      <input
        required
        name="semester"
        value={form.semester}
        onChange={handleChange}
        className="mt-1 w-full rounded border px-3 py-2"
      />
    </div>

    <div>
      <label>Roll Number</label>

      <input
        required
        name="rollNumber"
        value={form.rollNumber}
        onChange={handleChange}
        className="mt-1 w-full rounded border px-3 py-2"
      />
    </div>
  </>
)}
          <div className="col-span-full flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded border px-5 py-2"
            >
              Cancel
            </button>

            <button
  type="submit"
  disabled={loading || uploading}
  className="rounded bg-maroon-600 px-5 py-2 text-white hover:bg-maroon-700 disabled:opacity-50"
>
  {loading
    ? "Updating..."
    : uploading
    ? "Uploading..."
    : "Update User"}
</button>

          </div>

        </form>

      </div>
    </div>
  );
}