import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";
import { api } from "../lib/api";

interface Notice {
  _id: string;
  title: string;
  content?: string;
  category?: string;
  publishDate?: string;
}

export default function DashboardNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/notices");
      setNotices(res.data.notices || []);
    } catch (err) {
      console.error("Failed to load notices", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-cream-50 py-10">
      <div className="mx-auto max-w-5xl px-6">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-maroon-700">
              Notices
            </h1>

            <p className="mt-1 text-gray-600">
              Latest notices published from the admin panel.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-md border border-maroon-200 px-4 py-2 text-sm font-medium text-maroon-700 hover:bg-maroon-50"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            Loading notices...
          </div>
        ) : notices.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            No notices available.
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="rounded-2xl border border-maroon-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-50 text-maroon-700">
                    <Bell size={24} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-xl font-semibold text-ink-900">
                        {notice.title}
                      </h2>

                      <span className="rounded-full bg-maroon-50 px-3 py-1 text-xs font-medium text-maroon-700 capitalize">
                        {notice.category || "general"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {notice.publishDate
                        ? new Date(notice.publishDate).toLocaleDateString()
                        : "Recently published"}
                    </p>

                    <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-700">
                      {notice.content || "No description available."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}