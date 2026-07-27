import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { api, getErrorMessage } from "../../lib/api";

interface Admission {
  _id: string;

  fullName: string;
  email: string;
  phone: string;
  address: string;

  dateOfBirth: string;

  courseAppliedFor: string;

  previousSchool: string;

  previousGpa?: string;

  documentsUrl?: string;

  status:
    | "pending"
    | "reviewed"
    | "accepted"
    | "rejected";

  remarks?: string;

  createdAt: string;
}

interface Props {
  isOpen: boolean;

  admission: Admission;

  onClose: () => void;
}

export default function AdmissionDetailsModal({
  isOpen,
  admission,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(admission.status);

  const [remarks, setRemarks] = useState(admission.remarks || "");

  useEffect(() => {
    setStatus(admission.status);
    setRemarks(admission.remarks || "");
  }, [admission]);

  if (!isOpen) return null;  // ================= UPDATE STATUS =================

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);

      await api.patch(`/admissions/${admission._id}/status`, {
        status,
        remarks,
      });

      toast.success("Application updated successfully.");

      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ================= STATUS BUTTONS =================

  const setPending = () => {
    setStatus("pending");
  };

  const setReviewed = () => {
    setStatus("reviewed");
  };

  const setAccepted = () => {
    setStatus("accepted");
  };

  const setRejected = () => {
    setStatus("rejected");
  };  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            Admission Details
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-600"
          >
            ×
          </button>
        </div>

        {/* ================= BODY ================= */}

        <div className="max-h-[70vh] overflow-y-auto p-6">

          <div className="grid gap-6 md:grid-cols-2">

            {/* Full Name */}

            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="font-semibold">
                {admission.fullName}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-semibold break-all">
                {admission.email}
              </p>
            </div>

            {/* Phone */}

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="font-semibold">
                {admission.phone}
              </p>
            </div>

            {/* Address */}

            <div>
              <p className="text-sm text-gray-500">
                Address
              </p>

              <p className="font-semibold">
                {admission.address}
              </p>
            </div>

            {/* Date of Birth */}

            <div>
              <p className="text-sm text-gray-500">
                Date of Birth
              </p>

              <p className="font-semibold">
                {new Date(
                  admission.dateOfBirth
                ).toLocaleDateString()}
              </p>
            </div>

            {/* Course */}

            <div>
              <p className="text-sm text-gray-500">
                Course Applied For
              </p>

              <p className="font-semibold">
                {admission.courseAppliedFor}
              </p>
            </div>

            {/* Previous School */}

            <div>
              <p className="text-sm text-gray-500">
                Previous School
              </p>

              <p className="font-semibold">
                {admission.previousSchool}
              </p>
            </div>

            {/* GPA */}

            <div>
              <p className="text-sm text-gray-500">
                Previous GPA
              </p>

              <p className="font-semibold">
                {admission.previousGpa || "-"}
              </p>
            </div>

          </div>

          {/* ================= DOCUMENT ================= */}

          <div className="mt-8">

            <p className="mb-2 text-sm text-gray-500">
              Uploaded Documents
            </p>

            {admission.documentsUrl ? (
              <a
                href={admission.documentsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-maroon-600 underline"
              >
                View Uploaded Document
              </a>
            ) : (
              <p className="text-gray-500">
                No document uploaded.
              </p>
            )}

          </div>

          {/* ================= STATUS ================= */}

          <div className="mt-8">

            <label className="mb-2 block text-sm font-medium">
              Application Status
            </label>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={setPending}
                className={`rounded-md px-4 py-2 ${
                  status === "pending"
                    ? "bg-yellow-600 text-white"
                    : "border"
                }`}
              >
                Pending
              </button>

              <button
                onClick={setReviewed}
                className={`rounded-md px-4 py-2 ${
                  status === "reviewed"
                    ? "bg-blue-600 text-white"
                    : "border"
                }`}
              >
                Reviewed
              </button>

              <button
                onClick={setAccepted}
                className={`rounded-md px-4 py-2 ${
                  status === "accepted"
                    ? "bg-green-600 text-white"
                    : "border"
                }`}
              >
                Accepted
              </button>

              <button
                onClick={setRejected}
                className={`rounded-md px-4 py-2 ${
                  status === "rejected"
                    ? "bg-red-600 text-white"
                    : "border"
                }`}
              >
                Rejected
              </button>

            </div>

          </div>          {/* ================= REMARKS ================= */}

          <div className="mt-8">

            <label className="mb-2 block text-sm font-medium">
              Remarks
            </label>

            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks..."
              className="w-full rounded-md border px-3 py-2"
            />

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="flex justify-end gap-3 border-t px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateStatus}
            disabled={loading}
            className="rounded-md bg-maroon-600 px-5 py-2 text-white hover:bg-maroon-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>
    </div>
  );
}