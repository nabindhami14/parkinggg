/* eslint-disable react/prop-types */
import moment from "moment";
import { FaCarSide } from "react-icons/fa";
import { RiMotorbikeFill } from "react-icons/ri";
import DeleteReservationModal from "./modals/DeleteReservationModal";
import ProceedsToCheckoutModal from "./modals/ProceedsToCheckoutModal";

function ReservationsList({ reservations }) {
  const IconMap = {
    car: <FaCarSide className="h-4 w-4" />,
    bike: <RiMotorbikeFill className="h-4 w-4" />,
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3 mt-8  underline underline-offset-4 ">
        Reservations
      </h2>
      <table className="min-w-full divide-y divide-gray-200 border-separate shadow-md rounded-md  ">
        <thead className="">
          <tr>
            <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider rounded-l-md">
              Vehicle
            </th>
            <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Start Time
            </th>
            <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              End Time
            </th>
            <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider">
              Total Cost
            </th>
            <th className="px-6 py-3 bg-zinc-900 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider rounded-r-md">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 ">
          {reservations.map((reservation) => (
            <tr key={reservation._id} className="hover:bg-purple-200">
              <td className="px-6 py-4 flex items-center gap-4 whitespace-no-wrap capitalize text-purple-900">
                {IconMap[reservation?.vehicle?.vehicleType] ?? IconMap["bike"]}
                {reservation?.vehicle?.model ?? "Yamaha"}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                {moment(reservation.startTime).format("D MMMM , h:mm A")}
              </td>
              <td className="px-6 whitespace-no-wrap">
                {moment(reservation.endTime).format("D MMMM , h:mm A")}
              </td>
              <td className="px-6 whitespace-no-wrap">{reservation.status}</td>
              <td className="px-6 whitespace-no-wrap text-green-700 font-mono flex">
                {reservation.parkingSpot.isFree ? (
                  <h4>FREE</h4>
                ) : (
                  <>
                    <h4 className="text-black mr-1">Rs.</h4>
                    {reservation.status === "COMPLETED" &&
                    reservation.paymentStatus === "COMPLETED"
                      ? reservation?.actualCost.toFixed(2)
                      : reservation.totalCost.toFixed(2)}
                  </>
                )}
              </td>

              <td className="px-6 whitespace-no-wrap">
                {reservation.status === "PENDING" && (
                  <DeleteReservationModal id={reservation._id} />
                )}

                {reservation.status === "PARKING" &&
                  reservation.paymentStatus === "PENDING" && (
                    <ProceedsToCheckoutModal id={reservation._id} />
                  )}

                {reservation.status === "COMPLETED" &&
                  reservation.paymentStatus === "COMPLETED" && (
                    <button
                      type="button"
                      disabled
                      className="px-4 py-1 rounded-md text-white bg-green-600 hover:bg-green-700 transition-all ease-in-out"
                    >
                      COMPLETED
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationsList;
