#!/usr/bin/env node

const { Command } = require("commander");
const createApp = require("../commands/create-app");
const InitCore = require("../commands/init-core");

const program = new Command();

program.name("kimia").description("Kimia Framework CLI").version("1.2.1");

program
  .command("create-app")
  .argument("<app-name>", "Application name")
  .argument("[lang]", "Default language of application", "fa")
  .option("-m --multiple", "advanced mode (for multiple applications)")
  .alias("a")
  .description("Create a new Kimia application")
  .action(createApp);

program
  .command("init-core")
  .option("-u --update", "if core exists, then update it")
  .alias("i")
  .description("Initiate Kimia framework core")
  .action(InitCore);

program.parse();
