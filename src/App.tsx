import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginComponent from "./components/auth/login/login";
import RegisterComponent from "./components/auth/register/register";
import MainLayout from "./components/layout/layout";
import Dashboard from "./components/dashboard/dashboard";
import MhPatients from "./components/patients/patients";
import MhVisits from "./components/visits/visits";
import MhAddPatientForm from "./components/patients/new-patient";
import MhPatientDetails from "./components/patients/patient-details";
import MhVisitDetails from "./components/visits/visit-details";

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
            <Route path="patients/new-patient" element={<MhAddPatientForm />} />
            <Route path="/visits" element={<MhVisits />} />
            <Route path="/patients/:uuid" element={<MhPatientDetails />} />
            <Route path="/visits/:uuid" element={<MhVisitDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
