import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import People from "./pages/People";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tarefas" element={<Tasks />} />
        <Route path="/pessoas" element={<People />} />

      </Routes>
    </BrowserRouter>
  );
}
