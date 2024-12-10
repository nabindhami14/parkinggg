import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { privateApi } from "../api";

const SpotForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [places, setPlaces] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    spotType: "Indoor",
    carPricePerHour: 10,
    bikePricePerHour: 15,
    isFree: false,
    features: "",
    carCapacity: 10,
    bikeCapacity: 10,
    imageUrls: "",
    coordinates: "",
  });

  const handleInputChange = async (e) => {
    const { name, value, checked, type } = e.target;

    let parsedValue = value;
    if (type === "number") {
      parsedValue = parseFloat(value);
    } else if (name === "isFree") {
      parsedValue = checked;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));

    if (name === "location") {
      try {
        const res = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${value}&key=a720b65e76f645f086d299956c1a2dc4`
        );

        setPlaces(res.data.results);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    }
  };

  const mutation = useMutation(
    async (formData) => {
      const newFeatures = formData.features
        ?.split(",")
        .map((feature) => feature.trim());
      const newImages = formData.imageUrls?.split(",").map((img) => img.trim());

      const response = await privateApi.post("/spots", {
        name: formData.name,
        description: formData.description,
        spotType: formData.spotType,
        pricePerHour: {
          car: formData.carPricePerHour,
          bike: formData.bikePricePerHour,
        },
        capacity: {
          bike: formData.bikeCapacity,
          car: formData.carCapacity,
        },
        location: formData.location,
        isFree: formData.isFree,
        features: newFeatures,
        imageUrls: newImages,
        coordinates: formData.coordinates,
      });

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("spots");
        navigate("/spots");
      },
      onError: (error) => {
        console.error("Error:", error.message);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = JSON.parse(formData.coordinates);
    const location = {
      type: "Point",
      coordinates: [data.geometry.lat, data.geometry.lng],
      city: data.components.city || data.components.county,
      address: data.formatted,
    };
    const coordinates = [data.geometry.lat, data.geometry.lng];

    const payload = { ...formData, location, coordinates };
    mutation.mutate(payload);
  };

  return (
    <div className="mx-auto my-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Description:</label>
          <input
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Spot Type:</label>
          <select
            required
            name="spotType"
            value={formData.spotType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border bg-zinc-900 border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="Indoor">Indoor</option>
            <option value="Open">Open</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Bike Price Per Hour:
          </label>
          <input
            required
            type="number"
            min="1"
            name="bikePricePerHour"
            value={formData.bikePricePerHour}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Car Price Per Hour:
          </label>
          <input
            required
            min="1"
            type="number"
            name="carPricePerHour"
            value={formData.carPricePerHour}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">isFree:</label>
          <input
            onChange={handleInputChange}
            name="isFree"
            type="checkbox"
            checked={formData.isFree}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Features: (comma separated)
          </label>
          <input
            required
            type="text"
            name="features"
            value={formData.features}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Car Capacity:</label>
          <input
            required
            type="number"
            min="10"
            name="carCapacity"
            value={formData.carCapacity}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Bike Capacity:</label>
          <input
            required
            type="number"
            name="bikeCapacity"
            min="10"
            value={formData.bikeCapacity}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="my-2 col-span-2 space-y-2">
          <label className="block text-sm font-medium">
            Image Urls: (comma separated)
          </label>
          <input
            required
            type="text"
            name="imageUrls"
            value={formData.imageUrls}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border bg-transparent border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Choose precise location
          </label>
          <select
            required
            name="coordinates"
            value={formData.coordinates}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border bg-zinc-900 border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="" disabled>
              Please select nearby location
            </option>
            {places.map((place, key) => (
              <option key={key} value={JSON.stringify(place)}>
                {place.formatted}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Create Parking Spot
        </button>
      </form>
    </div>
  );
};

export default SpotForm;
