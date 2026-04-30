import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}