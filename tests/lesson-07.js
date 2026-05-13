import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { check, printResults, PROJECT_ROOT } from "./utils.js";

console.log("Lesson 07: Introducing State and useState\n");

const results = [];

const appPath = path.join(
  PROJECT_ROOT,
  "src",
  "components",
  "App",
  "App.tsx",
);

const appExists = fs.existsSync(appPath);
const appCode = appExists ? fs.readFileSync(appPath, "utf8") : "";

const initialDocumentsMatch = appCode.match(
  /const\s+initialDocuments\s*:\s*Document\[\]\s*=\s*\[/,
);

const appFunctionIndex = appCode.search(/function\s+App\s*\(/);

const hasInitialDocumentsOutsideApp =
  initialDocumentsMatch !== null &&
  appFunctionIndex !== -1 &&
  initialDocumentsMatch.index < appFunctionIndex;

results.push(
  check(
    "initialDocuments is declared outside the App component",
    hasInitialDocumentsOutsideApp,
    "Rename the original documents array to initialDocuments and keep it outside the App function.",
  ),
);

const importsUseState =
  /import\s*{\s*useState\s*}\s*from\s*["']react["']/.test(appCode);

results.push(
  check(
    "useState is imported in App.tsx",
    importsUseState,
    'Import useState from React using import { useState } from "react";',
  ),
);

const hasDocumentsState =
  /const\s*\[\s*documents\s*,\s*setDocuments\s*\]\s*=\s*useState\s*\(\s*initialDocuments\s*\)/.test(
    appCode,
  );

results.push(
  check(
    "App stores documents in state",
    hasDocumentsState,
    "Inside App, create document state using const [documents, setDocuments] = useState(initialDocuments);",
  ),
);

// Use backreference so any callback parameter name is accepted (not just "document").
const hasHandleDelete =
  /function\s+handleDelete\s*\(\s*id\s*:\s*string\s*\)\s*{[\s\S]*setDocuments\s*\([\s\S]*documents\.filter\s*\(\s*\((\w+)\)\s*=>\s*(?:\1\.id\s*!==\s*id|id\s*!==\s*\1\.id)\s*\)[\s\S]*\)[\s\S]*}/.test(
    appCode,
  );

results.push(
  check(
    "handleDelete updates the documents state",
    hasHandleDelete,
    "Create handleDelete(id: string) and remove the matching document with setDocuments(documents.filter((document) => document.id !== id));",
  ),
);

const passesHandleDelete =
  /<DocumentList[\s\S]*onDelete=\{handleDelete\}[\s\S]*(?:\/>|>\s*<\/DocumentList>)/.test(appCode);

results.push(
  check(
    "DocumentList receives handleDelete",
    passesHandleDelete,
    "Pass the real delete handler to DocumentList using onDelete={handleDelete}.",
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
    "The app builds without TypeScript errors",
    buildWorks,
    "Check for missing imports, invalid state updates, incorrect prop names, and JSX or TypeScript syntax errors.",
  ),
);

printResults(results, "ABZBERPNEQF");