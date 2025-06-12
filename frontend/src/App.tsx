import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Room from "./pages/Room";
import { Toaster } from "./components/ui/sonner";


export default function App() {

  return (
    <div>
      <Navbar />
      <div className="py-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/room/:id" element={<Room />}/>
        </Routes>
      </div>
      <Toaster position="top-center"/>
    </div>
  );
}
