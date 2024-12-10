import { useQuery } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa";

import { getFeedbacks } from "../api";
import Loading from "./Loading";

// eslint-disable-next-line react/prop-types
function Feedbacks({ spotId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["spots", spotId, "feedbacks"],
    queryFn: () => getFeedbacks(spotId),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mt-8 shadow-md rounded-md">
      <div className="grid sm:grid-cols-2 gap-4">
        {data?.data?.length > 0 &&
          data?.data?.map((f) => (
            <div
              key={f._id}
              className="flex items-center justify-between gap-2 border rounded-md p-1"
            >
              <div className="flex items-center gap-2">
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/corporate-user-icon.png"
                  alt="user"
                  className="w-20 h-20 rounded-md border border-purple-400 p-1"
                />

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{f.user.name}</h3>
                    <div className="flex">
                      {Array.from({ length: f.rating }).map((r, i) => (
                        <FaStar key={i} size={15} className="text-yellow-500" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p>{f.message}</p>

                    <time className="text-sm text-gray-400">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>

              <button className="mr-4 px-4 py-2 bg-red-600 rounded-md">
                Delete Feedback
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Feedbacks;
