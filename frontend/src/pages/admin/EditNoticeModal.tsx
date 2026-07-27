import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../../lib/api";

interface Notice {
  _id: string;
  title: string;
  content: string;
  category: "general" | "exam" | "admission" | "event" | "urgent";
  attachmentUrl?: string;
  expiryDate?: string;
  isPinned: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notice: Notice;
}

export default function EditNoticeModal({
  isOpen,
  onClose,
  notice,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "general",
    attachmentUrl: "",
    expiryDate: "",
    isPinned: false,
  });

  useEffect(() => {
    if (notice) {
      setForm({
        title: notice.title,
        content: notice.content,
        category: notice.category,
        attachmentUrl: notice.attachmentUrl || "",
        expiryDate: notice.expiryDate
          ? notice.expiryDate.substring(0, 10)
          : "",
        isPinned: notice.isPinned,
      });
    }
  }, [notice]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      toast.error("Title and Content are required");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/notices/${notice._id}`, form);

      toast.success("Notice updated successfully");

      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6">

        <h2 className="mb-5 text-2xl font-semibold">
          Edit Notice
        </h2>

        <div className="space-y-4">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Notice Title"
            className="w-full rounded border px-4 py-2"
          />

          <textarea
            rows={5}
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Notice Content"
            className="w-full rounded border px-4 py-2"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded border px-4 py-2"
          >
            <option value="general">General</option>
            <option value="exam">Exam</option>
            <option value="admission">Admission</option>
            <option value="event">Event</option>
            <option value="urgent">Urgent</option>
          </select>

          <input
            name="attachmentUrl"
            value={form.attachmentUrl}
            onChange={handleChange}
            placeholder="Attachment URL"
            className="w-full rounded border px-4 py-2"
          />

          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            className="w-full rounded border px-4 py-2"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isPinned: e.target.checked,
                }))
              }
            />
            Pin this Notice
          </label>

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded border px-5 py-2"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded bg-maroon-600 px-5 py-2 text-white hover:bg-maroon-700"
          >
            {loading ? "Updating..." : "Update Notice"}
          </button>

        </div>

      </div>
    </div>
  );
}