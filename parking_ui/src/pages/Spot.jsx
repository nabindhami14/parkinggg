import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getParkingSpot } from "../api";
import Loading from "../components/Loading";
import ParkingPlaceDetails from "../components/ParkingPlaceDetails";

const Spots = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["spots", id],
    queryFn: () => getParkingSpot(id),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-11/12 mx-auto my-10">
      <ParkingPlaceDetails spot={data.data} />
    </div>
  );
};

export default Spots;
