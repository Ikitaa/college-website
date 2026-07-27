import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function CourseDetailPage() {
  const { id } = useParams();

  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) return <p className="text-center py-20">Loading...</p>;

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">

      <Link
        to="/courses"
        className="text-maroon-600 hover:underline"
      >
        ← Back to Courses
      </Link>

      <h1 className="mt-6 text-4xl font-bold text-maroon-700">
        {course.title}
      </h1>

      <div className="mt-6 rounded-xl bg-white p-8 shadow">

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-gray-500">Duration</p>
            <p>{course.duration}</p>
          </div>

          <div>
            <p className="text-gray-500">Seats</p>
            <p>{course.seats}</p>
          </div>

          <div>
            <p className="text-gray-500">Faculty</p>
            <p>{course.faculty}</p>
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-semibold">
          Course Description
        </h2>

        <p className="leading-8 text-gray-700">
          {course.description}
        </p>

        {course.eligibility && (
          <>
            <h2 className="mt-8 mb-2 text-2xl font-semibold">
              Eligibility
            </h2>

            <p className="leading-8 text-gray-700">
              {course.eligibility}
            </p>
          </>
        )}
      </div>
    </section>
  );
}