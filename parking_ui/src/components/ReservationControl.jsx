/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { FaHammer, FaTruckLoading } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { getReservtions } from "../api";
import { userStore } from "../store/userStore";
import Loading from "./Loading";
import ReservationModal from "./modals/ReservationModal";

const ReservationControl = ({ spot }) => {
  const { accessToken, user } = userStore();
  const navigate = useNavigate();

  const { isPending, data } = useQuery({
    queryKey: ["reservations"],
    queryFn: getReservtions,
  });

  if (isPending) return <Loading />;

  const hasPendingReservation = data?.data?.reservations?.some((reservation) =>
    ["PENDING", "PARKING"].includes(reservation.status)
  );

  if (!accessToken) {
    return (
      <div
        className="flex items-center gap-4 px-4 py-2 bg-yellow-600 cursor-pointer"
        onClick={() => navigate("/signin")}
      >
        <FaHammer className="h-8 w-8" />
        <p className="text-xl text-white rounded-sm">Please sign in first</p>
      </div>
    );
  }

  if (!user?.isVerified) {
    return (
      <div
        className="flex items-center gap-4 px-4 py-2 bg-yellow-600 cursor-pointer"
        onClick={() => navigate("/documents")}
      >
        <FaHammer className="h-8 w-8" />
        <p className="text-xl text-white rounded-sm">
          You are not verified yet! Please verify with your documents first!!
        </p>
      </div>
    );
  }

  if (hasPendingReservation) {
    return (
      <div
        className="flex items-center gap-4 px-4 py-2 bg-yellow-600 cursor-pointer"
        disabled
      >
        <FaTruckLoading className="h-5 w-5" color="white" />
        <p className="text-xl text-white rounded-sm">Already in Parking</p>
      </div>
    );
  }

  return <ReservationModal id={spot._id} />;
};

export default ReservationControl;
