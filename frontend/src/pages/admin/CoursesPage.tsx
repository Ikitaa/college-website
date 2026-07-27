import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { api, getErrorMessage } from "../../lib/api";

import AddCourseModal from "./AddCourseModal";
import EditCourseModal from "./EditCourseModal";

interface Course {
  _id: string;

  title: string;
  code: string;
  faculty: string;

  durationYears: number;
  totalSemesters: number;
  totalCredits: number;

  description: string;
  eligibility: string;

  fees: string;
  scholarship: string;
  careerOpportunities: string;

  medium: string;
  intake: string;

  curriculumUrl?: string;

  seats?: number;

  isActive: boolean;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      let url = "/courses";

      if (faculty) {
        url += `?faculty=${faculty}`;
      }

      const res = await api.get(url);

      setCourses(res.data.courses);
      setFilteredCourses(res.data.courses);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [faculty]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const keyword = search.toLowerCase();

    setFilteredCourses(
      courses.filter(
        (course) =>
          course.title.toLowerCase().includes(keyword) ||
          course.code.toLowerCase().includes(keyword) ||
          course.faculty.toLowerCase().includes(keyword)
      )
    );
  }, [search, courses]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await api.delete(`/courses/${id}`);

      toast.success("Course deleted successfully");

      fetchCourses();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const badgeColor = (active: boolean) => {
    return active
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };
    return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Courses
          </h1>

          <p className="text-sm text-ink-500">
            Manage all college courses
          </p>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="flex items-center gap-2 rounded-md bg-maroon-600 px-4 py-2 text-white hover:bg-maroon-700"
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

      {/* Search & Filter */}

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border py-2 pl-10 pr-4"
          />
        </div>

        <select
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          className="rounded-md border px-4 py-2"
        >
          <option value="">All Faculties</option>

          <option value="Humanities & Social Sciences">
            Humanities & Social Sciences
          </option>

          <option value="Management">
            Management
          </option>

          <option value="Institute of Science & Technology">
            Institute of Science & Technology
          </option>
        </select>
      </div>

      {/* Courses Table */}

      <div className="mt-6 overflow-hidden rounded-lg border bg-white">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="px-4 py-3 text-left">Course</th>

              <th className="px-4 py-3 text-left">
                Faculty
              </th>

              <th className="px-4 py-3 text-center">
                Duration
              </th>

              <th className="px-4 py-3 text-center">
                Seats
              </th>

              <th className="px-4 py-3 text-center">
                Status
              </th>

              <th className="px-4 py-3 text-center">
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
                  Loading courses...
                </td>

              </tr>

            ) : filteredCourses.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No courses found.
                </td>

              </tr>

            ) : (

              filteredCourses.map((course) => (

                <tr
                  key={course._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-4 py-3">

                    <p className="font-semibold">
                      {course.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {course.code}
                    </p>

                  </td>

                  <td className="px-4 py-3">
                    {course.faculty}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {course.durationYears} Years
                  </td>

                  <td className="px-4 py-3 text-center">
                    {course.seats ?? "-"}
                  </td>

                  <td className="px-4 py-3 text-center">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor(
                        course.isActive
                      )}`}
                    >
                      {course.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  <td className="px-4 py-3">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setOpenEditModal(true);
                        }}
                        className="rounded bg-yellow-100 p-2 text-yellow-700 hover:bg-yellow-200"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(course._id)
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
            {/* Add Course Modal */}

      <AddCourseModal
        isOpen={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          fetchCourses();
        }}
      />

      {/* Edit Course Modal */}

      {selectedCourse && (
        <EditCourseModal
          isOpen={openEditModal}
          course={selectedCourse}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedCourse(null);
            fetchCourses();
          }}
        />
      )}
    </div>
  );
}