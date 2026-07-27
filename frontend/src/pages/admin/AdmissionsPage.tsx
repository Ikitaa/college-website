import { useEffect, useState } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { api, getErrorMessage } from "../../lib/api";

import AdmissionDetailsModal from "./AdmissionDetailsModal";

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

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState<Admission[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [selectedAdmission, setSelectedAdmission] =
    useState<Admission | null>(null);

  const [openModal, setOpenModal] = useState(false);  // ================= FETCH ADMISSIONS =================

  const fetchAdmissions = async () => {
    try {
      setLoading(true);

      let url = "/admissions";

      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }

      const res = await api.get(url);

      setAdmissions(res.data.admissions);
      setFilteredAdmissions(res.data.admissions);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD DATA =================

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter]);

  // ================= SEARCH =================

  useEffect(() => {
    if (!search.trim()) {
      setFilteredAdmissions(admissions);
      return;
    }

    const keyword = search.toLowerCase();

    setFilteredAdmissions(
      admissions.filter(
        (admission) =>
          admission.fullName.toLowerCase().includes(keyword) ||
          admission.email.toLowerCase().includes(keyword) ||
          admission.courseAppliedFor.toLowerCase().includes(keyword)
      )
    );
  }, [search, admissions]);

  // ================= DELETE =================

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this application?")) {
      return;
    }

    try {
      await api.delete(`/admissions/${id}`);

      toast.success("Application deleted successfully.");

      fetchAdmissions();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ================= STATUS BADGE =================

  const badgeColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "reviewed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Admissions
          </h1>

          <p className="text-sm text-ink-500">
            Manage student admission applications
          </p>
        </div>
      </div>

      {/* ================= SEARCH & FILTER ================= */}

      <div className="mt-6 flex flex-wrap gap-4">

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search applicant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border py-2 pl-10 pr-4"
          />
        </div>

        {/* Status Filter */}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>

      {/* ================= TABLE ================= */}

      <div className="mt-6 overflow-hidden rounded-lg border bg-white">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-3 text-left">
                Applicant
              </th>

              <th className="px-4 py-3 text-left">
                Course
              </th>

              <th className="px-4 py-3 text-left">
                Phone
              </th>

              <th className="px-4 py-3 text-center">
                Status
              </th>

              <th className="px-4 py-3 text-center">
                Submitted
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
                  Loading applications...
                </td>

              </tr>

            ) : filteredAdmissions.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No admission applications found.
                </td>

              </tr>

            ) : (

              filteredAdmissions.map((admission) => (

                <tr
                  key={admission._id}
                  className="border-t hover:bg-gray-50"
                >

                  {/* Applicant */}

                  <td className="px-4 py-3">

                    <p className="font-semibold">
                      {admission.fullName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {admission.email}
                    </p>

                  </td>

                  {/* Course */}

                  <td className="px-4 py-3">
                    {admission.courseAppliedFor}
                  </td>

                  {/* Phone */}

                  <td className="px-4 py-3">
                    {admission.phone}
                  </td>

                  {/* Status */}

                  <td className="px-4 py-3 text-center">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColor(
                        admission.status
                      )}`}
                    >
                      {admission.status}
                    </span>

                  </td>

                  {/* Date */}

                  <td className="px-4 py-3 text-center">

                    {new Date(
                      admission.createdAt
                    ).toLocaleDateString()}

                  </td>

                  {/* Actions */}

                  <td className="px-4 py-3">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => {
                          setSelectedAdmission(admission);
                          setOpenModal(true);
                        }}
                        className="rounded bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(admission._id)
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

      </div>      {/* ================= DETAILS MODAL ================= */}

      {selectedAdmission && (
        <AdmissionDetailsModal
          isOpen={openModal}
          admission={selectedAdmission}
          onClose={() => {
            setOpenModal(false);
            setSelectedAdmission(null);
            fetchAdmissions();
          }}
        />
      )}
    </div>
  );
}