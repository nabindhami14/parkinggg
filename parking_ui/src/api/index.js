import axios from "axios";

export const publicAxios = axios.create({
  baseURL: "http://localhost:4000",
});

export const privateAxios = axios.create({
  baseURL: "http://localhost:4000",
});

privateAxios.interceptors.request.use((config) => {
  const data = localStorage.getItem("user-store");
  const accessToken = JSON.parse(data).state.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

privateAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 403) {
      const data = localStorage.getItem("user-store");
      const refreshToken = JSON.parse(data).state.refreshToken;
      if (!refreshToken) {
        return Promise.reject(new Error("No refresh token found."));
      }

      try {
        const newAccessToken = await refreshAccessToken(refreshToken);

        // Retry the original request with the new access token
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateAxios(originalRequest);
      } catch (refreshError) {
        // Handle errors that occur during the access token refresh process
        return Promise.reject(refreshError);
      }
    }
    // If the error is not a 403 status, just re-throw it
    return Promise.reject(error);
  }
);

// Function to refresh the access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await publicAxios.post("/auth/refresh", { refreshToken });
    const newAccessToken = response.data.accessToken;

    const data = {
      state: {
        accessToken: newAccessToken,
      },
    };

    localStorage.setItem("user-store", JSON.stringify(data));
    return newAccessToken;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const login = async (data) =>
  await publicAxios.post("/auth/login", data);

export const uploadDocuments = async (data) =>
  await privateAxios.post("/auth/documents", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getProfile = async () => await privateAxios.get("/auth/me");
export const getDocuments = async () =>
  await privateAxios.get("/auth/me/documents");

export const getParkingSpots = async () => await privateAxios.get("/spots");
export const getParkingSpot = async (id) =>
  await privateAxios.get(`/spots/${id}`);

export const giveFeedbacks = async ({ spotId, rating, message }) =>
  await privateAxios.post(`/spots/${spotId}/feedbacks`, { rating, message });

export const getFeedbacks = async (spotId) =>
  await privateAxios.get(`/spots/${spotId}/feedbacks`);

export const getUserVehicles = async () =>
  await privateAxios.get("/vehicles/u/p");

export const issuePayment = async ({ reservationId }) =>
  await privateAxios.post("/payments/issue-payment", { reservationId });
export const completePayment = async ({
  pidx,
  amount,
  transaction_id,
  purchase_order_id,
  purchase_order_name,
}) =>
  await privateAxios.post("/payments/complete-payment", {
    pidx,
    amount,
    transaction_id,
    purchase_order_id,
    purchase_order_name,
  });

export const getReservtions = async () =>
  await privateAxios.get(`/reservations/user`);
