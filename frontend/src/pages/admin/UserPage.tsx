import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  UserPlus,
  UserCheck,
  UserX,
  Edit,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  department?: string;
  designation?: string;
  faculty?: string;
  semester?: string;
  rollNumber?: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      let url = `/users?page=${page}&limit=10&`;

      if (search) url += `search=${search}&`;
      if (role) url += `role=${role}`;

      const res = await api.get(url);

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, role, page]);

  const deleteUser = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);

      toast.success("User deleted");

      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await api.patch(`/users/${id}/deactivate`);

      toast.success("Status updated");

      fetchUsers();
    } catch {
      toast.error("Unable to update status");
    }
  };

  return (
    <div>
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">
            User Management
          </h1>

          <p className="mt-1 text-sm text-ink-500">
            Manage students, teachers and administrators.
          </p>
        </div>

        <button
  onClick={() => setOpenAddModal(true)}
  className="flex items-center gap-2 rounded-md bg-maroon-600 px-4 py-2 text-white hover:bg-maroon-700"
>
  <UserPlus size={18} />
  Add User
</button>
      </div>

      {/* Filters */}

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-maroon-500 focus:outline-none"
          />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Table */}

      <div className="mt-6 overflow-hidden rounded-lg border border-maroon-100 bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-maroon-50">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold">
                Name
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Email
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Role
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-5 py-3 text-left text-sm font-semibold">
                Joined
              </th>

              <th className="px-5 py-3 text-center text-sm font-semibold">
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
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium">
                    {user.name}
                  </td>

                  <td className="px-5 py-4">
                    {user.email}
                  </td>

                  <td className="px-5 py-4 capitalize">
                    {user.role}
                  </td>

                  <td className="px-5 py-4">
                    {user.isActive ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
  onClick={() => {
    setSelectedUser(user);
    setOpenEditModal(true);
  }}
  className="rounded p-2 text-blue-600 hover:bg-blue-50"
>
  <Edit size={18} />
</button>

                      <button
                        onClick={() => toggleStatus(user._id)}
                        className="rounded p-2 text-green-600 hover:bg-green-50"
                        title="Activate / Deactivate"
                      >
                        {user.isActive ? (
                          <UserX size={18} />
                        ) : (
                          <UserCheck size={18} />
                        )}
                      </button>

                      <button
                        onClick={() => deleteUser(user._id)}
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
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
        <div className="mt-6 flex items-center justify-between">

  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="rounded bg-maroon-600 px-4 py-2 text-white disabled:opacity-40"
  >
    Previous
  </button>

  <p className="font-medium">
    Page {page} of {totalPages}
  </p>

  <button
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
    className="rounded bg-maroon-600 px-4 py-2 text-white disabled:opacity-40"
  >
    Next
  </button>

</div>
      </div>

      {!loading && (
        <div className="mt-4 text-sm text-gray-500">
          Total Users: <strong>{users.length}</strong>
        </div>
      )}
      <AddUserModal
  isOpen={openAddModal}
  onClose={() => setOpenAddModal(false)}
  onSuccess={fetchUsers}
/>
<EditUserModal
  isOpen={openEditModal}
  onClose={() => {
    setOpenEditModal(false);
    setSelectedUser(null);
  }}
  onSuccess={fetchUsers}
  user={selectedUser}
/>
    </div>
  );
}