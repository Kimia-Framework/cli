const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");
const { promisify } = require("util");
const { exec } = require("child_process");

const execAsync = promisify(exec);

async function InitCore(cmd) {
  // const opts = cmd.opts();
  const shouldUpdate = Boolean(cmd.update);
  const targetDir = path.resolve(process.cwd(), "core");
  // console.log({ targetDir, cmd, shouldUpdate });

  // Check if directory already exists
  if (fs.existsSync(targetDir) && !shouldUpdate) {
    console.error("Core already exists. Use --update to overwrite or update.");
    process.exit(1);
  }
  fs.mkdirSync(targetDir, { recursive: true });
  await downloadAndExtractPackage(targetDir);

  console.log(`Creating Kimia framework core in ${targetDir}...`);

  // Install dependencies
  console.log("Installing dependencies...");
  try {
    execSync("npm install", { cwd: targetDir, stdio: "inherit" });
  } catch (error) {
    console.error("Dependency installation failed!");
    process.exit(1);
  }

  console.log("\n✅ Core created successfully!");
}

async function downloadAndExtractPackage(targetDir) {
  // Create absolute path for target directory
  const absoluteTargetDir = path.resolve(targetDir);

  // Create temporary directory in OS temp folder
  const tmpDir = path.join(os.tmpdir(), "kimia-download-" + Date.now());
  await fs.mkdirSync(tmpDir, { recursive: true });

  try {
    console.log(`Downloading @kimia-framework/core to temporary directory...`);

    // Install package in temporary directory
    await execAsync(`npm install @kimia-framework/core`, {
      cwd: tmpDir,
      timeout: 60000, // 60 second timeout
    });

    // Source path (where npm installed the package)
    const sourcePath = path.join(
      tmpDir,
      "node_modules",
      "@kimia-framework",
      "core"
    );

    // Verify package was installed
    if (!fs.existsSync(sourcePath)) {
      throw new Error(
        "Package installation failed - source directory not found"
      );
    }

    // Create target directory if it doesn't exist
    await fs.mkdirSync(absoluteTargetDir, { recursive: true });

    // Remove existing contents in target directory (if any)
    await fs.rmSync(absoluteTargetDir, { recursive: true, force: true });

    // Copy files from source to target
    await fs.promises.cp(sourcePath, absoluteTargetDir, {
      recursive: true,
      force: true,
    });

    console.log(
      `Successfully extracted @kimia-framework/core to ${absoluteTargetDir}`
    );
  } catch (error) {
    console.error("Error during download/extract process:", error.message);
    throw error;
  } finally {
    // Clean up temporary directory
    try {
      await fs.rmSync(tmpDir, { recursive: true, force: true });
      console.log("Temporary directory cleaned up");
    } catch (cleanupError) {
      console.warn(
        "Failed to clean up temporary directory:",
        cleanupError.message
      );
    }
  }
}

module.exports = InitCore;
