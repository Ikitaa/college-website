import { useState, useEffect } from "react";
import { Pin, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { api, getErrorMessage } from "../lib/api";
import { Notice, NoticeCategory, PaginationInfo } from "../types";

const categories: { value: NoticeCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "exam", label: "Exam" },
  { value: "admission", label: "Admission" },
  { value: "event", label: "Event" },
  { value: "urgent", label: "Urgent" },
];

const categoryColors: Record<NoticeCategory, string> = {
  general: "bg-cream-200 text-ink-700",
  exam: "bg-maroon-100 text-maroon-700",
  admission: "bg-gold-500/20 text-gold-700",
  event: "bg-sage-500/20 text-sage-600",
  urgent: "bg-red-100 text-red-700",
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [activeCategory, setActiveCategory] = useState<NoticeCategory | "all">("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      setIsLoading(true);
      try {
        const categoryParam = activeCategory !== "all" ? `&category=${activeCategory}` : "";
        const { data } = await api.get(`/notices?page=${page}&limit=8${categoryParam}`);
        setNotices(data.notices);
        setPagination(data.pagination);
      } catch (error) {
        console.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [activeCategory, page]);

  // Category badal-da page 1 ma firta jane (natra "page 3" ma matra 1 notice
  // dekhine jasto confusing state hun sakcha)
  const handleCategoryChange = (cat: NoticeCategory | "all") => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <div>
      {/* ============ PAGE HEADER ============ */}
      <section
  className="relative h-[380px] bg-cover bg-center flex items-center"
  style={{
    backgroundImage: `linear-gradient(rgba(92,16,31,0.65), rgba(92,16,31,0.65)), url('/campus-photo.jpg')`,
    backgroundPosition: "center 35%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  }}
>
  <div className="mx-auto max-w-7xl px-6">
    <span className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
      Stay Informed
    </span>

    <h1 className="mt-2 font-display text-5xl font-bold text-white">
      Notice Board
    </h1>

    <p className="mt-4 max-w-2xl text-lg text-white">
      Official announcements, exam routines, and admission updates from the campus.
    </p>
  </div>
</section>
      {/* ============ FILTER + LIST ============ */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  activeCategory === cat.value
                    ? "bg-maroon-600 text-cream-50"
                    : "bg-white text-ink-700 hover:bg-maroon-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Notice list */}
          {isLoading ? (
            <p className="mt-8 text-ink-500">Loading notices...</p>
          ) : notices.length === 0 ? (
            <p className="mt-8 text-ink-500">No notices found in this category.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="rounded-lg border border-maroon-100 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.isPinned && <Pin size={14} className="text-gold-500" />}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                        categoryColors[notice.category]
                      }`}
                    >
                      {notice.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-ink-500">
                      <Calendar size={12} />
                      {new Date(notice.publishDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink-900">
                    {notice.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{notice.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-md border border-maroon-100 px-3 py-1.5 text-sm font-medium text-ink-700 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="text-sm text-ink-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="flex items-center gap-1 rounded-md border border-maroon-100 px-3 py-1.5 text-sm font-medium text-ink-700 disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}