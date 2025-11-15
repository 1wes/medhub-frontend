import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginComponent from "./components/auth/login/login";
import RegisterComponent from "./components/auth/register/register";
import MainLayout from "./components/layout/layout";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/" element={<MainLayout />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
