import React, { useEffect, useState } from "react";
import axios from "axios";

function MessageComponent({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Get token from local storage
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  const fetchMessages = async (chatId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5002/api/message/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post(
        "http://localhost:5002/api/message",
        { content: newMessage, chat: selectedChat._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages([...messages, data.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 border border-gray-300">
        {messages.length ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender._id ===
                JSON.parse(localStorage.getItem("userInfo"))._id
                  ? "justify-end"
                  : "justify-start"
              } mb-4`}
            >
              <div
                className={`p-3 rounded-lg ${
                  msg.sender._id ===
                  JSON.parse(localStorage.getItem("userInfo"))._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>

      {/* Chat Input */}
      <div className="py-4 border-t border-gray-300">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageComponent;
