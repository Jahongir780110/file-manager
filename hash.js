import fs from "fs";
import crypto from "crypto";
import { logCurrentDirectory, logError } from "./utils.js";

const hashOperations = {
  async hash(normalizedData) {
    try {
      const pathToFile = normalizedData.split("hash ")[1];
      const fileContent = await fs.promises.readFile(pathToFile);
      const hash = crypto
        .createHash("sha256")
        .update(fileContent)
        .digest("hex");
      console.log(hash);
      logCurrentDirectory();
    } catch (err) {
      logError(err);
    }
  },
};

export default hashOperations;
