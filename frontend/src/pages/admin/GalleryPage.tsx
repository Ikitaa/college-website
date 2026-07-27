import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { api, getErrorMessage } from "../../lib/api";

import AddGalleryModal from "./AddGalleryModal";
import EditGalleryModal from "./EditGalleryModal";

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  eventDate?: string;
  featured: boolean;
  isActive: boolean;
  displayOrder: number;
}

const IMAGE_BASE_URL = "http://localhost:5000";

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [openAddModal, setOpenAddModal] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);

  const [selectedItem, setSelectedItem] =
    useState<GalleryItem | null>(null);

  // =============================
  // Fetch Gallery
  // =============================

  const fetchGallery = async () => {
    try {
      setLoading(true);

      let url = "/gallery";

      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const res = await api.get(url);

      const items = res.data.items || [];

      setGallery(items);
      setFilteredGallery(items);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [category]);

  // =============================
  // Search
  // =============================

  useEffect(() => {
    if (!search.trim()) {
      setFilteredGallery(gallery);
      return;
    }

    const keyword = search.toLowerCase();

    setFilteredGallery(
      gallery.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          item.category.toLowerCase().includes(keyword)
      )
    );
  }, [search, gallery]);

  // =============================
  // Delete
  // =============================

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this gallery item?")) {
      return;
    }

    try {
      await api.delete(`/gallery/${id}`);

      toast.success("Gallery deleted successfully.");

      fetchGallery();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // =============================
  // Badge Color
  // =============================

  const badgeColor = (active: boolean) => {
    return active
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  // =============================
  // Image URL Helper
  // =============================

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${IMAGE_BASE_URL}${imageUrl}`;
  };return (
  <div>
    {/* ================= HEADER ================= */}

    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Gallery Management
        </h1>

        <p className="text-sm text-ink-500">
          Manage campus gallery images
        </p>
      </div>

      <button
        onClick={() => setOpenAddModal(true)}
        className="flex items-center gap-2 rounded-md bg-maroon-600 px-4 py-2 text-white transition hover:bg-maroon-700"
      >
        <Plus size={18} />
        Add Gallery
      </button>

    </div>

    {/* ================= SEARCH ================= */}

    <div className="mt-6 flex flex-col gap-4 md:flex-row">

      <div className="relative flex-1">

        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search gallery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-maroon-500 focus:outline-none"
        />

      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-2 focus:border-maroon-500 focus:outline-none"
      >
        <option value="">All Categories</option>
        <option value="Campus">Campus</option>
        <option value="Events">Events</option>
        <option value="Sports">Sports</option>
        <option value="Graduation">Graduation</option>
        <option value="Programs">Programs</option>
        <option value="Facilities">Facilities</option>
        <option value="Others">Others</option>
      </select>

    </div>

    {/* ================= TABLE ================= */}

    <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-5 py-3 text-left text-sm font-semibold">
              Image
            </th>

            <th className="px-5 py-3 text-left text-sm font-semibold">
              Gallery
            </th>

            <th className="px-5 py-3 text-left text-sm font-semibold">
              Category
            </th>

            <th className="px-5 py-3 text-center text-sm font-semibold">
              Event Date
            </th>

            <th className="px-5 py-3 text-center text-sm font-semibold">
              Featured
            </th>

            <th className="px-5 py-3 text-center text-sm font-semibold">
              Status
            </th>

            <th className="px-5 py-3 text-center text-sm font-semibold">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>{loading ? (

  <tr>
    <td
      colSpan={7}
      className="py-12 text-center text-gray-500"
    >
      Loading gallery...
    </td>
  </tr>

) : filteredGallery.length === 0 ? (

  <tr>
    <td
      colSpan={7}
      className="py-12 text-center text-gray-500"
    >
      No gallery items found.
    </td>
  </tr>

) : (

  filteredGallery.map((item) => (

    <tr
      key={item._id}
      className="border-t transition hover:bg-gray-50"
    >

      {/* Image */}

      <td className="px-5 py-4">

        <img
          src={getImageUrl(item.imageUrl)}
          alt={item.title}
          className="h-20 w-28 rounded-lg border object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/300x200?text=No+Image";
          }}
        />

      </td>

      {/* Gallery */}

      <td className="px-5 py-4">

        <h3 className="font-semibold text-ink-900">
          {item.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {item.description || "No description"}
        </p>

      </td>

      {/* Category */}

      <td className="px-5 py-4">

        <span className="rounded-full bg-maroon-100 px-3 py-1 text-xs font-semibold text-maroon-700">
          {item.category}
        </span>

      </td>

      {/* Date */}

      <td className="px-5 py-4 text-center text-sm">

        {item.eventDate
          ? new Date(item.eventDate).toLocaleDateString()
          : "-"}

      </td>

      {/* Featured */}

      <td className="px-5 py-4 text-center">

        {item.featured ? (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            Featured
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            No
          </span>
        )}

      </td>

      {/* Status */}

      <td className="px-5 py-4 text-center">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor(
            item.isActive
          )}`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>

      </td>

      {/* Actions */}

      <td className="px-5 py-4">

        <div className="flex justify-center gap-2">

          <button
            onClick={() => {
              setSelectedItem(item);
              setOpenEditModal(true);
            }}
            className="rounded-lg bg-yellow-100 p-2 text-yellow-700 transition hover:bg-yellow-200"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => handleDelete(item._id)}
            className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </td>

    </tr>

  ))

)}</tbody>
</table>
</div>
      {/* ================= ADD GALLERY MODAL ================= */}

      <AddGalleryModal
        isOpen={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          fetchGallery();
        }}
      />

      {/* ================= EDIT GALLERY MODAL ================= */}

      {selectedItem && (
        <EditGalleryModal
          isOpen={openEditModal}
          item={selectedItem}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedItem(null);
            fetchGallery();
          }}
        />
      )}
    </div>
  );
}