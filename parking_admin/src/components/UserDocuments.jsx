import { useQuery } from "@tanstack/react-query";

import { getDocuments } from "../api";
import Loading from "./Loading";

// eslint-disable-next-line react/prop-types
const UserDocuments = ({ userId }) => {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getDocuments(userId),
    queryKey: [userId, "documents"],
  });

  if (isLoading) {
    return <Loading />;
  }
  if (!data?.data?.front || isError) {
    return <h2>Doesnt have documents uploaded yet!</h2>;
  }

  return (
    <div className="grid grid-cols-2 gap-10">
      <img
        src={data.data.front}
        alt="front"
        className="h-full w-full rounded-md"
      />
      <img
        src={data.data.back}
        alt="back"
        className="h-full w-full rounded-md"
      />
    </div>
  );
};

export default UserDocuments;
