import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Eye,
  MailOpen,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { api, getErrorMessage } from "../../lib/api";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "Unread" | "Read" | "Replied";
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);

  const [viewOpen, setViewOpen] = useState(false);

  // ================= FETCH =================

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const res = await api.get("/contact");

      setMessages(res.data.messages);
      setFilteredMessages(res.data.messages);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ================= SEARCH + FILTER =================

  useEffect(() => {
    let data = [...messages];

    if (statusFilter) {
      data = data.filter(
        (msg) => msg.status === statusFilter
      );
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (msg) =>
          msg.name.toLowerCase().includes(keyword) ||
          msg.email.toLowerCase().includes(keyword) ||
          msg.subject.toLowerCase().includes(keyword)
      );
    }

    setFilteredMessages(data);
  }, [messages, search, statusFilter]);

  // ================= STATISTICS =================

  const stats = useMemo(() => {
    return {
      total: messages.length,
      unread: messages.filter(
        (m) => m.status === "Unread"
      ).length,
      read: messages.filter(
        (m) => m.status === "Read"
      ).length,
      replied: messages.filter(
        (m) => m.status === "Replied"
      ).length,
    };
  }, [messages]);

  // ================= DELETE =================

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await api.delete(`/contact/${id}`);

      toast.success("Message deleted successfully.");

      fetchMessages();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ================= UPDATE STATUS =================

  const updateStatus = async (
    id: string,
    status: "Unread" | "Read" | "Replied"
  ) => {
    try {
      await api.patch(`/contact/${id}/status`, {
        status,
      });

      toast.success("Status updated.");

      fetchMessages();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Messages
          </h1>

          <p className="text-sm text-ink-500">
            Manage contact messages from visitors
          </p>
        </div>
      </div>

      {/* ================= STATISTICS ================= */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Messages
          </p>

          <h2 className="mt-2 text-3xl font-bold text-maroon-700">
            {stats.total}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Unread
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {stats.unread}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Read
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {stats.read}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Replied
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {stats.replied}
          </h2>
        </div>

      </div>

      {/* ================= SEARCH + FILTER ================= */}

      <div className="mt-6 flex flex-wrap gap-4">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-md border py-2 pl-10 pr-4"
          />

        </div>

        {/* Status */}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
          <option value="Replied">Replied</option>
        </select>

      </div>      {/* ================= MESSAGES TABLE ================= */}

      <div className="mt-6 overflow-hidden rounded-lg border bg-white">

        <table className="min-w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Date</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  Loading messages...
                </td>
              </tr>

            ) : filteredMessages.length === 0 ? (

              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No messages found.
                </td>
              </tr>

            ) : (

              filteredMessages.map((msg) => (

                <tr
                  key={msg._id}
                  className="border-t hover:bg-gray-50"
                >

                  {/* Name */}

                  <td className="px-4 py-3">

                    <p className="font-semibold">
                      {msg.name}
                    </p>

                  </td>

                  {/* Subject */}

                  <td className="px-4 py-3">

                    <p className="font-medium">
                      {msg.subject}
                    </p>

                  </td>

                  {/* Email */}

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {msg.email}
                  </td>

                  {/* Date */}

                  <td className="px-4 py-3 text-center text-sm">
                    {new Date(
                      msg.createdAt
                    ).toLocaleDateString()}
                  </td>

                  {/* Status */}

                  <td className="px-4 py-3 text-center">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold
                      ${
                        msg.status === "Unread"
                          ? "bg-red-100 text-red-700"
                          : msg.status === "Read"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {msg.status}
                    </span>

                  </td>

                  {/* Actions */}

                  <td className="px-4 py-3">

                    <div className="flex justify-center gap-2">

                      {/* View */}

                      <button
                        onClick={() => {
                          setSelectedMessage(msg);
                          setViewOpen(true);
                        }}
                        className="rounded bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Mark Read */}

                      <button
                        onClick={() =>
                          updateStatus(msg._id, "Read")
                        }
                        className="rounded bg-yellow-100 p-2 text-yellow-700 hover:bg-yellow-200"
                      >
                        <MailOpen size={18} />
                      </button>

                      {/* Mark Replied */}

                      <button
                        onClick={() =>
                          updateStatus(msg._id, "Replied")
                        }
                        className="rounded bg-green-100 p-2 text-green-700 hover:bg-green-200"
                      >
                        <CheckCircle size={18} />
                      </button>

                      {/* Delete */}

                      <button
                        onClick={() =>
                          handleDelete(msg._id)
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

      </div>      {/* ================= VIEW MESSAGE MODAL ================= */}

      {viewOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b px-6 py-4">

              <h2 className="text-xl font-semibold text-ink-900">
                Message Details
              </h2>

              <button
                onClick={() => {
                  setViewOpen(false);
                  setSelectedMessage(null);
                }}
                className="text-2xl text-gray-500 hover:text-red-600"
              >
                ×
              </button>

            </div>

            {/* Body */}

            <div className="space-y-6 p-6">

              <div>

                <p className="text-sm font-semibold text-gray-500">
                  Name
                </p>

                <p className="mt-1 text-gray-800">
                  {selectedMessage.name}
                </p>

              </div>

              <div>

                <p className="text-sm font-semibold text-gray-500">
                  Email
                </p>

                <p className="mt-1 text-gray-800">
                  {selectedMessage.email}
                </p>

              </div>

              <div>

                <p className="text-sm font-semibold text-gray-500">
                  Subject
                </p>

                <p className="mt-1 text-gray-800">
                  {selectedMessage.subject}
                </p>

              </div>

              <div>

                <p className="text-sm font-semibold text-gray-500">
                  Message
                </p>

                <div className="mt-2 rounded-lg border bg-gray-50 p-4 whitespace-pre-wrap text-gray-700">
                  {selectedMessage.message}
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <p className="text-sm font-semibold text-gray-500">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedMessage.status === "Unread"
                        ? "bg-red-100 text-red-700"
                        : selectedMessage.status === "Read"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {selectedMessage.status}
                  </span>

                </div>

                <div>

                  <p className="text-sm font-semibold text-gray-500">
                    Received
                  </p>

                  <p className="mt-1 text-gray-800">
                    {new Date(
                      selectedMessage.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t px-6 py-4">

              <button
                onClick={() => {
                  setViewOpen(false);
                  setSelectedMessage(null);
                }}
                className="rounded-md border px-5 py-2 hover:bg-gray-50"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}