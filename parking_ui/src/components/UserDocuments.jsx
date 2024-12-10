import { useQuery } from "@tanstack/react-query";

import { getDocuments } from "../api";
import Loading from "./Loading";

const UserDocuments = () => {
  const { data, isLoading } = useQuery({
    queryFn: getDocuments,
    queryKey: ["profile"],
  });

  if (isLoading) {
    return <Loading />;
  }
  console.log(data.data.front);

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
