import { useQuery } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getUsers } from "../api";
import ErrorComponent from "./ErrorComponent";
import EditVerification from "./modal/EditVerification";

const Customers = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryFn: getUsers,
    queryKey: ["users"],
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (isError) {
    return <ErrorComponent label="Customers" error={error} />;
  }

  return (
    <div className="my-10">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <div className="border border-gray-300 rounded-lg my-4 overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-sm">
            <tr>
              <th className="px-4 py-2 border">Customer Name</th>
              <th className="px-4 py-2 border">Total Vehicles</th>
              <th className="px-4 py-2 border">Total Reservations</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((customer) => (
              <tr className="text-base" key={customer._id}>
                <td className="border px-4 py-2 text-blue-600 hover:underline">
                  <Link to={`/customers/${customer._id}`}>{customer.name}</Link>
                </td>
                <td className="border px-4 py-2">{customer.vehicles.length}</td>
                <td className="border px-4 py-2">
                  {customer.reservations.length}
                </td>
                <td className="border px-4 py-2">
                  {customer.isVerified ? (
                    <p className="text-green-400">VERIFIED</p>
                  ) : (
                    <EditVerification id={customer._id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
