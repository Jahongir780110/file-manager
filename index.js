import { logExitText } from "./utils.js";
import initialize from "./init.js";
import fsOperations from "./fs.js";
import osOperations from "./os.js";
import hashOperations from "./hash.js";
import compressOperations from "./compress.js";

initialize();

process.stdin.setEncoding("utf-8");
process.stdin.on("data", async (data) => {
  const normalizedData = data.trim();

  if (normalizedData === ".exit") {
    process.exit();
  }

  if (normalizedData === "up") {
    return fsOperations.up();
  }

  if (normalizedData.startsWith("cd ")) {
    return fsOperations.cd(normalizedData);
  }

  if (normalizedData === "ls") {
    return fsOperations.ls();
  }

  if (normalizedData.startsWith("cat ")) {
    return fsOperations.cat(normalizedData);
  }

  if (normalizedData.startsWith("add ")) {
    return fsOperations.add(normalizedData);
  }

  if (normalizedData.startsWith("rn ")) {
    return fsOperations.rn(normalizedData);
  }

  if (normalizedData.startsWith("cp ")) {
    return fsOperations.cp(normalizedData);
  }

  if (normalizedData.startsWith("mv ")) {
    return fsOperations.mv(normalizedData);
  }

  if (normalizedData.startsWith("rm ")) {
    return fsOperations.rm(normalizedData);
  }

  if (normalizedData === "os --EOL") {
    return osOperations.eol();
  }

  if (normalizedData === "os --cpus") {
    return osOperations.cpus();
  }

  if (normalizedData === "os --homedir") {
    return osOperations.homedir();
  }

  if (normalizedData === "os --username") {
    return osOperations.username();
  }

  if (normalizedData === "os --architecture") {
    return osOperations.architecture();
  }

  if (normalizedData.startsWith("hash ")) {
    return hashOperations.hash(normalizedData);
  }

  if (normalizedData.startsWith("compress ")) {
    return compressOperations.compress(normalizedData);
  }

  if (normalizedData.startsWith("decompress ")) {
    return compressOperations.decompress(normalizedData);
  }

  console.log("Invalid input");
});

process.on("exit", () => {
  logExitText();
});
process.on("SIGINT", () => {
  process.exit();
});
