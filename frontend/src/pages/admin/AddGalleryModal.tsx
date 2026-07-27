import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

import { api, getErrorMessage } from "../../lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddGalleryModal({
  isOpen,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "Campus",
    eventDate: "",
    displayOrder: 0,
    featured: false,
    isActive: true,
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({
        title: "",
        description: "",
        imageUrl: "",
        category: "Campus",
        eventDate: "",
        displayOrder: 0,
        featured: false,
        isActive: true,
      });

      setPreview("");
      setSelectedFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ===========================
  // Handle input changes
  // ===========================

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  // ===========================
  // Handle image selection
  // ===========================

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Save file for upload later
    setSelectedFile(file);

    // Preview image
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };// ===========================
// Handle submit
// ===========================

const handleSubmit = async (e?: FormEvent) => {
  if (e) e.preventDefault();

  if (!form.title.trim()) {
    toast.error("Gallery title is required.");
    return;
  }

  if (!selectedFile) {
    toast.error("Please select an image.");
    return;
  }

  try {
    setLoading(true);

    // 1. Upload image to server
    const formData = new FormData();
    formData.append("file", selectedFile);

    const uploadRes = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Uploaded image path returned by backend
    const imageUrl = uploadRes.data.fileUrl;

    // 2. Save gallery item
    await api.post("/gallery", {
      title: form.title,
      description: form.description,
      imageUrl,
      category: form.category,
      eventDate: form.eventDate || undefined,
      displayOrder: form.displayOrder,
      featured: form.featured,
      isActive: form.isActive,
    });

    toast.success("Gallery item added successfully.");

    // Reset form
    setForm({
      title: "",
      description: "",
      imageUrl: "",
      category: "Campus",
      eventDate: "",
      displayOrder: 0,
      featured: false,
      isActive: true,
    });

    setPreview("");
    setSelectedFile(null);

    onClose();
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    setLoading(false);
  }
};return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">

      {/* Header */}

      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-xl font-semibold">
          Add Gallery
        </h2>

        <button
          onClick={onClose}
          className="text-2xl text-gray-500 hover:text-red-600"
        >
          ×
        </button>
      </div>

      {/* Body */}

      <div className="max-h-[75vh] overflow-y-auto p-6">

        <div className="grid gap-5 md:grid-cols-2">

          {/* Title */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Gallery Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Category */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            >
              <option>Campus</option>
              <option>Events</option>
              <option>Sports</option>
              <option>Graduation</option>
              <option>Programs</option>
              <option>Facilities</option>
              <option>Others</option>
            </select>
          </div>

          {/* Description */}

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Image Upload */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-md border p-2"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 h-56 w-full rounded-lg border object-cover"
              />
            )}

          </div>

          {/* Event Date */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Event Date
            </label>

            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Display Order */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Display Order
            </label>

            <input
              type="number"
              name="displayOrder"
              value={form.displayOrder}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Featured */}

          <div className="flex items-center gap-3">

            <input
              id="featured"
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />

            <label htmlFor="featured">
              Featured
            </label>

          </div>

          {/* Active */}

          <div className="flex items-center gap-3">

            <input
              id="active"
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />

            <label htmlFor="active">
              Active
            </label>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t px-6 py-4">

        <button
          onClick={onClose}
          className="rounded-md border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-md bg-maroon-600 px-5 py-2 text-white hover:bg-maroon-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Gallery"}
        </button>

      </div>

    </div>
  </div>
);
}