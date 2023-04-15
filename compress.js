const fs = require("fs");
const zlib = require("zlib");
const { logCurrentDirectory, logError } = require("./utils");

exports.compressOperations = {
  async compress(normalizedData) {
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
        logError(err);
      });

      writeStream.on("error", (err) => {
        logError(err);
      });

      writeStream.on("finish", () => {
        logCurrentDirectory();
        resolve();
      });
    });
  },
  async decompress(normalizedData) {
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
        logError(err);
      });

      writeStream.on("error", (err) => {
        logError(err);
      });

      writeStream.on("finish", () => {
        logCurrentDirectory();
        resolve();
      });
    });
  },
};
