import React, { useState, useEffect, useCallback } from "react";
import {
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaSync,
  FaUserShield,
  FaUser,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const UserManagement = () => {
  const { axios, user } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    _id: "",
    username: "",
    email: "",
    role: "user",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user/admin/all");
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      _id: "",
      username: "",
      email: "",
      role: "user",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (userToEdit) => {
    setModalMode("edit");
    setSelectedUser(userToEdit);
    setFormData({
      _id: userToEdit._id,
      username: userToEdit.username,
      email: userToEdit.email,
      role: userToEdit.role,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      _id: "",
      username: "",
      email: "",
      role: "user",
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!formData._id || !formData.username || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data } = await axios.post("/api/user/admin/create", formData);
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
        handleCloseModal();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(`/api/user/admin/${selectedUser._id}`, {
        username: formData.username,
        email: formData.email,
        role: formData.role,
      });

      if (data.success) {
        toast.success(data.message);
        fetchUsers();
        handleCloseModal();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId, username) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${username}"?\n\nThis action cannot be undone!`,
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`/api/user/admin/${userId}`);
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const userStats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 playfair">
              User Management
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2 outfit">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchUsers}
              disabled={loading}
              className={`px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 outfit font-medium ${
                loading ? "opacity-50" : ""
              }`}
            >
              <FaSync className={`${loading ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 outfit font-medium shadow-sm"
            >
              <FaUserPlus />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide outfit">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2 outfit">
                {userStats.total}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <FaUser className="text-3xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Admins */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide outfit">
                Administrators
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2 outfit">
                {userStats.admins}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <FaUserShield className="text-3xl text-purple-600" />
            </div>
          </div>
        </div>

        {/* Regular Users */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide outfit">
                Regular Users
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2 outfit">
                {userStats.users}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <FaUser className="text-3xl text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 outfit">
              All Users
            </h2>
            <p className="text-sm text-gray-600 mt-1 outfit">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all outfit"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600 outfit font-medium">
                Loading users...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <FaUser className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-xl font-semibold text-gray-700 playfair">
                {searchQuery ? "No users found" : "No users yet"}
              </p>
              <p className="text-sm text-gray-500 mt-2 outfit">
                {searchQuery
                  ? "Try a different search query"
                  : "Add your first user to get started"}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider outfit">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider outfit">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider outfit">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider outfit">
                    User ID
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider outfit">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u, index) => (
                  <tr
                    key={u._id}
                    className={`hover:bg-blue-50/30 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            u.role === "admin" ? "bg-purple-100" : "bg-blue-100"
                          }`}
                        >
                          {u.role === "admin" ? (
                            <FaUserShield className="text-purple-600" />
                          ) : (
                            <FaUser className="text-blue-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 outfit">
                            {u.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 outfit">
                        {u.email}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold outfit ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <>
                            <FaUserShield className="mr-1" /> Admin
                          </>
                        ) : (
                          <>
                            <FaUser className="mr-1" /> User
                          </>
                        )}
                      </span>
                    </td>

                    {/* User ID */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500 font-mono outfit">
                        {u._id.substring(0, 8)}...
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit user"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id, u.username)}
                          disabled={u._id === user?._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title={
                            u._id === user?._id
                              ? "Cannot delete yourself"
                              : "Delete user"
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 playfair">
                {modalMode === "create" ? "Add New User" : "Edit User"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={
                modalMode === "create" ? handleCreateUser : handleUpdateUser
              }
              className="px-6 py-6 space-y-4"
            >
              {/* User ID (only for create) */}
              {modalMode === "create" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 outfit">
                    User ID (Clerk ID)
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="_id"
                    value={formData._id}
                    onChange={handleInputChange}
                    placeholder="user_xxxxxxxxxxxxx"
                    className="w-full border-2 border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outfit"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 outfit">
                    The Clerk user ID from authentication system
                  </p>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 outfit">
                  Username
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className="w-full border-2 border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outfit"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 outfit">
                  Email
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  className="w-full border-2 border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outfit"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 outfit">
                  Role
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outfit"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1 outfit">
                  Admins have full access to manage the system
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all outfit font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all outfit font-medium shadow-sm"
                >
                  {modalMode === "create" ? "Create User" : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
