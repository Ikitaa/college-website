import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../../lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCourseModal({
  isOpen,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // ================= BASIC =================
    title: "",
    code: "",
    faculty: "",
    description: "",

    // ================= ACADEMIC =================
    durationYears: 4,

    studySystem: "semester" as "semester" | "year",

    semesterCount: 8,

    totalCredits: 120,

    medium: "English",

    intake: "Yearly",

    seats: 0,

    eligibility: "",

    // ================= FEES =================
    admissionFee: 0,

    semesterFees: Array(8).fill(0),

    yearlyFees: Array(4).fill(0),

    examFee: "",

    totalFee: 0,

    // ================= OTHER =================
    scholarship: "",

    careerOpportunities: "",

    curriculumUrl: "",

    isActive: true,
  });

  // ================= INPUT CHANGE =================

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
      "semesterCount",
      "totalCredits",
      "admissionFee",
      "seats",
    ];

    setForm((prev) => ({
      ...prev,
      [name]: numberFields.includes(name)
        ? Number(value)
        : value,
    }));
  };

  // ================= SEMESTER FEE =================

  const handleSemesterFeeChange = (
    index: number,
    value: number
  ) => {
    const fees = [...form.semesterFees];
    fees[index] = value;

    setForm((prev) => ({
      ...prev,
      semesterFees: fees,
    }));
  };

  // ================= YEAR FEE =================

  const handleYearFeeChange = (
    index: number,
    value: number
  ) => {
    const fees = [...form.yearlyFees];
    fees[index] = value;

    setForm((prev) => ({
      ...prev,
      yearlyFees: fees,
    }));
  };

  // ================= AUTO TOTAL FEE =================

  useEffect(() => {
    let total = Number(form.admissionFee);

    if (form.studySystem === "semester") {
      total += form.semesterFees.reduce(
        (sum, fee) => sum + Number(fee),
        0
      );
    } else {
      total += form.yearlyFees.reduce(
        (sum, fee) => sum + Number(fee),
        0
      );
    }

    setForm((prev) => ({
      ...prev,
      totalFee: total,
    }));
  }, [
    form.admissionFee,
    form.semesterFees,
    form.yearlyFees,
    form.studySystem,
  ]);

  // ================= SUBMIT =================

  const handleSubmit = async () => {
  if (
    !form.title.trim() ||
    !form.code.trim() ||
    !form.faculty
  ) {
    toast.error("Please fill all required fields.");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      ...form,
    };

    // Remove empty coordinator before sending
    delete (payload as any).coordinator;

    await api.post("/courses", payload);

    toast.success("Course added successfully.");

    onClose();
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 overflow-y-auto">

      <div className="w-full max-w-6xl rounded-xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-8 py-5">

          <div>

            <h2 className="text-3xl font-bold text-maroon-700">
              Add New Course
            </h2>

            <p className="mt-1 text-gray-500">
              Enter all details about the course.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-md border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

        </div>

        {/* Body */}

        <div className="max-h-[80vh] overflow-y-auto p-8">

          {/* ================= BASIC INFORMATION ================= */}

          <div className="rounded-xl border border-gray-200 p-6">

            <h3 className="mb-6 text-2xl font-semibold text-maroon-700">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-6">

              {/* Course Title */}

              <div>

                <label className="mb-2 block font-medium">
                  Course Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Bachelor of Computer Application"
                  className="w-full rounded-lg border px-4 py-3 focus:border-maroon-600 focus:outline-none"
                />

              </div>

              {/* Course Code */}

              <div>

                <label className="mb-2 block font-medium">
                  Course Code *
                </label>

                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="BCA"
                  className="w-full rounded-lg border px-4 py-3 focus:border-maroon-600 focus:outline-none"
                />

              </div>

              {/* Faculty */}

              <div>

                <label className="mb-2 block font-medium">
                  Faculty *
                </label>

                <select
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                >
                  <option value="">
                    Select Faculty
                  </option>

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

              {/* Medium */}

              <div>

                <label className="mb-2 block font-medium">
                  Medium of Instruction
                </label>

                <select
                  name="medium"
                  value={form.medium}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                >
                  <option value="English">
                    English
                  </option>

                  <option value="Nepali">
                    Nepali
                  </option>

                  <option value="English & Nepali">
                    English & Nepali
                  </option>

                </select>

              </div>

            </div>

            {/* Description */}

            <div className="mt-6">

              <label className="mb-2 block font-medium">
                Course Description
              </label>

              <textarea
                rows={6}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the course..."
                className="w-full rounded-lg border px-4 py-3"
              />

            </div>

          </div>          {/* ================= ACADEMIC DETAILS ================= */}

          <div className="mt-8 rounded-xl border border-gray-200 p-6">

            <h3 className="mb-6 text-2xl font-semibold text-maroon-700">
              Academic Details
            </h3>

            <div className="grid grid-cols-2 gap-6">

              {/* Duration */}

              <div>

                <label className="mb-2 block font-medium">
                  Duration (Years)
                </label>

                <input
                  type="number"
                  min={1}
                  name="durationYears"
                  value={form.durationYears}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />

              </div>

              {/* Study System */}

              <div>

                <label className="mb-2 block font-medium">
                  Study System
                </label>

                <select
                  name="studySystem"
                  value={form.studySystem}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                >
                  <option value="semester">
                    Semester System
                  </option>

                  <option value="year">
                    Yearly System
                  </option>

                </select>

              </div>

              {/* Semester Count */}

              {form.studySystem === "semester" && (

                <div>

                  <label className="mb-2 block font-medium">
                    Number of Semesters
                  </label>

                  <select
                    name="semesterCount"
                    value={form.semesterCount}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                  >
                    <option value={2}>2 Semesters</option>
                    <option value={4}>4 Semesters</option>
                    <option value={6}>6 Semesters</option>
                    <option value={8}>8 Semesters</option>
                    <option value={10}>10 Semesters</option>
                    <option value={12}>12 Semesters</option>
                  </select>

                </div>

              )}

              {/* Total Credits */}

              <div>

                <label className="mb-2 block font-medium">
                  Total Credits
                </label>

                <input
                  type="number"
                  min={0}
                  name="totalCredits"
                  value={form.totalCredits}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />

              </div>

              {/* Intake */}

              <div>

                <label className="mb-2 block font-medium">
                  Intake
                </label>

                <select
                  name="intake"
                  value={form.intake}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                >
                  <option value="Yearly">
                    Yearly
                  </option>

                  <option value="Semester">
                    Every Semester
                  </option>

                  <option value="Rolling">
                    Rolling Admission
                  </option>

                </select>

              </div>

              {/* Seats */}

              <div>

                <label className="mb-2 block font-medium">
                  Available Seats
                </label>

                <input
                  type="number"
                  min={0}
                  name="seats"
                  value={form.seats}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />

              </div>

            </div>

            {/* Eligibility */}

            <div className="mt-6">

              <label className="mb-2 block font-medium">
                Eligibility Criteria
              </label>

              <textarea
                rows={5}
                name="eligibility"
                value={form.eligibility}
                onChange={handleChange}
                placeholder="Example: +2 or equivalent with minimum D+ grade in all subjects."
                className="w-full rounded-lg border px-4 py-3"
              />

            </div>

          </div>          {/* ================= FEE STRUCTURE ================= */}

          <div className="mt-8 rounded-xl border border-gray-200 p-6">

            <h3 className="mb-6 text-2xl font-semibold text-maroon-700">
              Fee Structure
            </h3>

            {/* Admission Fee */}

            <div className="mb-6">

              <label className="mb-2 block font-medium">
                Admission Fee (Rs.)
              </label>

              <input
                type="number"
                min={0}
                name="admissionFee"
                value={form.admissionFee}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
              />

            </div>

            {/* Semester Fee Inputs */}

            {form.studySystem === "semester" && (

              <div>

                <h4 className="mb-4 text-lg font-semibold">
                  Semester-wise Tuition Fee
                </h4>

                <div className="grid grid-cols-2 gap-5">

                  {Array.from({
                    length: form.semesterCount,
                  }).map((_, index) => (

                    <div key={index}>

                      <label className="mb-2 block font-medium">
                        Semester {index + 1}
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={form.semesterFees[index] ?? 0}
                        onChange={(e) =>
                          handleSemesterFeeChange(
                            index,
                            Number(e.target.value)
                          )
                        }
                        className="w-full rounded-lg border px-4 py-3"
                      />

                    </div>

                  ))}

                </div>

              </div>

            )}

            {/* Yearly Fee Inputs */}

            {form.studySystem === "year" && (

              <div>

                <h4 className="mb-4 text-lg font-semibold">
                  Year-wise Tuition Fee
                </h4>

                <div className="grid grid-cols-2 gap-5">

                  {Array.from({ length: 4 }).map((_, index) => (

                    <div key={index}>

                      <label className="mb-2 block font-medium">
                        Year {index + 1}
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={form.yearlyFees[index] ?? 0}
                        onChange={(e) =>
                          handleYearFeeChange(
                            index,
                            Number(e.target.value)
                          )
                        }
                        className="w-full rounded-lg border px-4 py-3"
                      />

                    </div>

                  ))}

                </div>

              </div>

            )}

            {/* Exam Fee */}

            <div className="mt-8">

              <label className="mb-2 block font-medium">
                Examination Fee
              </label>

              <input
                type="text"
                name="examFee"
                value={form.examFee}
                onChange={handleChange}
                placeholder="Example: Rs. 2,500 per semester"
                className="w-full rounded-lg border px-4 py-3"
              />

            </div>

            {/* Total Fee */}

            <div className="mt-8">

              <label className="mb-2 block font-medium">
                Total Course Fee (Auto Calculated)
              </label>

              <input
                type="number"
                readOnly
                value={form.totalFee}
                className="w-full rounded-lg border bg-gray-100 px-4 py-3 font-semibold"
              />

            </div>

          </div>          {/* ================= OTHER INFORMATION ================= */}

          <div className="mt-8 rounded-xl border border-gray-200 p-6">

            <h3 className="mb-6 text-2xl font-semibold text-maroon-700">
              Additional Information
            </h3>

            {/* Scholarship */}

            <div className="mb-6">

              <label className="mb-2 block font-medium">
                Scholarship Information
              </label>

              <textarea
                rows={4}
                name="scholarship"
                value={form.scholarship}
                onChange={handleChange}
                placeholder="Enter scholarship details..."
                className="w-full rounded-lg border px-4 py-3"
              />

            </div>

            {/* Career Opportunities */}

            <div className="mb-6">

              <label className="mb-2 block font-medium">
                Career Opportunities
              </label>

              <textarea
                rows={4}
                name="careerOpportunities"
                value={form.careerOpportunities}
                onChange={handleChange}
                placeholder="Example: Software Developer, System Analyst, Project Manager..."
                className="w-full rounded-lg border px-4 py-3"
              />

            </div>

            {/* Curriculum URL */}

            <div className="mb-6">

              <label className="mb-2 block font-medium">
                Curriculum URL
              </label>

              <input
                type="text"
                name="curriculumUrl"
                value={form.curriculumUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border px-4 py-3"
              />

            </div>

            {/* Active Course */}

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
                className="h-5 w-5"
              />

              <span className="font-medium">
                Active Course
              </span>

            </label>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="mt-10 flex justify-end gap-4">

            <button
              onClick={onClose}
              className="rounded-lg border px-6 py-3 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-maroon-600 px-8 py-3 font-medium text-white hover:bg-maroon-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add Course"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}