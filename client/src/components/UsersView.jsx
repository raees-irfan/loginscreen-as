import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUsers, deleteUserById } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AddUserModal from './AddUserModal';
import './UsersView.css';

const UsersView = ({ user }) => {
  const dispatch = useDispatch();
  const { allUsers, isUsersLoading } = useSelector((state) => state.auth);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, isAdmin]);

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setIsEditModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingUser(null);
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleUserUpdated = () => {
    handleModalClose();
    if (isAdmin) {
      dispatch(fetchAllUsers());
    }
  };

  const handleDelete = async (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteUserById({ userId })).unwrap();
          toast.success('User deleted successfully');
          if (isAdmin) {
            dispatch(fetchAllUsers());
          }
          Swal.fire('Deleted!', 'The user has been deleted.', 'success');
        } catch (error) {
          toast.error(error || 'Failed to delete user');
          Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
        }
      }
    });
  };

  const usersToDisplay = isAdmin ? allUsers : user ? [user] : [];

  if (!isAdmin && !user) {
    return (
      <div className="users-view">
        <h1>Users</h1>
        <p>No user data available</p>
      </div>
    );
  }

  return (
    <div className="users-view">
      <h1>Users</h1>

      <div className="users-header">
        {isAdmin && (
          <button className="add-user-btn" onClick={handleAddClick}>
            Add User
          </button>
        )}
      </div>

      <div className="users-table-container">
        {isUsersLoading ? (
          <div className="loading">Loading users...</div>
        ) : usersToDisplay.length === 0 ? (
          <div className="no-users">No users found</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {isAdmin && <th>Role</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersToDisplay.map((displayUser) => (
                <tr key={displayUser.id}>
                  <td>{displayUser.name}</td>
                  <td>{displayUser.email}</td>
                  {isAdmin && <td className="role-badge">{displayUser.role === 'admin' ? 'Admin' : 'User'}</td>}
                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(displayUser)}
                    >
                      Edit
                    </button>
                    {isAdmin && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(displayUser.id)}
                        disabled={displayUser.id === user?.id}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onUserAdded={handleUserUpdated}
        editingUser={null}
        isAdmin={isAdmin}
      />

      <AddUserModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onUserAdded={handleUserUpdated}
        editingUser={editingUser}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default UsersView;

