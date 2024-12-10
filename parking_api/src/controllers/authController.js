import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import User from "../models/User.js";
import { decryptFile, encryptFile } from "../utils/encryption.js";

// Helper function for generating access tokens
const generateAccessToken = (userId, roles) => {
  return jwt.sign({ userId, roles }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Helper function for generating refresh tokens
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, coordinates } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hash,
      coordinates,
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error creating a new user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user exists with this email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credentials don't match" });
    }

    const accessToken = generateAccessToken(user._id, user.roles);
    const refreshToken = generateRefreshToken(user._id);

    return res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user exists with this email" });
    }
    if (!user.roles.includes("admin")) {
      return res.status(401).json({ message: "You are not assigned as admin" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credentials don't match" });
    }

    const accessToken = generateAccessToken(user._id, user.roles);
    const refreshToken = generateRefreshToken(user._id);

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findById(decoded.userId);
      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = generateAccessToken(foundUser._id, foundUser.roles);

      res.json({ accessToken });
    }
  );
};

export const profile = async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId)
    .select("name")
    .populate({ path: "vehicles" })
    .select("model licensePlate vehicleType")
    .populate({
      path: "reservations",
      populate: [
        {
          path: "parkingSpot",
        },
        {
          path: "vehicle",
        },
      ],
    });
  return res.json({ user });
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ message: "Cookie cleared" });
};

export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || !req.files.front || !req.files.back) {
      return res
        .status(400)
        .json({ message: "Both front and back images are required!" });
    }

    const encryptedDir = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "encrypted"
    );
    if (!fs.existsSync(encryptedDir)) {
      fs.mkdirSync(encryptedDir);
    }

    const frontEncryption = encryptFile(req.files.front[0].path, encryptedDir);
    const backEncryption = encryptFile(req.files.back[0].path, encryptedDir);

    fs.unlinkSync(req.files.front[0].path); // Remove the original front file after encryption
    fs.unlinkSync(req.files.back[0].path); // Remove the original back file after encryption

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.documents.front = {
      iv: frontEncryption.iv,
      key: frontEncryption.key,
      encryptedFilePath: frontEncryption.encryptedFilePath,
      originalFileName: req.files.front[0].filename,
    };

    user.documents.back = {
      iv: backEncryption.iv,
      key: backEncryption.key,
      encryptedFilePath: backEncryption.encryptedFilePath,
      originalFileName: req.files.back[0].filename,
    };

    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Error uploading files", error });
  }
};

export const verifyUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { $set: { isVerified: true } });
  } catch (error) {
    console.error("Error decrypting files:", error);
    res
      .status(400)
      .json({ message: "Decryption failed!", error: error.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const outputDir = path.join(__dirname, "..", "..", "public");
    const decryptedFrontPath = await decryptAndServe(
      user.documents.front,
      outputDir,
      "front"
    );
    const decryptedBackPath = await decryptAndServe(
      user.documents.back,
      outputDir,
      "back"
    );

    res.status(200).json({
      message: "Files decrypted and served successfully!",
      front: `http://localhost:4000${decryptedFrontPath}`, // Remove the leading slash
      back: `http://localhost:4000${decryptedBackPath}`, // Remove the leading slash
    });
  } catch (error) {
    console.error("Error decrypting files:", error);
    res
      .status(400)
      .json({ message: "Decryption failed!", error: error.message });
  }
};
export const getUserDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const outputDir = path.join(__dirname, "..", "..", "public");
    const decryptedFrontPath = await decryptAndServe(
      user.documents.front,
      outputDir,
      "front"
    );
    const decryptedBackPath = await decryptAndServe(
      user.documents.back,
      outputDir,
      "back"
    );

    res.status(200).json({
      message: "Files decrypted and served successfully!",
      front: `http://localhost:4000${decryptedFrontPath}`, // Remove the leading slash
      back: `http://localhost:4000${decryptedBackPath}`, // Remove the leading slash
    });
  } catch (error) {
    console.error("Error decrypting files:", error);
    res
      .status(400)
      .json({ message: "Decryption failed!", error: error.message });
  }
};

async function decryptAndServe(encryption, outputDir, prefix) {
  const decryptedFilePath = path.join(
    outputDir,
    `${prefix}_${encryption.originalFileName}`
  );

  try {
    await decryptFile(encryption, decryptedFilePath);
    const urlPath = decryptedFilePath
      .replace(path.join(__dirname, "..", "..", "public"), "")
      .replace(/\\/g, "/"); // Replace backslashes with forward slashes
    return urlPath.startsWith("/") ? urlPath : `/${urlPath}`; // Ensure path starts with a slash
  } catch (error) {
    throw new Error(`Failed to decrypt ${prefix} file: ${error.message}`);
  }
}
