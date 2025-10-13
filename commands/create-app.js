const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

async function createApp(appName, lang) {
  const targetDir = path.resolve(process.cwd(), appName);

  // Check if directory already exists
  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory '${appName}' already exists!`);
    process.exit(1);
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
      template: "local.ts",
    },
    {
      path: "package.json",
      content: JSON.stringify(
        {
          name: appName,
          version: "1.0.0",
          description: "",
          main: "build/local.js",
          scripts: {
            build: "tsc -b tsconfig.json",
            start: "node local.js",
            "start:dev": "node build/local.js dev",
            dev: "concurrently \"tsc -b -w tsconfig.json\" \"nodemon --ext 'js' --ignore 'storage/*' --ignore 'resources/frontend' --ignore 'resources/assets' --trace-warnings build/local.js dev\"",
          },
          keywords: [],
          dependencies: {
            "@kimia-framework/core": "^0.10.87",
            "adm-zip": "^0.5.9",
            "connect-multiparty": "^2.2.0",
            cors: "^2.8.5",
            express: "^4.17.1",
            jsonwebtoken: "^9.0.2",
            "live-plugin-manager": "^1.0.0",
            "mime-types": "^2.1.35",
            multer: "^1.4.5-lts.1",
            "node-machine-id": "^1.1.12",
            sequelize: "^6.37.5",
            "signal-exit": "^4.1.0",
            sqlite3: "^5.0.2",
            "swagger-ui-express": "^4.6.0",
            tslib: "^2.5.0",
            twing: "^5.0.2",
            typescript: "^4.9.5",
          },
          devDependencies: {
            "@types/adm-zip": "^0.5.0",
            "@types/express": "^4.17.11",
            "@types/multer": "^1.4.7",
            "@types/node": "^14.18.42",
            "@types/sequelize": "^4.28.9",
            concurrently: "^5.3.0",
            nodemon: "^3.1.4",
            "source-map-support": "^0.5.21",
            "typescript-json-schema": "^0.65.1",
          },
          author: "YOUR NAME",
          license: "ISC",
        },
        undefined,
        2
      ),
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
            type: "local",
            localPath: path.join(targetDir, "storage"),
          },
          DEFAULT_LOCALE: lang,
          OPEN_APPS: [appName],
          DEFAULT_APP_NAME: appName,
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
    }
    fs.writeFileSync(path.join(targetDir, f.path), content);
  }

  // Install dependencies
  console.log("Installing dependencies...");
  try {
    execSync("npm install", { cwd: targetDir, stdio: "inherit" });
  } catch (error) {
    console.error("Dependency installation failed!");
    process.exit(1);
  }

  console.log("\n✅ Project created successfully!");
  console.log(`\nNext steps:`);
  console.log(`  cd ${appName}`);
  console.log(`  npm run dev`);
}

function snakeToCamel(snakeCaseString) {
  return snakeCaseString.replace(/(_\w)/g, (match) => {
    return match[1].toUpperCase();
  });
}

module.exports = createApp;
