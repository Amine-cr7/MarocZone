import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllAds,
  deleteAd,
} from "../../features/admin/adminSlice";

const PanelControl = () => {
  const dispatch = useDispatch();

  const { users, ads, loading, error } = useSelector((state) => state.admin);
  console.log(users);
  users.forEach((user) => console.log(user._id));

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllAds());
  }, [dispatch]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(id));

      dispatch(getAllUsers());
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await dispatch(updateUserRole({ id, role: newRole }));
    dispatch(getAllUsers());
  };

  const handleDeleteAd = async (id) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      await dispatch(deleteAd(id));
      dispatch(getAllAds());
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>User List</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ _id, name, email, role }) => (
              <tr key={_id}>
                <td>{name}</td>
                <td>{email}</td>
                <td>{role}</td>
                <td>
                  <button
                    onClick={() => handleRoleChange(_id, role)}
                    style={{ marginRight: "10px" }}
                  >
                    Change Role
                  </button>
                  <button
                    onClick={() => handleDeleteUser(_id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: "40px" }}>Ads List</h2>
      {ads.length === 0 ? (
        <p>No ads found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Posted By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(({ _id, title, description, user }) => (
              <tr key={_id}>
                <td>{title}</td>
                <td>{description}</td>
                <td>{user?.FullName || "Unknown"}</td>

                <td>
                  <button
                    onClick={() => handleDeleteAd(_id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PanelControl;
