import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";

function ChatPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const token = JSON.parse(localStorage.getItem("token"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (userInfo) {
      setLoggedInUser(userInfo);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5002/api/users", {
          params: { search: searchQuery },
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [searchQuery, token]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [users, searchQuery]);

  const handleUserClick = async (user) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5002/api/chat",
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(data);
      setSelectedUser(user);
    } catch (error) {
      console.error("Error creating or fetching chat:", error);
    }
  };

  return (
    <ChatBox
      selectedChat={selectedChat}
      selectedUser={selectedUser}
      handleUserClick={handleUserClick}
      users={users}
      filteredUsers={filteredUsers}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      loggedInUser={loggedInUser}
    />
  );
}

export default ChatPage;
