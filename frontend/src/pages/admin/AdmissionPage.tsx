import { useEffect, useState } from "react";
import { Eye, Trash2, Search } from "lucide-react";
import { api, getErrorMessage } from "../../lib/api";
import toast from "react-hot-toast";
import ViewAdmissionModal from "./ViewAdmissionModal";

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

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedAdmission, setSelectedAdmission] =
    useState<Admission | null>(null);

  const [openViewModal, setOpenViewModal] = useState(false);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);

      let url = `/admissions?page=${page}&limit=10`;

      if (search) {
        url += `&search=${search}`;
      }

      if (status) {
        url += `&status=${status}`;
      }

      const res = await api.get(url);

      setAdmissions(res.data.admissions);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [page, search, status]);

  const changeStatus = async (
    id: string,
    newStatus: "reviewed" | "accepted" | "rejected"
  ) => {
    try {
      await api.patch(`/admissions/${id}/status`, {
        status: newStatus,
      });

      toast.success("Status updated");

      fetchAdmissions();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const deleteAdmission = async (id: string) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      await api.delete(`/admissions/${id}`);

      toast.success("Application deleted");

      fetchAdmissions();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Admission Applications
      </h1>

      <div className="mt-6 flex flex-wrap gap-4">

        <div className="relative">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search applicant..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="rounded-md border pl-10 pr-4 py-2"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-md border px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white">

        <table className="min-w-full">

          <thead className="bg-maroon-50">

            <tr>

              <th className="px-4 py-3 text-left">Applicant</th>

              <th className="px-4 py-3 text-left">Course</th>

              <th className="px-4 py-3 text-left">Phone</th>

              <th className="px-4 py-3 text-left">Status</th>

              <th className="px-4 py-3 text-left">Applied</th>

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
                  className="py-8 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : admissions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center"
                >
                  No applications found.
                </td>
              </tr>
            ) : (
              admissions.map((admission) => (
                <tr
                  key={admission._id}
                  className="border-t"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {admission.fullName}
                    </div>

                    <div className="text-sm text-gray-500">
                      {admission.email}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {admission.courseAppliedFor}
                  </td>

                  <td className="px-4 py-3">
                    {admission.phone}
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm capitalize">
                      {admission.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      admission.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => {
                          setSelectedAdmission(admission);
                          setOpenViewModal(true);
                        }}
                        className="rounded bg-blue-500 p-2 text-white"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          changeStatus(
                            admission._id,
                            "accepted"
                          )
                        }
                        className="rounded bg-green-600 px-3 py-2 text-white"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          changeStatus(
                            admission._id,
                            "rejected"
                          )
                        }
                        className="rounded bg-yellow-500 px-3 py-2 text-white"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() =>
                          changeStatus(
                            admission._id,
                            "reviewed"
                          )
                        }
                        className="rounded bg-indigo-600 px-3 py-2 text-white"
                      >
                        Review
                      </button>

                      <button
                        onClick={() =>
                          deleteAdmission(
                            admission._id
                          )
                        }
                        className="rounded bg-red-600 p-2 text-white"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded bg-maroon-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="rounded bg-maroon-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Next
        </button>

      </div>

      {selectedAdmission && (
        <ViewAdmissionModal
          isOpen={openViewModal}
          onClose={() => setOpenViewModal(false)}
          admission={selectedAdmission}
        />
      )}
    </div>
  );
}