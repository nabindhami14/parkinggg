import express from "express";

import {
  getDocuments,
  getUserDocuments,
  loginAdmin,
  loginUser,
  logout,
  profile,
  refresh,
  registerUser,
  uploadFiles,
  verifyUser,
} from "../controllers/authController.js";
import authenticate from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", loginAdmin);
router.post("/refresh", refresh);
router.get("/me", authenticate, profile);
router.get("/me/documents", authenticate, getUserDocuments);
router.post("/logout", logout);

router.post(
  "/documents",
  authenticate,
  uploadMiddleware.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  uploadFiles
);
router.get("/:id/documents", authenticate, getDocuments);

router.patch("/:id/verify", authenticate, verifyUser);

export default router;
