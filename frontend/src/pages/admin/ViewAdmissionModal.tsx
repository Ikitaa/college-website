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
  status: "pending" | "reviewed" | "accepted" | "rejected";
  remarks?: string;
  createdAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  admission: Admission;
}

export default function ViewAdmissionModal({
  isOpen,
  onClose,
  admission,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            Admission Details
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-600"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-4 p-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{admission.fullName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p>{admission.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p>{admission.phone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Course Applied</p>
            <p>{admission.courseAppliedFor}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Previous School</p>
            <p>{admission.previousSchool}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Previous GPA</p>
            <p>{admission.previousGpa || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p>
              {new Date(admission.dateOfBirth).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>

            <span
              className={`rounded-full px-3 py-1 text-sm capitalize
              ${
                admission.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : admission.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : admission.status === "reviewed"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {admission.status}
            </span>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p>{admission.address}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Remarks</p>
            <p>{admission.remarks || "-"}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Documents</p>

            {admission.documentsUrl ? (
              <a
                href={admission.documentsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-maroon-600 hover:underline"
              >
                View Uploaded Document
              </a>
            ) : (
              <p>No document uploaded.</p>
            )}
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Applied On</p>
            <p>
              {new Date(admission.createdAt).toLocaleString()}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md bg-maroon-600 px-5 py-2 text-white hover:bg-maroon-700"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}