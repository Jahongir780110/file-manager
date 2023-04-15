const fs = require("fs");
const crypto = require("crypto");
const { logCurrentDirectory, logError } = require("./utils");

exports.hashOperations = {
  async hash(normalizedData) {
    const pathToFile = normalizedData.split("hash ")[1];
    try {
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
