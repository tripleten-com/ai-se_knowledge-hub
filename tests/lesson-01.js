import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { check, printResults, PROJECT_ROOT } from "./utils.js";

console.log("Lesson 01: React and JSX\n");

const results = [];

const headerPath = path.join(
  PROJECT_ROOT,
  "src",
  "components",
  "Header",
  "Header.tsx",
);

const headerCode = fs.existsSync(headerPath)
  ? fs.readFileSync(headerPath, "utf8")
  : "";

const hasAppNameConstant =
  /const\s+appName\s*=\s*["']Knowledge Hub["']\s*;?/.test(headerCode);

const headingUsesAppName =
  /<h1>\s*{\s*appName\s*}\s*<\/h1>/.test(headerCode);

results.push(
  check(
    'The header should display "Knowledge Hub" using the appName constant',
    hasAppNameConstant && headingUsesAppName,
    'Replace the hardcoded "Knowledge Hub" text inside the <h1> with {appName}.',
  ),
);

const altUsesAppName =
  /alt\s*=\s*{\s*`\s*\${\s*appName\s*}\s+logo\s*`\s*}/.test(headerCode);

results.push(
  check(
    "The logo image should use the appName constant in the alt text",
    hasAppNameConstant && altUsesAppName,
    'Build the alt text so it renders "Knowledge Hub logo" using a template literal and the appName constant.',
  ),
);

let buildWorks = true;

try {
  execSync("npm run build", {
    cwd: PROJECT_ROOT,
    stdio: "ignore",
  });
} catch {
  buildWorks = false;
}

results.push(
  check(
    "No errors should appear in the console",
    buildWorks,
    "Check that the JSX syntax is written correctly.",
  ),
);

printResults(results, "WFK");