import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

interface Faculty {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;

  department?: {
    _id: string;
    name: string;
  };

  designation?: string;
  qualification?: string;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await api.get("/faculty");
      setFaculty(res.data.faculty || []);
    } catch (err) {
      console.error("Failed to load faculty", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(92,16,31,0.75), rgba(92,16,31,0.75)), url('/campus-photo.jpg')",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="font-display text-5xl font-bold text-white">
            Our Faculty
          </h1>

          <p className="mt-4 text-lg text-white">
            Meet our experienced teaching professionals dedicated to academic excellence.
          </p>
        </div>
      </section>

      {/* Faculty Cards */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {loading ? (
          <p className="text-center text-lg">Loading faculty...</p>
        ) : faculty.length === 0 ? (
          <p className="text-center text-lg">No faculty members found.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {faculty.map((teacher) => (
              <div
                key={teacher._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex justify-center bg-gray-100 p-8">
                  <img
                    src={
                      teacher.avatarUrl
                        ? `http://localhost:5000${teacher.avatarUrl}`
                        : "/logo.png"
                    }
                    alt={teacher.name}
                    className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>

                <div className="space-y-2 p-6 text-center">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {teacher.name}
                  </h2>

                  <p className="font-medium text-maroon-700">
                    {teacher.designation || "-"}
                  </p>

                  <p className="text-gray-600">
                    {teacher.department?.name || "-"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {teacher.qualification || "-"}
                  </p>

                  <Link
                    to={`/faculty/${teacher._id}`}
                    className="mt-5 inline-block rounded-lg bg-maroon-600 px-6 py-2 font-medium text-white transition hover:bg-maroon-700"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}