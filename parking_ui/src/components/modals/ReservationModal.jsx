import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { FaHammer } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import { getProfile, privateAxios } from "../../api";
import { toLocalISOString } from "../../utils/date";
import Loading from "../Loading";

const dialogTransitionConfig = {
  enter: "ease-out duration-300",
  enterFrom: "opacity-0 scale-95",
  enterTo: "opacity-100 scale-100",
  leave: "ease-in duration-200",
  leaveFrom: "opacity-100 scale-100",
  leaveTo: "opacity-0 scale-95",
};

const overlayTransitionConfig = {
  enter: "ease-out duration-300",
  enterFrom: "opacity-0",
  enterTo: "opacity-100",
  leave: "ease-in duration-200",
  leaveFrom: "opacity-100",
  leaveTo: "opacity-0",
};

// eslint-disable-next-line react/prop-types
const ReservationModal = ({ id }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const [formData, setFormData] = useState({
    parkingSpotId: id,
    vehicleId: "",
    startTime: null,
    endTime: null,
  });

  const fetchVehicle = async () => {
    try {
      const res = await privateAxios.get(`vehicles/u/p`);
      return res.data.vehicles;
    } catch (error) {
      console.log("error while fetching vehicles", error);
    }
  };

  const {
    data: vehicles,
    isError: isVehicleError,
    error: vehicleError,
    isLoading: isVehicleLoading,
  } = useQuery(["vehicles"], fetchVehicle);

  const { data: user, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const handleVehicleChange = (selectedOption) => {
    setFormData({
      ...formData,
      vehicleId: selectedOption.value,
    });
  };

  const { isLoading, isError, error, mutate } = useMutation({
    mutationFn: (data) => {
      return privateAxios.post("/reservations", data);
    },
    onSuccess: () => {
      closeModal();
      navigate("/profile");
      toast.success("Reservation Successful");
    },
    onError: (err) => {
      toast.error("Error while reservation");
      console.log("error while creating vehicle", err);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentTime = new Date();
    const currentTimePlusOneMinute = new Date(
      currentTime.getTime() + 1 * 60000
    );
    const currentTimePlusTwentyFiveMinutes = new Date(
      currentTime.getTime() + 25 * 60000
    );

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (startTime < currentTimePlusOneMinute) {
      toast.error("Start time must be at least 1 minute from the current time");
      return;
    }

    if (endTime < currentTimePlusTwentyFiveMinutes) {
      toast.error("End time must be at least 25 minutes from the current time");
      return;
    }

    mutate(formData);
  };

  let vehicleOptions;
  if (vehicles) {
    vehicleOptions = vehicles.map((vehicle) => ({
      value: vehicle._id,
      label: vehicle.model,
    }));
  }

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return toLocalISOString(today).slice(0, 16);
  };

  const getMinDateTime = () => {
    const now = new Date();
    return toLocalISOString(now).slice(0, 16);
  };

  if (isLoading || isVehicleLoading || isProfileLoading) {
    return <Loading />;
  }

  const isPending = user.data.user.reservations.some(
    (reservation) => reservation.status === "Pending"
  );

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  if (isVehicleError) {
    return <span>Error: {vehicleError.message}</span>;
  }

  if (vehicles.length < 1) {
    return (
      <div
        className="flex items-center gap-4 px-4 py-2 bg-yellow-600 cursor-pointer"
        onClick={() => navigate("/vehicles")}
      >
        <FaHammer className="h-8 w-8" />
        <p className="text-xl text-white rounded-sm">
          Please register a vehicle first
        </p>
      </div>
    );
  }

  return (
    <>
      {isPending ? (
        <button
          type="button"
          disabled={isPending}
          className="w-full py-2 transition-all ease-in-out rounded-md disabled:bg-gray-400"
        >
          Vehicle Already in Parking!!
        </button>
      ) : (
        <button
          type="button"
          onClick={openModal}
          disabled={isLoading || vehicles.length < 1}
          className="w-full text-white bg-green-600 py-2 hover:bg-green-700 transition-all ease-in-out rounded-md disabled:bg-gray-400"
        >
          Reserve Parking
        </button>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child as={Fragment} {...overlayTransitionConfig}>
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm ">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child as={Fragment} {...dialogTransitionConfig}>
                <Dialog.Panel
                  style={{ height: "550px" }}
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-900 text-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-2"
                  >
                    <label className="block">Select Vehicle:</label>
                    <Select
                      required
                      placeholder="Select which vehicle"
                      options={vehicleOptions}
                      value={vehicleOptions.find(
                        (option) => option.value === formData.vehicleId
                      )}
                      onChange={handleVehicleChange}
                      className="border text-black placeholder:text-white"
                    />
                    <label className="block">Start Time:</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startTime}
                      onChange={(event) =>
                        handleDateChange(event.target.value, "startTime")
                      }
                      min={getMinDateTime()}
                      max={getMaxDate()}
                      className="w-full p-2 text-black border-0 rounded-sm"
                    />
                    <label className="block">End Time:</label>
                    <input
                      required
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(event) =>
                        handleDateChange(event.target.value, "endTime")
                      }
                      min={getMinDateTime()}
                      max={getMaxDate()}
                      className="w-full p-2 text-black border-0 rounded-sm"
                    />

                    <button
                      disabled={isLoading}
                      type="submit"
                      className="px-4 py-2 border border-transparent bg-purple-600 text-sm font-medium hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Submit Reservation
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ReservationModal;
