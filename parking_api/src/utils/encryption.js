import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const algorithm = "aes-256-cbc";

export function encryptFile(filePath, outputPath) {
  const fileData = fs.readFileSync(filePath);
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(fileData), cipher.final()]);

  const fileExt = path.extname(filePath); // Get original file extension
  const encryptedFilePath = path.join(
    outputPath,
    `${path.basename(filePath, fileExt)}.enc`
  );
  fs.writeFileSync(encryptedFilePath, encrypted);

  return {
    iv: iv.toString("hex"),
    key: key.toString("hex"),
    encryptedFilePath,
    originalFileName: `${path.basename(filePath)}`, // Store original filename for later retrieval
  };
}

export function decryptFile(encryption, outputPath) {
  const iv = Buffer.from(encryption.iv, "hex");
  const encryptedFile = fs.readFileSync(encryption.encryptedFilePath);
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(encryption.key, "hex"),
    iv
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedFile),
    decipher.final(),
  ]);

  fs.writeFileSync(outputPath, decrypted);

  return outputPath;
}
