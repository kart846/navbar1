import React, { useState, useEffect } from "react";
import "./MappingData.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
export const MappingData = () => {

  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);

      // Update used IDs
      const usedIdsList = response.data.map((user) => user.user_id || ""); // change
      
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

 
  // delete
  const handleDeleteUser = async (user_id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.delete(`http://localhost:5000/delete_user/${user_id}`);
      if (response.status === 200) {
        alert("User deleted successfully");
        setUsers((prevUsers) => prevUsers.filter(user => user.user_id !== user_id)); // UI Update
      } else {
        alert("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user", error);
      alert("Server Error");
    }

  };


  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const numA = parseInt(a.user_id.match(/\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.user_id.match(/\d+/)?.[0] || "0", 10);
  
    if (a.user_id.replace(/[0-9]/g, "") === b.user_id.replace(/[0-9]/g, "")) {
      return numA - numB;
    }
    return a.user_id.localeCompare(b.user_id);
  });


  const handleEditClick = (user) => {
    setEditUser({ ...user, password: "" }); // Existing user data + Empty password field
  };

  const handleUpdateUser = async () => {
    if (loading) return;
    console.log("Sending Data:", editUser); // Debugging
    setLoading(true);
    try {
      const updatedUser = {
        username: editUser.username,
        email: editUser.email,
      };
  
      if (editUser.password && editUser.password.trim() !== "") {
        updatedUser.password = editUser.password;
      }
  
      console.log("Final Data Sent to Backend:", updatedUser); // Debugging
  
      await axios.put(`http://localhost:5000/update_user/${editUser.user_id}`, updatedUser);
      if (editUser.password) {
        //  Send Email API Call
        await axios.post(`http://localhost:5000/emailsend/${editUser.user_id}`, {
          email: editUser.email,
          password: editUser.password,
        });
      alert("Your password has been updated and email sent successfully!");
    } else {
      alert("User details updated successfully!");
    }
      // setEditUser(null);
      setTimeout(() => setEditUser(null), 100);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user", error);
    } finally {
      setLoading(false);
    }
  };
// option is mysql connect
  useEffect(() => {
    // Fetch Unique Roles
    fetch("http://localhost:5000/api/roles")
        .then(response => response.json())
        
        .catch(error => console.error("Error fetching roles:", error));

    // Fetch Role-wise IDs
    fetch("http://localhost:5000/api/role-data")
        .then(response => response.json())
        
        .catch(error => console.error("Error fetching role data:", error));
}, []);

const filteredUsers = sortedUsers.filter((user) => 
  [user.username, user.email, user.role, user.user_id?.toString()]
    .some((field) => field?.toLowerCase().includes(searchTerm?.toLowerCase() || ""))
);
console.log("Filtered Users:", filteredUsers); // Debugging
  return (
    <>

      <div className="search-container">
      <input 
  type="text"
  className="search-input" 
  placeholder="Search user..." 
  value={searchTerm} 
  onChange={(e) => setSearchTerm(e.target.value)} 
/>
</div>
 
      <div className="table">
        <table border={1}>
          <thead>
            <tr>
              <th>Role</th>
              <th>Code</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th>Action</th>
            </tr>
          </thead>
          {filteredUsers.length === 0 ? (
  <p className="no-users">No users found!</p>
) : (
          <tbody>
          
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.role}</td>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td style={{ position: "relative" }}>******** <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick(user)} style={{ cursor: "pointer" }} className="edit-icon"/><span className="tooltip">Change Password</span></td>
                <td>
                  <button onClick={() => handleDeleteUser(user.user_id)} style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", color:"black", position: "relative" }} className="delete-btn">
                  <FontAwesomeIcon icon={faTrash} />
                  <span className="tooltip">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          )}
        </table>
      </div>
 
      {editUser && (
        <div className="edit-form">
          <h3>ChangePassword</h3>
          <label>Role:</label>
          <input type="text" value={editUser?.role || ""} readOnly />

          <label>Code:</label>
          <input type="text" value={editUser?.user_id || ""} readOnly />

          <label>Username:</label>
          <input type="text" value={editUser?.username || ""} readOnly />

          <label>Email:</label>
<input 
  type="email" 
  value={editUser.email}
  readOnly
  // onChange={(e) => {
  //   const newEmail = e.target.value;
  //   setEditUser({ ...editUser, email: newEmail });
  // }} 
/>
{/* Show validation error if email is not valid */}
{editUser.email && !validateEmail(editUser.email) && (
  <p style={{ color: "red" }}>Invalid Email Format! Example: user@example.com</p>
)}
          <label>New Password:</label>
          <input 
  type="password"
  placeholder="Enter new password"  
  value={editUser?.password || ""} 
  onChange={(e) => {
    const newPassword = e.target.value;
    
    setEditUser({ ...editUser, password: newPassword });
    
  }} 
/>

{editUser.password && !validatePassword(editUser.password) && (
  <p style={{ color: "red" }}>Password must be 8 characters long, include uppercase, lowercase, number, and special character.</p>
)}
          <button 
  onClick={handleUpdateUser} 
  disabled={!validateEmail(editUser.email) || (editUser.password && !validatePassword(editUser.password))}
>
  Save&SendEmail
</button>
          <button onClick={() => setEditUser(null)}>Cancel</button>
        </div>
      )}
{/* table */}

    <div className='upload'>
      <ul>
        <button><li>Upload</li></button>
        <button><li>Download</li></button>
       <button><li>DownloadTemplate</li></button> 
       <button><li>View</li></button> 
      </ul>
    </div>
    </>

  );
};