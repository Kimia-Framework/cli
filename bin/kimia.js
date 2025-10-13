#!/usr/bin/env node

const { Command } = require("commander");
const createApp = require("../commands/create-app");

const program = new Command();

program.name("kimia").description("Kimia Framework CLI").version("1.0.0");

program
  .command("create-app")
  .argument("<app-name>", "Application name")
  .argument("[lang]", "Default language of application", 'fa')
  .alias('a')
  .description("Create a new Kimia application")
  .action(createApp);

program.parse();
