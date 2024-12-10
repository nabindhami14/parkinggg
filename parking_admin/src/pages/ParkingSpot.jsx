import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getParkingSpot } from "../api";

import ErrorComponent from "../components/ErrorComponent";
import Loading from "../components/Loading";
import ParkingSpotInfo from "../components/ParkinsSpotInfo";

const ParkingSpot = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["spots", id],
    queryFn: () => getParkingSpot(id),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorComponent label="Reservations" error={error} />;
  }
  return <ParkingSpotInfo spot={data.data} />;
};

export default ParkingSpot;
