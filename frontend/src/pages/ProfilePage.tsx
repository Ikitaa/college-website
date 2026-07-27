import { useState, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    qualification: user?.qualification || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
  });

  if (!user) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>
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
    } catch (err) {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/users/${user._id}`, form);

      toast.success("Profile updated successfully");

      await refreshUser();
    } catch (err: any) {
  console.error(err.response?.data || err);
  toast.error(
    err.response?.data?.message || "Failed to upload photo"
  );
}
  };

  return (
    <section className="bg-cream-50 py-10">
      <div className="mx-auto max-w-3xl px-6">

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-maroon-700">
            My Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your personal information.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          {/* Avatar */}
          <div className="mb-8 flex flex-col items-center gap-4">

            {form.avatarUrl ? (
              <img
                src={`http://localhost:5000${form.avatarUrl}`}
                alt="Profile"
                className="h-28 w-28 rounded-full border-4 border-maroon-100 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-maroon-100 bg-gray-100">
                <Upload size={32} className="text-gray-500" />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />

            {uploading && (
              <p className="text-sm text-gray-500">
                Uploading photo...
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-4 py-2 focus:border-maroon-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                value={user.email}
                disabled
                className="mt-1 w-full rounded-lg border bg-gray-100 px-4 py-2 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border px-4 py-2 focus:border-maroon-500 focus:outline-none"
              />
            </div>

            {user.role === "teacher" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Qualification
                  </label>

                  <input
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border px-4 py-2 focus:border-maroon-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    rows={4}
                    value={form.bio}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border px-4 py-2 focus:border-maroon-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full rounded-lg bg-maroon-600 px-5 py-3 font-medium text-white transition hover:bg-maroon-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}