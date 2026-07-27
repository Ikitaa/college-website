import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { api, getErrorMessage } from "../../lib/api";

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
  phone?: string;
  bio?: string;
  isActive: boolean;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
const [loading, setLoading] = useState(true);

const [search, setSearch] = useState("");
const [department, setDepartment] = useState("");

useEffect(() => {
  fetchFaculty();
}, []);

useEffect(() => {
  let data = [...faculty];

  if (search.trim()) {
    const keyword = search.toLowerCase();

    data = data.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(keyword) ||
        (teacher.designation || "")
          .toLowerCase()
          .includes(keyword)
    );
  }

  if (department) {
  data = data.filter(
    (teacher) => teacher.department?.name === department
  );
}
  setFilteredFaculty(data);
}, [search, department, faculty]);

const fetchFaculty = async () => {
  try {
    const res = await api.get("/faculty");
    setFaculty(res.data.faculty);
    setFilteredFaculty(res.data.faculty);
  } catch (err) {
    console.error("Failed to load faculty");
  } finally {
    setLoading(false);
  }
};

return (
  <section className="bg-cream-50 py-12">
    <div className="mx-auto max-w-7xl px-6">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-maroon-700">
          Our Faculty
        </h1>

        <p className="mt-3 text-gray-600">
          Meet our experienced teaching professionals dedicated to academic excellence.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mb-10 grid gap-4 md:grid-cols-2">

        <input
          type="text"
          placeholder="Search faculty by name or designation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-maroon-500 focus:outline-none"
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-maroon-500 focus:outline-none"
        >
          <option value="">All Departments</option>
          <option value="BCA">BCA</option>
          <option value="BBS">BBS</option>
          <option value="BA">BA</option>
          <option value="BSc">BSc</option>
          <option value="MBS">MBS</option>
          <option value="MEd">MEd</option>
        </select>

      </div>

      {/* Faculty Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-600">Loading faculty...</p>
        </div>
      ) : filteredFaculty.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-600">
            No faculty members found.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredFaculty.map((teacher) => (
            <div
              key={teacher._id}
              className="group overflow-hidden rounded-2xl border border-maroon-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Photo */}
              <div className="bg-gradient-to-b from-maroon-50 to-white p-6">
                <div className="flex justify-center">
                  <img
                    src={
                      teacher.avatarUrl
                        ? `http://localhost:5000${teacher.avatarUrl}`
                        : "https://via.placeholder.com/160"
                    }
                    alt={teacher.name}
                    className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-md"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 px-6 pb-6 text-center">

                <div>
                  <h2 className="text-xl font-semibold text-ink-900">
                    {teacher.name}
                  </h2>

                  <p className="text-maroon-600">
                    {teacher.designation || "Faculty Member"}
                  </p>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Department:</span> {teacher.department?.name || "-"}
                  </p>

                  <p>
                    <span className="font-medium">Qualification:</span> {teacher.qualification || "-"}
                  </p>
                </div>

                <Link
                  to={`/faculty/${teacher._id}`}
                  className="inline-block rounded-md bg-maroon-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-maroon-700"
                >
                  View Profile
                </Link>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      {!loading && (
        <div className="mt-10 text-center text-sm text-gray-500">
          Showing <span className="font-semibold">{filteredFaculty.length}</span> faculty members
        </div>
      )}

    </div>
  </section>
);
}