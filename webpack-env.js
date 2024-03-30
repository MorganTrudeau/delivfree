module.exports = function () {
  let dotEnv = {};

  if (process.env.APP === "consumer") {
    dotEnv = require("dotenv").config({ path: "./.env.consumer" });
  } else if (process.env.APP === "vendor") {
    dotEnv = require("dotenv").config({ path: "./.env.vendor" });
  } else if (process.env.APP === "admin") {
    dotEnv = require("dotenv").config({ path: "./.env.admin" });
  }

  const envVarsToRemove = [];

  const removeEnvVars = () => {
    envVarsToRemove.forEach((_var) => {
      delete dotEnv.parsed[_var];
    });
  };

  removeEnvVars();

  return dotEnv.parsed;
};
