/* eslint-disable react/prop-types */

import { FaCreativeCommonsRemix, FaSpaceShuttle } from "react-icons/fa";

import Card from "./Card";
import ParkingMap from "./Map/parkingMap";
import FeedbackForm from "./modals/feedback";
import ReservationControl from "./ReservationControl";
import mock from "/mock.jpg";

const ParkingPlaceDetails = ({ spot }) => {
  return (
    <div className="w-full overflow-hidden space-y-6">
      {spot.available ? (
        <div className="flex items-center gap-4 px-4 py-2 bg-green-600">
          <FaCreativeCommonsRemix className="h-8 w-8" />
          <p className="text-xl text-white rounded-sm">Available</p>
        </div>
      ) : (
        <div className="flex items-center gap-4 px-4 py-2 bg-red-600">
          <FaSpaceShuttle className="h-8 w-8" />
          <p className="text-xl text-white rounded-sm">Unavailable</p>
        </div>
      )}

      <div className="image-map grid sm:grid-cols-[1fr_1fr] gap-2">
        {spot.imageUrls.length > 0 ? (
          <img
            className="w-half grid h-96 object-cover object-center mb-1 rounded-md shadow-md"
            src={spot.imageUrls[0]}
            alt={spot.name}
          />
        ) : (
          <img
            className="w-half h-96 object-cover object-center mb-1"
            src={mock}
            alt={spot.name}
          />
        )}

        <ParkingMap coordinates={spot.location.coordinates} />
      </div>

      <div className="grid sm:grid-cols-2 gap-10">
        <div className="">
          <h2 className="text-2xl">{spot.name}</h2>
          <p className="text-base text-gray-800">{spot.location.city}</p>
          <p className="mt-2 text-gray-500">{spot.description}</p>
        </div>
        <div className="flex flex-col gap-4 mt-10">
          <div className="flex items-center text-green-500">
            <div className="text-3xl text-black">
              {spot.isFree ? (
                "FREE"
              ) : (
                <>
                  <p>BIKE {spot.pricePerHour.bike}/hr</p>
                  <p>CAR {spot.pricePerHour.car}/hr</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {spot.features.map((feature, index) => (
              <span
                key={index}
                className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs mr-2 mb-2"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-10 my-10">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl">Total Capacity</h2>
          <Card vehicleType="car" total={spot.capacity.car} />
          <Card vehicleType="bike" total={spot.capacity.bike} />
        </div>
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl">Total Reservations</h2>
          <Card vehicleType="car" total={spot.reservations.car.length} />
          <Card vehicleType="bike" total={spot.reservations.bike.length} />
        </div>
      </div>

      <ReservationControl spot={spot} />

      <FeedbackForm spotId={spot._id} />
    </div>
  );
};

export default ParkingPlaceDetails;
