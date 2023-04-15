export function logCurrentDirectory() {
  console.log(`You are currently in ${process.cwd()}`);
}

export function logError(error) {
  console.log(`Error occured ${error}`);
}

export function logExitText() {
  const args = process.argv.slice(2);
  const username = args[0].slice(args[0].indexOf("=") + 1);
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
}
