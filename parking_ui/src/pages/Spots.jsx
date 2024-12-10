import { useQuery } from "@tanstack/react-query";

import { getParkingSpots } from "../api";

import Loading from "../components/Loading";
import ParkingSpotCard from "../components/ParkingSpotCard";

const Spots = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["spots"],
    queryFn: getParkingSpots,
  });

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="grid md:grid-cols-3 w-11/12 mx-auto gap-6 my-10">
      {data.data.map((s) => (
        <ParkingSpotCard key={s._id} spot={s} />
      ))}
    </div>
  );
};

export default Spots;
