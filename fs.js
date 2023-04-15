const fs = require("fs");
const path = require("path");
const { logCurrentDirectory, logError } = require("./utils");

exports.fsOperations = {
  up() {
    process.chdir("..");
    logCurrentDirectory();
  },
  cd(normalizedData) {
    try {
      const pathToDirectory = normalizedData.split("cd ")[1];
      process.chdir(pathToDirectory);
      logCurrentDirectory();
    } catch (err) {
      logError(err);
    }
  },
  async ls() {
    try {
      const data = await fs.promises.readdir(process.cwd());
      const result = [];

      data.forEach(async (d) => {
        const stat = await fs.promises.stat(path.join(process.cwd(), d));

        if (stat.isDirectory()) {
          result.push({ type: "directory", name: d });
        } else {
          result.push({ type: "file", name: d });
        }

        if (result.length === data.length) {
          result.sort((a, b) =>
            a.type > b.type
              ? 1
              : a.type < b.type
              ? -1
              : a.name.toLowerCase() > b.name.toLowerCase()
              ? 1
              : -1
          );

          console.table(result);
          logCurrentDirectory();
        }
      });
    } catch (err) {
      logError(err);
    }
  },
  async cat(normalizedData) {
    await new Promise((resolve, reject) => {
      const pathToDirectory = normalizedData.split("cat ")[1];
      const readStream = fs.createReadStream(pathToDirectory);
      readStream.setEncoding("utf-8");

      readStream.on("data", (chunk) => {
        console.log(chunk);
      });

      readStream.on("end", () => {
        logCurrentDirectory();
        resolve();
      });

      readStream.on("error", (err) => {
        logError(err);
      });
    });
  },
  async add(normalizedData) {
    const filename = normalizedData.split("add ")[1];

    try {
      await fs.promises.writeFile(filename, "");
      logCurrentDirectory();
    } catch (err) {
      logError(err);
    }
  },
  async rn(normalizedData) {
    const oldFilenamePath = normalizedData.split("rn ")[1].split(" ")[0];
    const newFilename = normalizedData.split("rn ")[1].split(" ")[1];

    try {
      await fs.promises.rename(
        oldFilenamePath,
        path.join(path.dirname(oldFilenamePath), newFilename)
      );
      return logCurrentDirectory();
    } catch (err) {
      return logError(err);
    }
  },
  async cp(normalizedData) {
    await new Promise((resolve, reject) => {
      const oldFilenamePath = normalizedData.split("cp ")[1].split(" ")[0];
      const newFolderPath = normalizedData.split("cp ")[1].split(" ")[1];

      const readStream = fs.createReadStream(oldFilenamePath);
      const writeStream = fs.createWriteStream(
        path.join(newFolderPath, path.basename(oldFilenamePath))
      );

      readStream.on("data", (chunk) => {
        writeStream.write(chunk);
      });

      readStream.on("end", () => {
        writeStream.end();
        logCurrentDirectory();
        resolve();
      });

      readStream.on("error", (err) => {
        logError(err);
      });
    });
  },
  async mv(normalizedData) {
    await new Promise((resolve, reject) => {
      const oldFilenamePath = normalizedData.split("mv ")[1].split(" ")[0];
      const newFolderPath = normalizedData.split("mv ")[1].split(" ")[1];

      const readStream = fs.createReadStream(oldFilenamePath);
      const writeStream = fs.createWriteStream(
        path.join(newFolderPath, path.basename(oldFilenamePath))
      );

      readStream.on("data", (chunk) => {
        writeStream.write(chunk);
      });

      readStream.on("end", async () => {
        writeStream.end();

        try {
          await fs.promises.unlink(oldFilenamePath);
          logCurrentDirectory();
          resolve();
        } catch (e) {
          logError(e);
        }
      });

      readStream.on("error", (err) => {
        logError(err);
      });
    });
  },
  async rm(normalizedData) {
    const pathToFile = normalizedData.split("rm ")[1];
    try {
      await fs.promises.unlink(pathToFile);
      return logCurrentDirectory();
    } catch (err) {
      return logError(err);
    }
  },
};
