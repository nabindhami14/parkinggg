import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../api";
import Loading from "../components/Loading";
import ReservationsList from "../components/ReservationList";

const Parking = () => {
  const { data, isLoading } = useQuery({
    queryFn: getProfile,
    queryKey: ["profile"],
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="my-10 w-11/12 mx-auto ">
      {data.data.user.reservations.length > 0 ? (
        <ReservationsList reservations={data.data.user.reservations} />
      ) : (
        <p className="text-rose-500">No reservations yet</p>
      )}
    </div>
  );
};

export default Parking;
