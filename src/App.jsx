import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainLayout from "./shared/MainLayout";
import UserHome from "./pages/UserHomePage/UserHomePage";
import ProfilePage from "./pages/Profile/Profile";
import MessagesPage from "./pages/MessagesPage/MessagesPage";
import AdminHome from "./pages/AdminHomePage/AdminHomePage";
import AdminLayout from "./shared/AdminLayout";
import AddReelPage from "./pages/AddReelPage/AddReelPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import FetchReelsContextProvider from "./context/FetchReelsContext";
import UploadReelContextProvider from "./context/UploadReelContext";
import ModaLReelContextProvider from "./context/ModalReelContext";

function App() {
  return (
   <ModaLReelContextProvider>
     <UploadReelContextProvider>
      <FetchReelsContextProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="messages" element={<MessagesPage />} />

            {/* User Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<UserHome />} /> {/* Default child route */}
              <Route path="profile/:id" element={<ProfilePage />} />
              <Route path="addReels" element={<AddReelPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />{" "}
              {/* Default child route */}
              <Route path="profile" element={<ProfilePage />} />
              <Route path="messages" element={<MessagesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FetchReelsContextProvider>
    </UploadReelContextProvider>
   </ModaLReelContextProvider>
  );
}

export default App;
