const os = require("os");
const { logCurrentDirectory } = require("./utils");

exports.initialize = function () {
  const args = process.argv.slice(2);
  const username = args[0].slice(args[0].indexOf("=") + 1);
  console.log(`Welcome to the File Manager, ${username}!`);

  process.chdir(os.homedir());
  logCurrentDirectory();
};
