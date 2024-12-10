import express from "express";
import {
  completePayment,
  createPayment,
  deletePayment,
  getPayment,
  getPayments,
  getTotal,

  // PAYMENT
  issuePayment,
  updatePayment,
} from "../controllers/paymentController.js";

import authorize from "../middlewares/adminMiddleware.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/issue-payment", authenticate, issuePayment);
router.post("/complete-payment", authenticate, completePayment);

router.post("/", authenticate, createPayment);
router.put("/:id", authenticate, updatePayment);

router.use(authenticate, authorize);

router.get("/", getPayments);
router.get("/total", getTotal);
router.get("/:id", getPayment);

router.delete("/:id", deletePayment);

export default router;
