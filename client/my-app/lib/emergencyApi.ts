import axios from "axios";

export const reportEmergency = async (data: {
  type: string;
  severity: string;
  location: { lat: number; lng: number };
  description: string;
}) => {
  const res = await axios.post(
    "http://localhost:5000/api/emergencies",
    data,
    { withCredentials: true }
  );

  return res.data;
};
