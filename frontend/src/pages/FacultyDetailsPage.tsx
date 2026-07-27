import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  department?: string;
  designation?: string;
  qualification?: string;
  phone?: string;
  bio?: string;
}

export default function FacultyDetailsPage() {
  const { id } = useParams();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const res = await api.get(`/faculty/${id}`);
      setTeacher(res.data.teacher);
    } catch (err) {
      console.error("Unable to load faculty");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading faculty profile...
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="py-20 text-center">
        Faculty member not found.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <Link
        to="/faculty"
        className="text-maroon-600 hover:underline"
      >
        ← Back to Faculty
      </Link>

      <div className="mt-8 rounded-xl border bg-white p-8 shadow">
        <div className="grid gap-10 md:grid-cols-3">

          <div className="flex justify-center">
            <img
              src={
                teacher.avatarUrl
                  ? `http://localhost:5000${teacher.avatarUrl}`
                  : "https://via.placeholder.com/250"
              }
              alt={teacher.name}
              className="h-60 w-60 rounded-xl object-cover"
            />
          </div>

          <div className="md:col-span-2">

            <h1 className="text-3xl font-bold text-maroon-700">
              {teacher.name}
            </h1>

            <p className="mt-2 text-lg text-gray-700">
              {teacher.designation}
            </p>

            <div className="mt-6 space-y-3">

              <p>
                <strong>Department:</strong>{" "}
                {teacher.department || "-"}
              </p>

              <p>
                <strong>Qualification:</strong>{" "}
                {teacher.qualification || "-"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {teacher.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {teacher.phone || "-"}
              </p>

            </div>

            <div className="mt-8">
              <h2 className="mb-2 text-xl font-semibold">
                Biography
              </h2>

              <p className="leading-7 text-gray-700">
                {teacher.bio || "No biography available."}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}