import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Loginpage";
import Register from "./pages/Registerpage";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Tasks from "./pages/Task";
import Finance from "./pages/Finance";  
import Calendar from "./components/Calendar";
import Performance from "./pages/Performance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected layout */}
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="finance" element={<Finance />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="performance" element={<Performance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
