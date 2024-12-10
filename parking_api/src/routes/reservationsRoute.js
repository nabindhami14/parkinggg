import express from "express";

import {
  createReservation,
  deleteReservation,
  getReservation,
  getReservations,
  getTotalReservations,
  getUserReservations,
  updateReservation,
  updateStatus,
} from "../controllers/reservationController.js";
import authorize from "../middlewares/adminMiddleware.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createReservation);
router.get("/", authenticate, getReservations);
router.get("/user", authenticate, getUserReservations);
router.get("/total", authenticate, authorize, getTotalReservations);
router.get("/:id", authenticate, getReservation);
router.put("/:id", authenticate, updateReservation);
router.put("/:id/status", authenticate, updateStatus);
router.delete("/:id", authenticate, deleteReservation);

export default router;
