import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route
          path="/chats"
          element={<ProtectedRoute Component={ChatPage} />}
        />
      </Routes>
    </div>
  );
}

export default App;
