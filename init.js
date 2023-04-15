import os from "os";
import { logCurrentDirectory } from "./utils.js";

function initialize() {
  const args = process.argv.slice(2);
  const username = args[0].slice(args[0].indexOf("=") + 1);
  console.log(`Welcome to the File Manager, ${username}!`);

  process.chdir(os.homedir());
  logCurrentDirectory();
}

export default initialize;
