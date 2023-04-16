import fs from "fs";
import path from "path";
import { logCurrentDirectory, logError } from "./utils.js";

const fsOperations = {
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
    try {
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
          reject(err);
        });
      });
    } catch (e) {
      logError(e);
    }
  },
  async add(normalizedData) {
    try {
      const filename = normalizedData.split("add ")[1];
      await fs.promises.writeFile(filename, "");
      logCurrentDirectory();
    } catch (err) {
      logError(err);
    }
  },
  async rn(normalizedData) {
    try {
      const oldFilenamePath = normalizedData.split("rn ")[1].split(" ")[0];
      const newFilename = normalizedData.split("rn ")[1].split(" ")[1];
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
    try {
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
          reject(err);
        });
        writeStream.on("error", (err) => {
          reject(err);
        });
      });
    } catch (err) {
      logError(err);
    }
  },
  async mv(normalizedData) {
    try {
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

        readStream.on("end", () => {
          writeStream.end();
        });

        writeStream.on("finish", async () => {
          await fs.promises.unlink(oldFilenamePath);
          logCurrentDirectory();
          resolve();
        });

        readStream.on("error", (err) => {
          reject(err);
        });
        writeStream.on("error", (err) => {
          reject(err);
        });
      });
    } catch (err) {
      logError(err);
    }
  },
  async rm(normalizedData) {
    try {
      const pathToFile = normalizedData.split("rm ")[1];
      await fs.promises.unlink(pathToFile);
      return logCurrentDirectory();
    } catch (err) {
      return logError(err);
    }
  },
};

export default fsOperations;
