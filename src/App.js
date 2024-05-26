import "./App.css";
import Login from "./components/login";
import ChatRoom from "./components/chat-room";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/provider/AuthProvider";
import AppProvider from "./components/provider/AppProvider";
import AddRoomModal from "./components/modals/AddRoomModal";
import InviteMemberModal from "./components/modals/InviteMemberModal";

function App() {
  return <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/" element={<ChatRoom />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <AddRoomModal />
        <InviteMemberModal />
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>;
}

export default App;
