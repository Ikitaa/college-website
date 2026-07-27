import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

import { api, getErrorMessage } from "../../lib/api";

interface GalleryItem {
  _id: string;

  title: string;
  description?: string;

  imageUrl: string;

  category: string;

  eventDate?: string;

  displayOrder: number;

  featured: boolean;

  isActive: boolean;
}

interface Props {
  isOpen: boolean;
  item: GalleryItem;
  onClose: () => void;
}

export default function EditGalleryModal({
  isOpen,
  item,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

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
    if (!item) return;

    setForm({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      category: item.category,
      eventDate: item.eventDate
        ? item.eventDate.substring(0, 10)
        : "",
      displayOrder: item.displayOrder,
      featured: item.featured,
      isActive: item.isActive,
    });

    setPreview(
      item.imageUrl.startsWith("http")
        ? item.imageUrl
        : `http://localhost:5000${item.imageUrl}`
    );

    setSelectedFile(null);
  }, [item]);

  if (!isOpen) return null;

  // ==========================
  // Handle Input Change
  // ==========================

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

  // ==========================
  // Handle Image Selection
  // ==========================

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };// ==========================
// Handle Submit
// ==========================

const handleSubmit = async (e?: FormEvent) => {
  if (e) e.preventDefault();

  if (!form.title.trim()) {
    toast.error("Gallery title is required.");
    return;
  }

  try {
    setLoading(true);

    // Keep existing image unless a new one is selected
    let imageUrl = form.imageUrl;

    // Upload new image if selected
    if (selectedFile) {
      const uploadData = new FormData();
      uploadData.append("file", selectedFile);

      const uploadRes = await api.post(
        "/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      imageUrl = uploadRes.data.fileUrl;
    }

    // Update gallery item
    await api.put(`/gallery/${item._id}`, {
      title: form.title,
      description: form.description,
      imageUrl,
      category: form.category,
      eventDate: form.eventDate || undefined,
      displayOrder: form.displayOrder,
      featured: form.featured,
      isActive: form.isActive,
    });

    toast.success("Gallery updated successfully.");

    onClose();
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    setLoading(false);
  }
};return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-3xl rounded-lg bg-white shadow-lg">

      {/* Header */}

      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-xl font-semibold">
          Edit Gallery Item
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

          {/* Upload Image */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Replace Image
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
          {loading ? "Updating..." : "Save Changes"}
        </button>

      </div>

    </div>
  </div>
);
}