exports.logCurrentDirectory = function () {
  console.log(`You are currently in ${process.cwd()}`);
};

exports.logError = function (error) {
  console.log(`Error occured ${error}`);
};

exports.logExitText = function () {
  const args = process.argv.slice(2);
  const username = args[0].slice(args[0].indexOf("=") + 1);
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
};
