const os = require("os");
const { logCurrentDirectory } = require("./utils");

exports.osOperations = {
  eol() {
    const defaultEOL = JSON.stringify(os.EOL);
    console.log(`Default system EOL is ${defaultEOL}`);

    logCurrentDirectory();
  },
  cpus() {
    const cpus = os.cpus();
    console.log(`Total number of cpus is ${cpus.length}`);

    cpus.forEach((cpu, index) => {
      console.log(
        `CPU index ${index + 1}'s model is ${cpu.model}, it's clock rate is ${
          cpu.speed / 1000
        } GHz`
      );
    });

    logCurrentDirectory();
  },
  homedir() {
    console.log(`Home directory is ${os.homedir()}`);
    logCurrentDirectory();
  },
  username() {
    console.log(`Current username is ${os.userInfo().username}`);
    logCurrentDirectory();
  },
  architecture() {
    console.log(`CPU architecture is ${process.arch}`);
    logCurrentDirectory();
  },
};
