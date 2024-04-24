module.exports = function () {
  let dotEnv = require("dotenv").config({ path: process.env.ENVFILE });

  const envVarsToRemove = [];

  const removeEnvVars = () => {
    envVarsToRemove.forEach((_var) => {
      delete dotEnv.parsed[_var];
    });
  };

  removeEnvVars();

  return dotEnv.parsed;
};
