

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MessageComponent from "./MessageComponent";

function ChatBox({
  selectedChat,
  selectedUser,
  handleUserClick,
  filteredUsers,
  searchQuery,
  setSearchQuery,
  loggedInUser,
  token,
  socket, // add socket prop here
}) {
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const navigate = useNavigate(); 

  // handle clicking on a profile picture to show/hide the profile card
  const handleProfileClick = (user) => {
    setSelectedProfileUser((prevUser) => (prevUser === user ? null : user));
  };

  // logout 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Users Section */}
      <div className="w-1/4 bg-white shadow-md p-4 overflow-y-auto">
        {/* loggedIn User Profile */}
        {loggedInUser && (
          <div className="relative mb-4">
            <div className="flex items-center mb-4">
              <div
                className="flex relative cursor-pointer"
                onClick={() => handleProfileClick(loggedInUser)}
              >
                <img
                  src={loggedInUser.pic}
                  className="w-12 h-12 rounded-full"
                  alt={loggedInUser.name}
                />
                {selectedProfileUser === loggedInUser && (
                  <div className="absolute left-14 bg-white border rounded-lg shadow-md p-2">
                    <p className="font-bold">{loggedInUser.name}</p>
                    <p>{loggedInUser.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold mb-4">Friends</h2>

        {/* search bar */}
        <input
          type="text"
          className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* User list */}
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="relative flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              <div
                className="relative cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering user click event
                  handleProfileClick(user);
                }}
              >
                <img
                  src={
                    user.pic ||
                    "https://avatar.iran.liara.run/public/boy?username=Ash"
                  }
                  className="w-12 h-12 rounded-full mr-3"
                  alt={user.name}
                />
                {/* {selectedProfileUser === user && (
                  <div className="absolute left-14 bg-white border rounded-lg shadow-md p-3">
                    <p className="font-bold">{user.name}</p>
                    <p>{user.email}</p>
                  </div>
                )} */}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Chat Box Section */}
      <div className="w-3/4 bg-gray-200 p-4 flex flex-col">
        {selectedChat && selectedUser ? (
          <div className="flex flex-col h-full border border-gray-300 rounded-lg bg-white">
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-300">
              <img
                src={selectedUser.pic}
                className="w-16 h-16 rounded-full mr-4"
                alt={selectedUser.name}
              />
              <span className="text-xl font-semibold">{selectedUser.name}</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <MessageComponent selectedChat={selectedChat} socket={socket} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <p className="text-xl font-semibold mb-2">No Chat Selected</p>
              <p>Select a user to start chatting</p>
            </motion.div>
           
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBox;


