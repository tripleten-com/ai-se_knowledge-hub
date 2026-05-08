import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { check, printResults, PROJECT_ROOT } from "./utils.js";

console.log("Lesson 04: JSX Events\n");

const results = [];

const documentCardPath = path.join(
  PROJECT_ROOT,
  "src",
  "components",
  "DocumentCard",
  "DocumentCard.tsx",
);

const appPath = path.join(
  PROJECT_ROOT,
  "src",
  "components",
  "App",
  "App.tsx",
);

const documentCardExists = fs.existsSync(documentCardPath);
const appExists = fs.existsSync(appPath);

const documentCardCode = documentCardExists
  ? fs.readFileSync(documentCardPath, "utf8")
  : "";

const appCode = appExists
  ? fs.readFileSync(appPath, "utf8")
  : "";

const hasOnDeleteProp =
  /onDelete\s*:\s*\(\s*id\s*:\s*string\s*\)\s*=>\s*void/.test(
    documentCardCode,
  );

results.push(
  check(
    "DocumentCardProps includes an onDelete callback prop",
    hasOnDeleteProp,
    "Add an onDelete property to DocumentCardProps with a function type that receives a string ID and returns nothing: onDelete: (id: string) => void",
  ),
);

const receivesOnDeleteProp =
  /function\s+DocumentCard\s*\(\s*{\s*document\s*,\s*onDelete\s*}\s*:\s*DocumentCardProps\s*\)/.test(
    documentCardCode,
  );

results.push(
  check(
    "DocumentCard receives the onDelete prop",
    receivesOnDeleteProp,
    "Update the DocumentCard function parameter so it destructures both document and onDelete: ({ document, onDelete }: DocumentCardProps)",
  ),
);

const hasDeleteButton =
  /<button[\s\S]*className=["']document-card__button["'][\s\S]*>\s*Delete\s*<\/button>/.test(
    documentCardCode,
  );

results.push(
  check(
    "DocumentCard includes a Delete button",
    hasDeleteButton,
    'Add a <button> element with the text Delete inside the <article> element. The button should use the document-card__button class.',
  ),
);

const callsOnDeleteWithId =
  /onClick\s*=\s*{\s*\(\s*\)\s*=>\s*onDelete\s*\(\s*document\.id\s*\)\s*}/.test(
    documentCardCode,
  );

results.push(
  check(
    "The Delete button calls onDelete(document.id) when clicked",
    callsOnDeleteWithId,
    "Add an onClick handler that uses an inline arrow function to call onDelete(document.id).",
  ),
);

const passesOnDeleteProp =
  /<DocumentCard[\s\S]*onDelete=\{/.test(appCode);

results.push(
  check(
    "DocumentCard receives an onDelete prop in App.tsx",
    passesOnDeleteProp,
    'Pass an onDelete prop to <DocumentCard />, for example: onDelete={(id) => console.log("Deleting:", id)}',
  ),
);

const logsDocumentId =
  /console\.log\s*\(\s*["']Deleting:["']\s*,\s*id\s*\)/.test(
    appCode,
  );

results.push(
  check(
    "The onDelete callback logs the document ID",
    logsDocumentId,
    'Log the document ID inside the callback using console.log("Deleting:", id).',
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
    "There are no TypeScript errors in the editor",
    buildWorks,
    "Check for missing props, invalid callback types, and JSX syntax errors.",
  ),
);

printResults(results, "RIRAGHAYBPXRQ");