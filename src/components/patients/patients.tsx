import AppTable from "../table/table";
import { useState } from "react";
import axiosInstance from "../../utils/axios";
import ToastNotification from "../toast/toast";
import type { NotificationType } from "../toast/toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Patient {
  key: string;
  name: string;
  idNumber: string;
  gender: string;
  contact: string;
  uuid: string;
}

interface Toast {
  type: NotificationType;
  open: boolean;
  message: string;
  description: string;
}

const columns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "ID Number", dataIndex: "idNumber", key: "idNumber" },
  { title: "Gender", dataIndex: "gender", key: "gender" },
  { title: "Contact", dataIndex: "contact", key: "contact" },
];

const PatientTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState<Toast>({
    type: "success",
    open: false,
    message: "",
    description: "",
  });
  const navigate = useNavigate();

  const fetchData = async (page: number, pageSize: number, search?: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/patients/", {
        params: { page, limit: pageSize, search },
      });

      const json = res.data;
      setData(json.items);
      setTotal(json.total);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setToast((prev) => ({ ...prev, open: false }));
      setTimeout(() => {
        setToast({
          type: "error",
          message: "User Registration",
          description: msg,
          open: true,
        });
      }, 10);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, 10);
  }, []);

  const handleView = (record: Patient) => {
    navigate(`/patients/${record?.uuid}`);
  };

  return (
    <>
      <AppTable
        title="Patients"
        subTitle="List of registered patients"
        columns={columns}
        onView={handleView}
        addNewPath="/patients/new-patient"
        createLabel="Patient"
        data={data}
        total={total}
        pageSize={10}
        loading={loading}
        onFetchData={fetchData}
      />
      <ToastNotification
        type={toast.type}
        open={toast.open}
        message={toast.message}
        description={toast.description}
      />
    </>
  );
};

export default PatientTable;
