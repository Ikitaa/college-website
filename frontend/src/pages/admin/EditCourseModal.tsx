import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../../lib/api";

interface Course {
  _id: string;

  title: string;
  code: string;
  faculty: string;

  description: string;

  durationYears: number;
  totalSemesters: number;
  totalCredits: number;

  eligibility: string;

  admissionFee: number;
  semesterFee: number;
  yearlyFee: number;
  totalFee: number;
  examFee: string;

  scholarship: string;
  careerOpportunities: string;

  curriculumUrl: string;

  medium: string;
  intake: string;

  seats: number;

  coordinator: string;

  isActive: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

export default function EditCourseModal({
  isOpen,
  onClose,
  course,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    code: "",
    faculty: "",

    description: "",

    durationYears: 4,
    totalSemesters: 8,
    totalCredits: 120,

    eligibility: "",

    admissionFee: 0,
    semesterFee: 0,
    yearlyFee: 0,
    totalFee: 0,
    examFee: "",

    scholarship: "",

    careerOpportunities: "",

    curriculumUrl: "",

    medium: "English",
    intake: "Yearly",

    seats: 0,

    coordinator: "",

    isActive: true,
  });

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title,
        code: course.code,
        faculty: course.faculty,

        description: course.description,

        durationYears: course.durationYears,
        totalSemesters: course.totalSemesters,
        totalCredits: course.totalCredits,

        eligibility: course.eligibility,

        admissionFee: course.admissionFee,
        semesterFee: course.semesterFee,
        yearlyFee: course.yearlyFee,
        totalFee: course.totalFee,
        examFee: course.examFee,

        scholarship: course.scholarship,

        careerOpportunities: course.careerOpportunities,

        curriculumUrl: course.curriculumUrl,

        medium: course.medium,
        intake: course.intake,

        seats: course.seats,

        coordinator: course.coordinator,

