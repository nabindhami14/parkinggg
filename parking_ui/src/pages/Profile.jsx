import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { FaCar, FaCreativeCommonsSampling } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import { completePayment, getProfile } from "../api";
import Loading from "../components/Loading";
import ReservationsList from "../components/ReservationList";
import UserDocuments from "../components/UserDocuments";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const queryParams = new URLSearchParams(location.search);

  const pidx = queryParams.get("pidx");
  const amount = queryParams.get("amount");
  const transaction_id = queryParams.get("transaction_id");
  const purchase_order_id = queryParams.get("purchase_order_id");
  const purchase_order_name = queryParams.get("purchase_order_name");

  const { mutate } = useMutation({
    mutationFn: completePayment,
    onSuccess: () => {
      navigate(location.pathname, { replace: true });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err) => {
      console.log("error while creating vehicle", err);
    },
  });

  useEffect(() => {
    if (
      pidx &&
      amount &&
      transaction_id &&
      purchase_order_id &&
      purchase_order_name
    ) {
      mutate({
        pidx,
        amount,
        transaction_id,
        purchase_order_id,
        purchase_order_name,
      });
    }
  }, [
    pidx,
    amount,
    transaction_id,
    purchase_order_id,
    purchase_order_name,
    mutate,
  ]);

  const { data, isLoading, isError, error } = useQuery(["profile"], getProfile);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const user = data.data.user;
  let totalExpenses = 0;

  if (user && user?.reservations) {
    const reservations = user?.reservations.filter((reservation) => {
      const isSpotFree = reservation.parkingSpot.isFree;
      const isCompleted =
        reservation.status === "COMPLETED" &&
        reservation.paymentStatus === "COMPLETED";

      return !isSpotFree && isCompleted;
    });

    for (const reservation of reservations) {
      totalExpenses += reservation?.actualCost;
    }
  }

  return (
    <div className="w-11/12 mx-auto my-10 space-y-6">
      <h2 className="text-2xl font-semibold font-serif text-green-700 py-4 px-4 mb-10 w-1/5 border border-purple-600 shadow-md rounded-md justify-center flex ">
        {user?.name}
      </h2>
      {user?.vehicles?.length < 1 && user?.reservations.length < 1 && (
        <p className="text-rose-500">Nothing to render!!</p>
      )}
      {user?.vehicles.length > 0 && (
        <div className="grid sm:grid-cols-[1fr_1fr_1fr] gap-10  ">
          <div
            className={`flex items-center gap-4 shadow-md py-4 px-4 rounded-md cursor-pointer transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-100 hover:bg-purple-200 duration-300 ...`}
          >
            <FaCar className="w-10 h-10" />
            <div className="flex flex-col">
              <div className="text-2xl font-semibold">Vehicles Registered</div>
              <div className="text-xl font-mono text-green-700">
                {user.vehicles.length}
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-4 shadow-md py-4 px-4 rounded-md cursor-pointer transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-100 hover:bg-purple-200 duration-300 ...`}
          >
            <FaCreativeCommonsSampling className="w-10 h-10" />
            <div className="flex flex-col">
              <div className="text-2xl font-semibold">Total Reservations</div>
              <div className="text-xl text-green-700 font-mono">
                {user.reservations.length}
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-4 shadow-md py-4 px-4 rounded-md cursor-pointer transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-100 hover:bg-purple-200 duration-300 ...`}
          >
            <div className="flex flex-col">
              <div className="text-2xl font-semibold">Total Expenses</div>
              <div className="value flex text-2xl font-semibold font-mono ">
                <h3 className=" text-black ">Rs.</h3>
                <div className=" text-green-600 ">
                  {totalExpenses.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table showing reservations */}
      {user?.reservations.length > 0 ? (
        <ReservationsList reservations={user.reservations} />
      ) : (
        <p className="text-rose-500">No reservations yet</p>
      )}

      <UserDocuments />
    </div>
  );
};

export default Profile;
