import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  BookOpen,
  Bell,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

interface Notice {
  _id: string;
  title: string;
  publishedAt?: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
const navigate = useNavigate();

const [notices, setNotices] = useState<Notice[]>([]);
const [loadingNotices, setLoadingNotices] = useState(true);

  useEffect(() => {
    fetchRecentNotices();
  }, []);

  const fetchRecentNotices = async () => {
    try {
      const res = await api.get("/notices?limit=5");

      setNotices(res.data.notices || []);
    } catch (err) {
      console.error("Failed to load notices", err);
    } finally {
      setLoadingNotices(false);
    }
  };
const handleLogout = async () => {
  try {
    await logout();
    navigate("/login", { replace: true });
  } catch (err) {
    console.error(err);
  }
};
  if (!user) return null;

  return (
    <section className="bg-cream-50 py-10">
      <div className="mx-auto max-w-6xl px-6">

        {/* Welcome */}
        {/* Welcome */}
<div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
  <div>
    <h1 className="font-display text-3xl font-bold text-maroon-700">
      Welcome, {user.name}
    </h1>

    <p className="mt-2 text-gray-600">
      You are logged in as{" "}
      <span className="font-semibold capitalize">
        {user.role}
      </span>.
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
  >
    <LogOut size={18} />
    Logout
  </button>
</div>

        {/* Quick cards */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Profile */}
          <Link
            to="/profile"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-maroon-50 text-maroon-700">
              <User size={24} />
            </div>

            <h3 className="font-semibold text-ink-900">
              Profile
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              View and update your personal information.
            </p>
          </Link>

          {/* Courses */}
          <Link
            to="/dashboard/courses"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-maroon-50 text-maroon-700">
              <BookOpen size={24} />
            </div>

            <h3 className="font-semibold text-ink-900">
              Courses
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              View course details added from the admin panel.
            </p>
          </Link>

          {/* Notices */}
          <Link
            to="/dashboard/notices"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-maroon-50 text-maroon-700">
              <Bell size={24} />
            </div>

            <h3 className="font-semibold text-ink-900">
              Notices
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              View notices published from the admin panel.
            </p>
          </Link>

        </div>

        {/* Student Information */}
        {user.role === "student" && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <GraduationCap className="text-maroon-700" />

              <h2 className="text-xl font-semibold text-ink-900">
                Student Information
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Faculty</p>
                <p className="font-medium">
                  {user.faculty || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Semester</p>
                <p className="font-medium">
                  {user.semester || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Roll Number
                </p>
                <p className="font-medium">
                  {user.rollNumber || "-"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Teacher Information */}
        {user.role === "teacher" && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-ink-900">
              Teacher Information
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">
                  {typeof user.department === "string"
                    ? user.department
                    : user.department?.name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium">
                  {user.designation || "-"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Notices */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink-900">
              Recent Notices
            </h2>

            <Link
              to="/dashboard/notices"
              className="text-sm font-medium text-maroon-600 hover:text-maroon-700"
            >
              View all
            </Link>
          </div>

          {loadingNotices ? (
            <p className="text-sm text-gray-500">
              Loading notices...
            </p>
          ) : notices.length === 0 ? (
            <p className="text-sm text-gray-500">
              No notices available.
            </p>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="flex items-center justify-between rounded-lg border border-maroon-100 px-4 py-3 hover:bg-maroon-50/50"
                >
                  <div>
                    <p className="font-medium text-ink-900">
                      {notice.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      {notice.publishedAt
                        ? new Date(
                            notice.publishedAt
                          ).toLocaleDateString()
                        : "Recently published"}
                    </p>
                  </div>

                  <Bell
                    className="pointer-events-none text-maroon-500"
                    size={18}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}