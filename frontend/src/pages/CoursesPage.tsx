import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Users, GraduationCap } from "lucide-react";
import { api, getErrorMessage } from "../lib/api";
import type { Course } from "../types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFaculty, setActiveFaculty] = useState<string>("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/courses?active=true");
        setCourses(data.courses);
      } catch (error) {
        console.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const faculties = useMemo(() => {
    const unique = Array.from(new Set(courses.map((c) => c.faculty)));
    return unique.sort();
  }, [courses]);

  const filteredCourses =
    activeFaculty === "all"
      ? courses
      : courses.filter((c) => c.faculty === activeFaculty);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-maroon-700 text-cream-50">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/college-photo4.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-maroon-900/70" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <span className="inline-block rounded-full bg-gold-500/20 px-4 py-1.5 text-sm font-semibold text-gold-400">
            Academics
          </span>

          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
            Programs we offer
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-maroon-100">
            Explore our range of undergraduate programs designed to prepare you
            for a successful career.
          </p>
        </div>
      </section>

      {/* COURSES */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          {faculties.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFaculty("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  activeFaculty === "all"
                    ? "bg-maroon-600 text-white"
                    : "bg-white text-ink-700 hover:bg-maroon-50"
                }`}
              >
                All Programs
              </button>

              {faculties.map((faculty) => (
                <button
                  key={faculty}
                  onClick={() => setActiveFaculty(faculty)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    activeFaculty === faculty
                      ? "bg-maroon-600 text-white"
                      : "bg-white text-ink-700 hover:bg-maroon-50"
                  }`}
                >
                  {faculty}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <p>Loading courses...</p>
          ) : filteredCourses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="flex flex-col rounded-lg border border-maroon-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="font-mono text-xs font-semibold text-gold-600">
                    {course.code}
                  </span>

                  <h3 className="mt-2 font-display text-xl font-semibold text-maroon-700">
                    {course.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <GraduationCap size={15} />
                      {course.faculty}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock size={15} />
                      {course.durationYears}{" "}
                      {course.durationYears === 1 ? "year" : "years"}
                    </span>

                    {course.seats && (
                      <span className="flex items-center gap-1">
                        <Users size={15} />
                        {course.seats} Seats
                      </span>
                    )}
                  </div>

                  {course.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-600">
                      {course.description}
                    </p>
                  )}

                  {course.eligibility && (
                    <p className="mt-4 text-sm text-gray-500">
                      <strong>Eligibility:</strong>{" "}
                      {course.eligibility.length > 100
                        ? course.eligibility.substring(0, 100) + "..."
                        : course.eligibility}
                    </p>
                  )}

                  {course.coordinator && (
                    <p className="mt-4 text-sm text-gray-500">
                      <strong>Coordinator:</strong>{" "}
                      {course.coordinator.name}
                      {course.coordinator.designation
                        ? `, ${course.coordinator.designation}`
                        : ""}
                    </p>
                  )}

                  <div className="mt-auto flex items-center gap-2 pt-6 font-semibold text-maroon-600">
                    View Details
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}