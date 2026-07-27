import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../../lib/api";
import AddDepartmentModal from "./AddDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";


interface Department {
  _id: string;
  name: string;
  description?: string;
}

export default function DepartmentsPage() {
    const [openEditModal, setOpenEditModal] = useState(false);

const [selectedDepartment, setSelectedDepartment] =
  useState<Department | null>(null);
    const [openAddModal, setOpenAddModal] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/departments");

      setDepartments(res.data.departments);
      setFilteredDepartments(res.data.departments);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    setFilteredDepartments(
      departments.filter((dept) =>
        dept.name.toLowerCase().includes(keyword)
      )
    );
  }, [search, departments]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await api.delete(`/departments/${id}`);

      toast.success("Department deleted");

      fetchDepartments();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="font-display text-3xl font-semibold">
            Department Management
          </h1>

          <p className="mt-1 text-gray-500">
            Manage academic departments.
          </p>
        </div>

        <button
  onClick={() => setOpenAddModal(true)}
  className="flex items-center gap-2 rounded-lg bg-maroon-600 px-5 py-2 text-white hover:bg-maroon-700"
>
          <Plus size={18} />

          Add Department
        </button>

      </div>

      {/* Search */}

      <div className="mb-6">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-4"
          />

        </div>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-lg border bg-white">

        <table className="min-w-full">

          <thead className="bg-maroon-700 text-white">

            <tr>

              <th className="px-5 py-3 text-left">
                Department
              </th>

              <th className="px-5 py-3 text-left">
                Description
              </th>

              <th className="px-5 py-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={3}
                  className="py-10 text-center"
                >
                  Loading...
                </td>

              </tr>

            ) : filteredDepartments.length === 0 ? (

              <tr>

                <td
                  colSpan={3}
                  className="py-10 text-center"
                >
                  No departments found.
                </td>

              </tr>

            ) : (

              filteredDepartments.map((dept) => (

                <tr
                  key={dept._id}
                  className="border-t"
                >

                  <td className="px-5 py-4 font-medium">
                    {dept.name}
                  </td>

                  <td className="px-5 py-4">
                    {dept.description || "-"}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center gap-3">

                      <button
  onClick={() => {
    setSelectedDepartment(dept);
    setOpenEditModal(true);
  }}
  className="text-blue-600 hover:text-blue-800"
>
  <Pencil size={18} />
</button>

                      <button
                        onClick={() => handleDelete(dept._id)}
                        className="text-red-600"
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

      </div>

      <div className="mt-4 text-sm text-gray-500">
        Total Departments:{" "}
        <strong>{filteredDepartments.length}</strong>
      </div>
      <AddDepartmentModal
  isOpen={openAddModal}
  onClose={() => setOpenAddModal(false)}
  onSuccess={fetchDepartments}
/>
<EditDepartmentModal
  isOpen={openEditModal}
  onClose={() => {
    setOpenEditModal(false);
    setSelectedDepartment(null);
  }}
  onSuccess={fetchDepartments}
  department={selectedDepartment}
/>
    </div>
  );
}