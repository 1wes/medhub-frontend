import AppTable from "../table/table";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import ToastNotification from "../toast/toast";
import type { NotificationType } from "../toast/toast";
import { useNavigate } from "react-router-dom";
interface Visit {
  key: string;
  uuid: string;
  patient_uuid: string;
  patient_name: string;
  patient_id_number: string;
  visit_date: string;
  diagnosis: string;
  prescribed_medications: string;
}

interface Toast {
  type: NotificationType;
  open: boolean;
  message: string;
  description: string;
}

const columns = [
  { title: "Patient Name", dataIndex: "patient_name", key: "patient_name" },
  {
    title: "Patient ID",
    dataIndex: "patient_id_number",
    key: "patient_id_number",
  },
  { title: "Date", dataIndex: "visit_date", key: "visit_date" },
  { title: "Diagnosis", dataIndex: "diagnosis", key: "diagnosis" },
  {
    title: "Medication",
    dataIndex: "prescribed_medications",
    key: "prescribed_medications",
  },
];

const VisitsTable = () => {
  const [data, setData] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState<Toast>({
    type: "success",
    open: false,
    message: "",
    description: "",
  });

  const navigate = useNavigate();

  const fetchData = async (
    page: number,
    pageSize: number,
    search?: string,
    range?: [string, string]
  ) => {
    setLoading(true);
    try {
      const params: any = { page, limit: pageSize };
      if (search) params.search = search;
      if (range) {
        params.startDate = range[0];
        params.endDate = range[1];
      }

      const res = await axiosInstance.get("/api/visits/", { params });
      const json = res.data;
      setData(json.items);
      setTotal(json.total);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setToast((prev) => ({ ...prev, open: false }));
      setTimeout(() => {
        setToast({
          type: "error",
          message: "Failed",
          description: msg,
          open: true,
        });
      }, 10);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, 10, undefined);
  }, []);

  const handleView = (record: Visit) => {
    navigate(`/visits/${record.uuid}`);
  };

  return (
    <>
      <AppTable
        title="Visits"
        subTitle="All recorded patient visits"
        columns={columns}
        onView={handleView}
        addNewPath={undefined}
        createLabel=""
        data={data}
        total={total}
        pageSize={10}
        loading={loading}
        filterDateRange={true}
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

export default VisitsTable;