        isActive: course.isActive,
      });
    }
  }, [course]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    const numberFields = [
      "durationYears",
      "totalSemesters",
      "totalCredits",
      "admissionFee",
      "semesterFee",
      "yearlyFee",
      "totalFee",
      "seats",
    ];

    setForm((prev) => ({
      ...prev,
      [name]: numberFields.includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await api.put(`/courses/${course._id}`, form);

      toast.success("Course updated successfully");

      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-5xl rounded-xl bg-white p-8 shadow-xl">

          <h2 className="mb-8 text-3xl font-bold text-maroon-700">
            Edit Course
          </h2><div className="space-y-8">

  {/* ================= BASIC INFORMATION ================= */}

  <div className="rounded-lg border p-5">

    <h3 className="mb-4 text-xl font-semibold text-maroon-700">
      Basic Information
    </h3>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

      <input
        name="title"
        placeholder="Course Title"
        value={form.title}
        onChange={handleChange}
        className="rounded border px-4 py-2"
      />

      <input
        name="code"
        placeholder="Course Code"
        value={form.code}
        onChange={handleChange}
        className="rounded border px-4 py-2"
      />

      <select
        name="faculty"
        value={form.faculty}
        onChange={handleChange}
        className="rounded border px-4 py-2"
      >
        <option value="">Select Faculty</option>

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

      <input
        name="medium"
        placeholder="Medium"
        value={form.medium}
        onChange={handleChange}
        className="rounded border px-4 py-2"
      />

    </div>

    <textarea
      rows={4}
      name="description"
      placeholder="Course Description"
      value={form.description}
      onChange={handleChange}
      className="mt-4 w-full rounded border px-4 py-2"
    />

  </div>

  {/* ================= ACADEMIC DETAILS ================= */}

  <div className="rounded-lg border p-5">

    <h3 className="mb-4 text-xl font-semibold text-maroon-700">
      Academic Details
    </h3>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

      <input
        type="number"
        name="durationYears"
        value={form.durationYears}
        onChange={handleChange}
        placeholder="Duration"
        className="rounded border px-4 py-2"
      />

      <input
        type="number"
        name="totalSemesters"
        value={form.totalSemesters}
        onChange={handleChange}
        placeholder="Total Semesters"
        className="rounded border px-4 py-2"
      />

      <input
        type="number"
        name="totalCredits"
        value={form.totalCredits}
        onChange={handleChange}
        placeholder="Total Credits"
        className="rounded border px-4 py-2"
      />

      <input
        name="intake"
        value={form.intake}
        onChange={handleChange}
        placeholder="Intake"
        className="rounded border px-4 py-2"
      />

      <input
        type="number"
        name="seats"
        value={form.seats}
        onChange={handleChange}
        placeholder="Seats"
        className="rounded border px-4 py-2"
      />

    </div>

    <textarea
      rows={3}
      name="eligibility"
      value={form.eligibility}
      onChange={handleChange}
      placeholder="Eligibility"
      className="mt-4 w-full rounded border px-4 py-2"
    />

  </div>

  {/* ================= FEE STRUCTURE ================= */}

  <div className="rounded-lg border p-5">

    <h3 className="mb-4 text-xl font-semibold text-maroon-700">
      Fee Structure
    </h3>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

      <input
        type="number"
        name="admissionFee"
        value={form.admissionFee}
        onChange={handleChange}
        placeholder="Admission Fee"
        className="rounded border px-4 py-2"
      />

      <input
        type="number"
        name="semesterFee"
        value={form.semesterFee}
        onChange={handleChange}
        placeholder="Semester Fee"
        className="rounded border px-4 py-2"
      />

      <input
        type="number"
        name="yearlyFee"
        value={form.yearlyFee}
        onChange={handleChange}
        placeholder="Yearly Fee"
        className="rounded border px-4 py-2"
      />

      <input
        type="number"
        name="totalFee"
        value={form.totalFee}
        onChange={handleChange}
        placeholder="Total Course Fee"
        className="rounded border px-4 py-2"
      />

      <input
        name="examFee"
        value={form.examFee}
        onChange={handleChange}
        placeholder="Exam Fee"
        className="rounded border px-4 py-2 md:col-span-2"
      />

    </div>

  </div>

  {/* ================= SCHOLARSHIP ================= */}

  <div className="rounded-lg border p-5">

    <h3 className="mb-4 text-xl font-semibold text-maroon-700">
      Scholarship Opportunities
    </h3>

    <textarea
      rows={4}
      name="scholarship"
      value={form.scholarship}
      onChange={handleChange}
      placeholder="Scholarship Details"
      className="w-full rounded border px-4 py-2"
    />

  </div>

  {/* ================= CAREER ================= */}

  <div className="rounded-lg border p-5">

    <h3 className="mb-4 text-xl font-semibold text-maroon-700">
      Career Opportunities
    </h3>

    <textarea
      rows={4}
      name="careerOpportunities"
      value={form.careerOpportunities}
      onChange={handleChange}
      placeholder="Career Opportunities"
      className="w-full rounded border px-4 py-2"
    />

  </div>

  {/* ================= CURRICULUM ================= */}

  <div className="rounded-lg border p-5">

    <h3 className="mb-4 text-xl font-semibold text-maroon-700">
      Curriculum
    </h3>

    <input
      name="curriculumUrl"
      value={form.curriculumUrl}
      onChange={handleChange}
      placeholder="Curriculum PDF URL"
      className="w-full rounded border px-4 py-2"
    />

  </div>          {/* ================= STATUS ================= */}

          <div className="rounded-lg border p-5">

            <h3 className="mb-4 text-xl font-semibold text-maroon-700">
              Status
            </h3>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />

              <span>Active Course</span>

            </label>

          </div>

        </div>

        {/* Buttons */}

        <div className="mt-8 flex justify-end gap-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-lg bg-maroon-600 px-6 py-2 text-white hover:bg-maroon-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Course"}
          </button>

        </div>

      </div>
    </div>
  </div>
);
}