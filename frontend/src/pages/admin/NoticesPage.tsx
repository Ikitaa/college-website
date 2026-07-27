import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../../lib/api";
import AddNoticeModal from "./AddNoticeModal";
import EditNoticeModal from "./EditNoticeModal";

interface Notice {
  _id: string;
  title: string;
  content: string;
  category: "general" | "exam" | "admission" | "event" | "urgent";
  attachmentUrl?: string;
  isPinned: boolean;
  publishDate: string;
  expiryDate?: string;
  publishedBy?: {
    _id: string;
    name: string;
    role: string;
  };
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [selectedNotice, setSelectedNotice] =
    useState<Notice | null>(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);

      let url = `/notices?page=${page}&limit=10`;

      if (category) {
        url += `&category=${category}`;
      }

      const res = await api.get(url);

      let data: Notice[] = res.data.notices;

      if (search.trim()) {
        data = data.filter(
          (notice) =>
            notice.title
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            notice.content
              .toLowerCase()
              .includes(search.toLowerCase())
        );
      }

      setNotices(data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [page, category]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this notice?")) return;

    try {
      await api.delete(`/notices/${id}`);

      toast.success("Notice deleted successfully");

      fetchNotices();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case "exam":
        return "bg-blue-100 text-blue-700";

      case "admission":
        return "bg-green-100 text-green-700";

      case "event":
        return "bg-purple-100 text-purple-700";

      case "urgent":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>

      <div className="flex items-center justify-between">

        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Notices
          </h1>

          <p className="text-sm text-ink-500">
            Manage college notices
          </p>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="flex items-center gap-2 rounded-md bg-maroon-600 px-4 py-2 text-white hover:bg-maroon-700"
        >
          <Plus size={18} />
          Add Notice
        </button>

      </div>

      <div className="mt-6 flex flex-wrap gap-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border pl-10 pr-4 py-2"
          />

        </div>

        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className="rounded-md border px-3 py-2"
        >
          <option value="">All Categories</option>
          <option value="general">General</option>
          <option value="exam">Exam</option>
          <option value="admission">Admission</option>
          <option value="event">Event</option>
          <option value="urgent">Urgent</option>
        </select>

      </div>
            <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Title
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Category
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Published By
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Date
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Pinned
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>

            ) : notices.length === 0 ? (

              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No notices found.
                </td>
              </tr>

            ) : (

              notices.map((notice) => (

                <tr
                  key={notice._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3">

                    <p className="font-medium">
                      {notice.title}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {notice.content}
                    </p>

                  </td>

                  <td className="px-4 py-3">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getBadgeColor(
                        notice.category
                      )}`}
                    >
                      {notice.category}
                    </span>

                  </td>

                  <td className="px-4 py-3">
                    {notice.publishedBy?.name || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      notice.publishDate
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {notice.isPinned ? "📌" : "-"}
                  </td>

                  <td className="px-4 py-3">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => {
                          setSelectedNotice(notice);
                          setOpenEditModal(true);
                        }}
                        className="rounded bg-yellow-100 p-2 text-yellow-700 hover:bg-yellow-200"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(notice._id)
                        }
                        className="rounded bg-red-100 p-2 text-red-700 hover:bg-red-200"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>
                </tr>

              ))

            )}

          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="mt-6 flex items-center justify-between">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>

        <p>
          Page {page} of {totalPages}
        </p>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>

      </div>

      {/* Add Modal */}

      <AddNoticeModal
        isOpen={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          fetchNotices();
        }}
      />

      {/* Edit Modal */}

      {selectedNotice && (
        <EditNoticeModal
          isOpen={openEditModal}
          notice={selectedNotice}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedNotice(null);
            fetchNotices();
          }}
        />
      )}

    </div>
  );
}