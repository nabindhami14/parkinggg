import { useQuery } from "@tanstack/react-query";

import { getParkingSpots } from "../api";
import ErrorComponent from "../components/ErrorComponent";
import Loading from "../components/Loading";
import Spot from "../components/Spot";

const ParkingSpots = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["spots"],
    queryFn: getParkingSpots,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorComponent label="Parking Places" error={error} />;
  }

  return (
    <section className="my-10">
      <div className="grid md:grid-cols-4 gap-4">
        {data.data.map((spot) => (
          <Spot key={spot._id} spot={spot} />
        ))}
      </div>
    </section>
  );
};

export default ParkingSpots;
