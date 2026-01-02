"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: "availableVehicle" | "inUse" | "maintenanceVehicle";
  driver?: string;
}

const VehicleAllocationPage = () => {
  const [vehicle] = useState<Vehicle[]>([
    { id: "1", name: "Truck A", type: "Truck", status: "availableVehicle" },
    {
      id: "2",
      name: "Van B",
      type: "Van",
      status: "inUse",
      driver: "John Doe",
    },
    { id: "3", name: "Car C", type: "Car", status: "maintenanceVehicle" },
  ]);
  const getStatusColor = (status: Vehicle["status"]) => {
    const colors = {
      availableVehicle: "bg-green-200 text-green-800",
      inUse: "bg-yellow-100 text-yellow-800",
      maintenanceVehicle: "bg-red-100 text-red-800",
    };
    return colors[status];
  };
  return (
    <div className="p-6">
      {/* /stats overview  */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-sm text-gray-600 bg-green-50 p-4 rounded-lg">
          <p className="text-2xl font-bold">Available</p>
          <p className="text-2xl font-bold">
            {vehicle.filter((v) => v.status === "availableVehicle").length}
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600">In Use</p>
          <p className="text-2xl font-bold">
            {vehicle.filter((v) => v.status === "inUse").length}
          </p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-600">Under Maintenance</p>
          <p className="text-2xl font-bold">
            {vehicle.filter((v) => v.status === "maintenanceVehicle").length}
          </p>
        </div>
      </div>

      {/* vehicle table */}

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-2xl font-semibold mb-4">Vehicle List</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicle.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.id}</TableCell>
                <TableCell>{v.name}</TableCell>
                <TableCell>{v.type}</TableCell>
                <TableCell className={getStatusColor(v.status)}>
                  {v.status}
                </TableCell>
                <TableCell>{v.driver || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VehicleAllocationPage;
