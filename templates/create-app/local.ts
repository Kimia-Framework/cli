import { startMainApplication } from "@kimia-framework/core";
import { Sequelize } from "sequelize";

startMainApplication("./settings.json", {
  disableAutoInitApps: true,
  Sequelize,
  requireFn: require,
});
