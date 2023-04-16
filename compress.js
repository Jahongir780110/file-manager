import fs from "fs";
import zlib from "zlib";
import { logCurrentDirectory, logError } from "./utils.js";

const compressOperations = {
  async compress(normalizedData) {
    try {
      await new Promise((resolve, reject) => {
        const pathToFile = normalizedData.split("compress ")[1].split(" ")[0];
        const pathToDestination = normalizedData
          .split("compress ")[1]
          .split(" ")[1];

        const readStream = fs.createReadStream(pathToFile);
        const writeStream = fs.createWriteStream(pathToDestination);
        const compressStream = zlib.createBrotliCompress();

        readStream.pipe(compressStream).pipe(writeStream);

        readStream.on("error", (err) => {
          reject(err);
        });

        writeStream.on("error", (err) => {
          reject(err);
        });

        writeStream.on("finish", () => {
          logCurrentDirectory();
          resolve();
        });
      });
    } catch (err) {
      logError(err);
    }
  },
  async decompress(normalizedData) {
    try {
      await new Promise((resolve, reject) => {
        const pathToFile = normalizedData.split("decompress ")[1].split(" ")[0];
        const pathToDestination = normalizedData
          .split("decompress ")[1]
          .split(" ")[1];

        const readStream = fs.createReadStream(pathToFile);
        const writeStream = fs.createWriteStream(pathToDestination);
        const decompressStream = zlib.createBrotliDecompress();

        readStream.pipe(decompressStream).pipe(writeStream);

        readStream.on("error", (err) => {
          reject(err);
        });

        writeStream.on("error", (err) => {
          reject(err);
        });

        writeStream.on("finish", () => {
          logCurrentDirectory();
          resolve();
        });
      });
    } catch (err) {
      logError(err);
    }
  },
};

export default compressOperations;
