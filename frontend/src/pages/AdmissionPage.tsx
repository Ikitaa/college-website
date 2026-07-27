import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../lib/api";

export default function AdmissionPage() {
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    courseAppliedFor: "",
    previousSchool: "",
    previousGpa: "",
  });

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
    }
  };  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.dateOfBirth ||
      !form.courseAppliedFor ||
      !form.previousSchool
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      let documentsUrl = "";

      // Upload document if selected
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);

        const uploadRes = await api.post(
          "/upload",
          uploadData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        documentsUrl = uploadRes.data.fileUrl;
      }

      // Submit admission form
      await api.post("/admissions", {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        dateOfBirth: form.dateOfBirth,
        courseAppliedFor: form.courseAppliedFor,
        previousSchool: form.previousSchool,
        previousGpa: form.previousGpa,
        documentsUrl,
      });

      toast.success(
        "Your admission application has been submitted successfully."
      );

      // Reset form
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        courseAppliedFor: "",
        previousSchool: "",
        previousGpa: "",
      });

      setSelectedFile(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };  return (
    <>
      {/* ================= HERO ================= */}

      <section className="relative h-[320px] overflow-hidden">

        <img
          src="/images/pkmc-campus.jpg"
          alt="Admissions"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-maroon-900/70" />

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">

          <div className="max-w-2xl text-white">

            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-yellow-400">
              Admissions
            </p>

            <h1 className="font-display text-5xl font-bold">
              Apply for Admission
            </h1>

            <p className="mt-4 text-lg text-gray-100">
              Begin your academic journey at Padma Kanya Multiple Campus by
              submitting your admission application online.
            </p>

          </div>

        </div>

      </section>

      {/* ================= FORM ================= */}

      <section className="bg-[#FDF8F2] py-16">

        <div className="mx-auto max-w-6xl px-6">

          <div className="mb-10 text-center">

            <h2 className="font-display text-4xl font-bold text-maroon-900">
              Admission Application Form
            </h2>

            <p className="mt-3 text-gray-600">
              Please complete the form below with accurate information.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-white p-8 shadow-lg"
          >

            <div className="grid gap-6 md:grid-cols-2">

              {/* Full Name */}

              <div>

                <label className="mb-2 block font-medium">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="Enter your full name"
                />

              </div>

              {/* Email */}

              <div>

                <label className="mb-2 block font-medium">
                  Email Address *
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="example@gmail.com"
                />

              </div>

              {/* Phone */}

              <div>

                <label className="mb-2 block font-medium">
                  Phone Number *
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="98XXXXXXXX"
                />

              </div>

              {/* Date of Birth */}

              <div>

                <label className="mb-2 block font-medium">
                  Date of Birth *
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                />

              </div>              {/* Address */}

              <div className="md:col-span-2">

                <label className="mb-2 block font-medium">
                  Address *
                </label>

                <textarea
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="Enter your permanent address"
                />

              </div>

              {/* Course */}

              <div>

                <label className="mb-2 block font-medium">
                  Course Applying For *
                </label>

                <select
                  name="courseAppliedFor"
                  value={form.courseAppliedFor}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                >
                  <option value="">Select Course</option>
                  <option value="BCA">BCA</option>
                  <option value="BBS">BBS</option>
                  <option value="BA">BA</option>
                  <option value="BSc">BSc</option>
                  <option value="MBS">MBS</option>
                  <option value="MA">MA</option>
                  <option value="MEd">MEd</option>
                </select>

              </div>

              {/* Previous School */}

              <div>

                <label className="mb-2 block font-medium">
                  Previous School / College *
                </label>

                <input
                  type="text"
                  name="previousSchool"
                  value={form.previousSchool}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="Enter your previous institution"
                />

              </div>

              {/* GPA */}

              <div>

                <label className="mb-2 block font-medium">
                  Previous GPA (Optional)
                </label>

                <input
                  type="text"
                  name="previousGpa"
                  value={form.previousGpa}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="e.g. 3.65"
                />

              </div>

              {/* Upload Document */}

              <div>

                <label className="mb-2 block font-medium">
                  Upload Marksheet / Certificate (Optional)
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border px-4 py-3"
                />

                {selectedFile && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {selectedFile.name}
                  </p>
                )}

              </div>

            </div>

            {/* Submit Button */}

            <div className="mt-10 text-center">

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-maroon-700 px-10 py-3 text-lg font-semibold text-white transition hover:bg-maroon-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : "Submit Application"}
              </button>

            </div>

          </form>

        </div>

      </section>

    </>
  );
}