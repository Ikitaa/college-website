import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { api } from "../lib/api";

interface Course {
  _id: string;
  title: string;
  code: string;
  faculty: string;
  description: string;
  durationYears: number;
  studySystem: "semester" | "year";
  semesterCount?: number;
  totalCredits: number;
  eligibility: string;

  admissionFee: number;
  semesterFees: number[];
  yearlyFees: number[];

  examFee: string;
  totalFee: number;

  scholarship: string;
  careerOpportunities: string;

  curriculumUrl?: string;

  medium: string;
  intake: string;

  seats?: number;
}

export default function DashboardCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-cream-50 py-10">
      <div className="mx-auto max-w-6xl px-6">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-maroon-700">
              My Courses
            </h1>

            <p className="mt-2 text-gray-600">
              View all courses available in the college.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-maroon-300 px-4 py-2 text-maroon-700 hover:bg-maroon-50"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            No courses available.
          </div>
        ) : (
          <div className="space-y-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="rounded-2xl bg-white p-8 shadow"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-full bg-maroon-100 p-4">
                    <BookOpen className="text-maroon-700" size={28} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-maroon-700">
                      {course.title}
                    </h2>

                    <p className="text-gray-500">
                      {course.code}
                    </p>
                  </div>
                </div>

                {/* Basic Information */}

                <div className="grid gap-5 md:grid-cols-3">

                  <div>
                    <h4 className="font-semibold">Faculty</h4>
                    <p>{course.faculty}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Duration</h4>
                    <p>{course.durationYears} Years</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Study System</h4>
                    <p>
                      {course.studySystem === "semester"
                        ? `${course.semesterCount} Semesters`
                        : "Year System"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Credits</h4>
                    <p>{course.totalCredits}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Medium</h4>
                    <p>{course.medium}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Intake</h4>
                    <p>{course.intake}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Seats</h4>
                    <p>{course.seats}</p>
                  </div>

                </div>

                {/* Description */}

                <div className="mt-8">
                  <h3 className="mb-2 text-lg font-semibold">
                    Course Description
                  </h3>

                  <p className="leading-7 text-gray-700">
                    {course.description}
                  </p>
                </div>

                {/* Eligibility */}

                <div className="mt-8">
                  <h3 className="mb-2 text-lg font-semibold">
                    Eligibility
                  </h3>

                  <p>{course.eligibility}</p>
                </div>

                {/* Fee Structure */}

                <div className="mt-8">

                  <h3 className="mb-4 text-lg font-semibold">
                    Fee Structure
                  </h3>

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>
                      <p className="font-medium">
                        Admission Fee
                      </p>

                      <p>Rs. {course.admissionFee}</p>
                    </div>

                    <div>
                      <p className="font-medium">
                        Exam Fee
                      </p>

                      <p>{course.examFee}</p>
                    </div>

                    <div>
                      <p className="font-medium">
                        Total Fee
                      </p>

                      <p>Rs. {course.totalFee}</p>
                    </div>

                  </div>

                  {course.studySystem === "semester" &&
                    course.semesterFees?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="mb-3 font-semibold">
                          Semester Fees
                        </h4>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                          {course.semesterFees.map((fee, index) => (
                            <div
                              key={index}
                              className="rounded-lg border bg-maroon-50 p-3 text-center"
                            >
                              <p className="font-semibold">
                                Semester {index + 1}
                              </p>

                              <p>Rs. {fee}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {course.studySystem === "year" &&
                    course.yearlyFees?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="mb-3 font-semibold">
                          Yearly Fees
                        </h4>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                          {course.yearlyFees.map((fee, index) => (
                            <div
                              key={index}
                              className="rounded-lg border bg-maroon-50 p-3 text-center"
                            >
                              <p className="font-semibold">
                                Year {index + 1}
                              </p>

                              <p>Rs. {fee}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                </div>

                {/* Scholarship */}

                <div className="mt-8">
                  <h3 className="mb-2 text-lg font-semibold">
                    Scholarship
                  </h3>

                  <p>{course.scholarship}</p>
                </div>

                {/* Career */}

                <div className="mt-8">
                  <h3 className="mb-2 text-lg font-semibold">
                    Career Opportunities
                  </h3>

                  <p>{course.careerOpportunities}</p>
                </div>

                {/* Curriculum */}

                {course.curriculumUrl && (
                  <div className="mt-8">
                    <a
                      href={course.curriculumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-maroon-600 px-5 py-3 text-white hover:bg-maroon-700"
                    >
                      <ExternalLink size={18} />
                      View Curriculum
                    </a>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}