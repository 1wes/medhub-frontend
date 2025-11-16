import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginComponent from "./components/auth/login/login";
import RegisterComponent from "./components/auth/register/register";
import MainLayout from "./components/layout/layout";
import Dashboard from "./components/dashboard/dashboard";
import MhPatients from "./components/patients/patients";
import MhVisits from "./components/visits/visits";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/patients" element={<MhPatients />} />
            <Route path="/visits" element={<MhVisits />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
