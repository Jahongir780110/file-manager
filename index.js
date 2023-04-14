const os = require("os");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");

function logCurrentDirectory() {
  console.log(`You are currently in ${process.cwd()}`);
}

function logError(error) {
  console.log(`Error occured ${error}`);
}

const args = process.argv.slice(2);
const username = args[0].slice(args[0].indexOf("=") + 1);
console.log(`Welcome to the File Manager, ${username}!`);

process.chdir(os.homedir());
logCurrentDirectory();

process.stdin.setEncoding("utf-8");
process.stdin.on("data", async (data) => {
  const normalizedData = data.trim();

  if (normalizedData === ".exit") {
    process.exit();
  }

  if (normalizedData === "up") {
    process.chdir("..");
    return logCurrentDirectory();
  }

  if (normalizedData.startsWith("cd ")) {
    try {
      const pathToDirectory = normalizedData.split("cd ")[1];
      process.chdir(pathToDirectory);
      return logCurrentDirectory();
    } catch (err) {
      return logError(err);
    }
  }

  if (normalizedData === "ls") {
    try {
      const data = await fs.promises.readdir(process.cwd());
      const result = [];

      return data.forEach(async (d) => {
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
      return logError(err);
    }
  }

  if (normalizedData.startsWith("cat ")) {
    return await new Promise((resolve, reject) => {
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
  }

  if (normalizedData.startsWith("add ")) {
    const filename = normalizedData.split("add ")[1];

    try {
      await fs.promises.writeFile(filename, "");
      return logCurrentDirectory();
    } catch (err) {
      return logError(err);
    }
  }

  if (normalizedData.startsWith("rn ")) {
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
  }

  if (normalizedData.startsWith("cp ")) {
    return await new Promise((resolve, reject) => {
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
  }

  if (normalizedData.startsWith("mv ")) {
    return await new Promise((resolve, reject) => {
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
  }

  if (normalizedData.startsWith("rm ")) {
    const pathToFile = normalizedData.split("rm ")[1];
    try {
      await fs.promises.unlink(pathToFile);
      return logCurrentDirectory();
    } catch (err) {
      return logError(err);
    }
  }

  if (normalizedData === "os --EOL") {
    const defaultEOL = JSON.stringify(os.EOL);
    console.log(`Default system EOL is ${defaultEOL}`);

    return logCurrentDirectory();
  }

  if (normalizedData === "os --cpus") {
    const cpus = os.cpus();
    console.log(`Total number of cpus is ${cpus.length}`);

    cpus.forEach((cpu, index) => {
      console.log(
        `CPU index ${index + 1}'s model is ${cpu.model}, it's clock rate is ${
          cpu.speed / 1000
        } GHz`
      );
    });

    return logCurrentDirectory();
  }

  if (normalizedData === "os --homedir") {
    console.log(`Home directory is ${os.homedir()}`);
    return logCurrentDirectory();
  }

  if (normalizedData === "os --username") {
    console.log(`Current username is ${os.userInfo().username}`);
    return logCurrentDirectory();
  }

  if (normalizedData === "os --architecture") {
    console.log(`CPU architecture is ${process.arch}`);
    return logCurrentDirectory();
  }

  if (normalizedData.startsWith("hash ")) {
    const pathToFile = normalizedData.split("hash ")[1];
    try {
      const fileContent = await fs.promises.readFile(pathToFile);
      const hash = crypto
        .createHash("sha256")
        .update(fileContent)
        .digest("hex");
      console.log(hash);
      return logCurrentDirectory();
    } catch (err) {
      return logError(err);
    }
  }

  if (normalizedData.startsWith("compress ")) {
    return await new Promise((resolve, reject) => {
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
  }

  if (normalizedData.startsWith("decompress ")) {
    return await new Promise((resolve, reject) => {
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
  }

  console.log("Invalid input");
});

process.on("exit", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});
process.on("SIGINT", () => {
  process.exit();
});
