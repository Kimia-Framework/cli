const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

async function createApp(appName, lang, opts) {
  const targetDir = path.resolve(process.cwd(), appName);
  // console.log({ appName, lang, opts });
  const isAdvancedMode = Boolean(opts.multiple);
  const advancedProjectDir = path.dirname(targetDir);
  // Check if directory already exists
  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory '${appName}' already exists!`);
    process.exit(1);
  }
  if (isAdvancedMode) {
    console.log(`'${advancedProjectDir}' path in Advanced mode`);
  }

  // =>if advanced mode
  if (isAdvancedMode) {
    const installed = await isPnpmInstalled();
    // console.log("pnpm installed:", installed);

    if (installed) {
      console.log("✅ pnpm is available");
    } else {
      console.log(
        "❌ pnpm is not installed or not in PATH (you need for advanced mode!)"
      );
    }
  }

  console.log(`Creating Kimia app in ${targetDir}...`);
  const camelAppName = snakeToCamel(appName);
  // Create project directory
  fs.mkdirSync(targetDir, { recursive: true });
  let dirs = [
    "app",
    path.join("app", "middlewares"),
    path.join("app", "models"),
    path.join("app", "views"),
    path.join("app", "events"),
    path.join("app", "apis"),
    path.join("resources", "assets"),
    path.join("resources", "locales", lang),
    path.join("resources", "templates"),
    path.join("resources", "templates", "layout"),
    "routes",
  ];
  for (const dir of dirs) {
    fs.mkdirSync(path.join(targetDir, dir), { recursive: true });
  }
  const templateDir = path.join(__dirname, "../templates/create-app");
  // =>create required files
  let files = [
    {
      path: "app.ts",
      template: "app.ts",
      vars: {
        _locale_: lang,
        _app_name_: appName,
        _app_title_: camelAppName,
      },
    },
    {
      path: path.join("app", "middlewares", "middlewares.ts"),
      template: "middlewares.ts",
    },
    {
      path: path.join("app", "events", "init.ts"),
      template: "init-event.ts",
      vars: {
        _app_title_: camelAppName,
      },
    },
    /**models */
    {
      path: path.join("app", "models", "interfaces.ts"),
      template: "model-interfaces.ts",
      vars: {
        _app_title_: camelAppName,
      },
    },
    {
      path: path.join("app", "models", "models.ts"),
      template: "models.ts",
    },
    /**views */
    {
      path: path.join("app", "views", "base.ts"),
      template: "base-view.ts",
    },
    {
      path: path.join("app", "views", "views.ts"),
      template: "views.ts",
    },
    /**apis */
    {
      path: path.join("app", "apis", "base.ts"),
      template: "base-api.ts",
      vars: {
        _app_title_: camelAppName,
      },
    },
    {
      path: path.join("app", "apis", "apis.ts"),
      template: "apis.ts",
    },
    /**error handler */
    {
      path: path.join("app", "error-handler.ts"),
      template: "error-handler.ts",
    },
    {
      path: path.join("app", "interfaces.ts"),
      template: "interfaces.ts",
      vars: {
        _app_title_: camelAppName,
      },
    },
    /** routing */
    {
      path: path.join("routes", "web.ts"),
      template: "web-route.ts",
    },
    {
      path: path.join("routes", "api.ts"),
      template: "api-route.ts",
    },
    /**other files */
    {
      path: ".gitignore",
      template: "gitignore",
    },
    {
      path: "README.md",
      template: "README.md",
      vars: {
        _app_title_: camelAppName,
      },
    },
    {
      path: "local.ts",
      template: isAdvancedMode ? "multiple-local.ts" : "local.ts",
    },
    {
      path: "package.json",
      template: "package.json",
      vars: {
        _app_name_: appName,
      },
    },
    {
      path: "tsconfig.json",
      template: "tsconfig.json",
    },
    {
      path: path.join("resources", "templates", "layout", "base.twing.html"),
      template: "base.twing.html",
      vars: {
        _app_title_: camelAppName,
      },
    },
    {
      path: path.join("resources", "templates", "index.twing.html"),
      template: "index.twing.html",
      vars: {
        _app_title_: camelAppName,
        _app_name_: appName,
      },
    },
    {
      path: path.join("resources", "assets", "favicon.png"),
      template: "favicon.png",
    },
    {
      path: path.join("resources", "assets", "logo.png"),
      template: "logo.png",
    },
    {
      path: path.join("resources", "locales", lang, "info.ts"),
      template: "locale-info.ts",
      vars: {
        _locale_: lang,
      },
    },
    {
      path: path.join("resources", "locales", lang, "main.ts"),
      template: "locale-main.ts",
      vars: {
        _app_title_: camelAppName,
      },
    },
    {
      path: path.join("resources", "locales", lang, "msgs.ts"),
      template: "locale-msgs.ts",
    },
    {
      path: "settings.json",
      content: JSON.stringify(
        {
          SERVER_PORT: 8081,
          STORAGE: {
            localPath: isAdvancedMode
              ? path.join(advancedProjectDir, "storage")
              : path.join(targetDir, "storage"),
          },
          DEFAULT_LOCALE: lang,
          OPEN_APPS: [appName],
          DEFAULT_APP_NAME: appName,
          APPS_PATH: path.join(advancedProjectDir, "__app__", "build"),
          APPS_RESOURCES_PATH: advancedProjectDir,
          SHARED_PATH: path.join(advancedProjectDir, "shared"),
          DATABASE_INFO: {
            driver: "sqlite",
            path: isAdvancedMode
              ? path.join(advancedProjectDir, "storage", "database.db")
              : path.join(targetDir, "storage", "database.db"),
            dbName: "v2",
          },
        },
        null,
        2
      ),
    },
  ];
  // =>iterate files and create them
  for (const f of files) {
    let content;
    if (f.content) content = f.content;
    else if (f.template) {
      templateContent = fs
        .readFileSync(path.join(templateDir, f.template))
        .toString();
      // =>replace vars
      if (f.vars) {
        for (const key of Object.keys(f.vars)) {
          const regex = new RegExp(key, "gi");
          templateContent = templateContent.replace(regex, f.vars[key]);
        }
      }
      content = templateContent;
      // =>if advanced mode
      if (isAdvancedMode) {
        if (
          f.path === "settings.json" &&
          fs.existsSync(path.join(advancedProjectDir, "settings.json"))
        ) {
          continue;
        }
        if (f.template === "package.json") {
          const tmpContent = JSON.parse(content);
          delete tmpContent["dependencies"]["@kimia-framework/core"];
          tmpContent["dependencies"]["@core"] = "workspace:../core";
          content = JSON.stringify(tmpContent, null, 2);
        } else {
          content = content.replace(/\@kimia\-framework\/core/g, "@core");
        }
      }
    }
    let writeFilePath = path.join(targetDir, f.path);
    if (isAdvancedMode) {
      if (f.path === "settings.json") {
        writeFilePath = path.join(advancedProjectDir, "settings.json");
      }
    }
    fs.writeFileSync(writeFilePath, content);
  }

  // Install dependencies
  console.log("Installing dependencies...");
  try {
    execSync(isAdvancedMode ? "pnpm install" : "npm install", {
      cwd: targetDir,
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Dependency installation failed!");
    process.exit(1);
  }

  console.log("\n✅ Project created successfully!");
  console.log(`\nNext steps:`);
  console.log(`  cd ${appName}`);
  console.log(isAdvancedMode ? "  pnpm run dev" : `  npm run dev`);
}

function snakeToCamel(snakeCaseString) {
  return snakeCaseString.replace(/(_\w)/g, (match) => {
    return match[1].toUpperCase();
  });
}

/**
 * Checks if pnpm is installed and available in PATH
 * @returns {Promise<boolean>} true if pnpm is installed, false otherwise
 */
async function isPnpmInstalled() {
  try {
    // Try to get pnpm version (works on Windows, macOS, Linux)
    await execAsync("pnpm --version", {
      timeout: 5000, // 5 second timeout
      // Prevent hanging on systems with prompts
      env: { ...process.env, CI: "true" },
    });
    return true;
  } catch (error) {
    // Common cases:
    // - ENOENT: command not found
    // - Other errors: pnpm exists but failed to run (still counts as installed)
    if (error.code === "ENOENT") {
      return false;
    }
    // If it's any other error (e.g., permission, corrupted install),
    // we assume pnpm is present but broken → treat as "installed"
    return true;
  }
}

module.exports = createApp;
