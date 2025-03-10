import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editable, setEditable] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

  const handleSave = () => {
    // Save updated user info back to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    setEditable(false); 
  };

  return user ? (
    <div className="max-w-md mx-auto p-8 rounded-xl">
      <h2 className="text-2xl mb-4">Profile</h2>
      <div className="flex items-center mb-4">
        <img
          src={user.profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full mr-4"
        />
        <div>
          <h3 className="text-xl">Profile Picture</h3>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Username</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          disabled={!editable}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          disabled={!editable} 
        />
      </div>

      {editable ? (
        <button
          onClick={handleSave}
          className="w-full py-2 bg-green-500 text-white rounded mb-4"
        >
          Save
        </button>
      ) : (
        <button
          onClick={() => setEditable(true)}
          className="w-full py-2 bg-blue-500 text-white rounded mb-4"
        >
          Edit Profile
        </button>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login"); 
        }}
        className="w-full py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Profile;
