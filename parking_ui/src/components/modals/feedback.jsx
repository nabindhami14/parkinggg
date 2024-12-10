import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { FaStar } from "react-icons/fa";
import { getFeedbacks, giveFeedbacks } from "../../api";
import { userStore } from "../../store/userStore";
import Loading from "../Loading";

// eslint-disable-next-line react/prop-types
function FeedbackForm({ spotId }) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const { accessToken, user } = userStore();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: giveFeedbacks,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["spots", spotId, "feedbacks"],
      });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["spots", spotId, "feedbacks"],
    queryFn: () => getFeedbacks(spotId),
  });

  if (isLoading) {
    return <Loading />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate({ spotId, rating, message });
  };

  const feedbackExists = data?.data.some((item) => item?.user?._id === user?._id);

  return (
    <div className="mt-8 shadow-md rounded-md">
      {(!feedbackExists && accessToken) && (
        <form onSubmit={handleSubmit}>
          <h2>How would you rate our service?</h2>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className="py-2"
            >
              <FaStar
                size={30}
                className={` ${
                  num <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <div className="mb-4">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your feedback"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {data?.data?.length > 0 &&
          data?.data?.map((f) => (
            <div key={f._id} className="flex gap-2 border rounded-md p-1">
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
          ))}
      </div>
    </div>
  );
}

export default FeedbackForm;
