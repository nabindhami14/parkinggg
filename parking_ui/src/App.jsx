import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import CreateVehicleForm from "./components/CreateVehicleForm";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Spot from "./pages/Spot";
import Spots from "./pages/Spots";
import Vehicles from "./pages/Vehicles";

import Documents from "./pages/Documents";
import NearestParking from "./pages/NearestParking";
import Parking from "./pages/Parking";
import { userStore } from "./store/userStore";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/nearest-parking" element={<NearestParking />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/vehicles"
          element={
            <RequireAuth>
              <Vehicles />
            </RequireAuth>
          }
        />
        <Route
          path="/parkings"
          element={
            <RequireAuth>
              <Parking />
            </RequireAuth>
          }
        />
        <Route
          path="/vehicles/new"
          element={
            <RequireAuth>
              <CreateVehicleForm />
            </RequireAuth>
          }
        />
        <Route
          path="/documents"
          element={
            <RequireAuth>
              <Documents />
            </RequireAuth>
          }
        />

        <Route path="/spots" element={<Spots />} />
        <Route path="/spots/:id" element={<Spot />} />
      </Route>
    </Routes>
  );
}

// eslint-disable-next-line react/prop-types
function RequireAuth({ children }) {
  const { accessToken } = userStore();

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />

      <main className="flex-1 mt-16">
        <Outlet />
      </main>

      {/* <footer>Hello from the footer</footer> */}
    </div>
  );
}
export default App;
