import { useState, useEffect } from "react";
import { Bell, BookOpen, Users, Mail, ClipboardList, Image } from "lucide-react";
import { api } from "../../lib/api";

interface Stats {
  notices: number;
  courses: number;
  users: number;
  messages: number;
  admissions: number;
  gallery: number;
}

const statCards = [
  { key: "notices", label: "Notices", icon: Bell, color: "bg-maroon-50 text-maroon-600" },
  { key: "courses", label: "Courses", icon: BookOpen, color: "bg-gold-500/10 text-gold-600" },
  { key: "users", label: "Users", icon: Users, color: "bg-sage-500/10 text-sage-600" },
  { key: "messages", label: "Messages", icon: Mail, color: "bg-maroon-50 text-maroon-600" },
  { key: "admissions", label: "Admissions", icon: ClipboardList, color: "bg-gold-500/10 text-gold-600" },
  { key: "gallery", label: "Gallery Items", icon: Image, color: "bg-sage-500/10 text-sage-600" },
];

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    notices: 0, courses: 0, users: 0,
    messages: 0, admissions: 0, gallery: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [noticesRes, coursesRes, usersRes, messagesRes, admissionsRes, galleryRes] =
          await Promise.all([
            api.get("/notices?limit=1"),
            api.get("/courses"),
            api.get("/users"),
            api.get("/contact"),
            api.get("/admissions"),
            api.get("/gallery?limit=1"),
          ]);

        setStats({
          notices: noticesRes.data.pagination?.total || 0,
          courses: coursesRes.data.count || 0,
          users: usersRes.data.count || 0,
          messages: messagesRes.data.count || 0,
          admissions: admissionsRes.data.pagination?.total || 0,
          gallery: galleryRes.data.pagination?.total || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-ink-500">Welcome to the PKMC Admin Panel.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.key} className="rounded-lg border border-maroon-100 bg-white p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${card.color}`}>
              <card.icon size={20} />
            </div>
            <p className="mt-3 text-2xl font-semibold text-ink-900">
              {isLoading ? "—" : stats[card.key as keyof Stats]}
            </p>
            <p className="text-sm text-ink-500">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}