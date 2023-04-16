import os from "os";
import { logCurrentDirectory, logError } from "./utils.js";

function initialize() {
  const args = process.argv.slice(2);
  if (!args.length) {
    logError(new Error("Username is not provided"));
    process.exit();
  }

  const username = args[0].slice(args[0].indexOf("=") + 1);
  console.log(`Welcome to the File Manager, ${username}!`);

  process.chdir(os.homedir());
  logCurrentDirectory();
}

export default initialize;
