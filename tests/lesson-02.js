import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { check, printResults, PROJECT_ROOT } from "./utils.js";

console.log("Lesson 02: Functional Components\n");

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
const documentCardCode = documentCardExists
  ? fs.readFileSync(documentCardPath, "utf8")
  : "";

const appCode = fs.existsSync(appPath)
  ? fs.readFileSync(appPath, "utf8")
  : "";

results.push(
  check(
    "DocumentCard.tsx exists in src/components/DocumentCard",
    documentCardExists,
    "Create DocumentCard.tsx inside the existing src/components/DocumentCard folder.",
  ),
);

const importsCss =
  /import\s+["']\.\/DocumentCard\.css["'];?/.test(documentCardCode);

results.push(
  check(
    "DocumentCard imports its CSS file",
    importsCss,
    'Import DocumentCard.css into DocumentCard.tsx using import "./DocumentCard.css";.',
  ),
);

const rendersDocumentArticle =
  /<article\s+className=["']document-card["']\s*>\s*Document\s*<\/article>/.test(
    documentCardCode,
  );

results.push(
  check(
    'DocumentCard renders an <article className="document-card"> element with the text "Document"',
    rendersDocumentArticle,
    'Return an <article> element with className="document-card" and put the text "Document" inside it.',
  ),
);

const exportsDocumentCard =
  /export\s+default\s+DocumentCard\s*;?/.test(documentCardCode);

results.push(
  check(
    "DocumentCard is exported as the default export",
    exportsDocumentCard,
    "Export the DocumentCard component using export default DocumentCard;.",
  ),
);

const importsDocumentCard =
  /import\s+DocumentCard\s+from\s+["']\.\.\/DocumentCard\/DocumentCard["'];?/.test(
    appCode,
  );

const rendersDocumentCardInSection =
  /<section>\s*(?:{\/\*[\s\S]*?\*\/}\s*)?<DocumentCard\s*\/>\s*<\/section>/.test(
    appCode,
  );

results.push(
  check(
    "DocumentCard is imported and rendered inside the <section> in App.tsx",
    importsDocumentCard && rendersDocumentCardInSection,
    "Import DocumentCard into App.tsx and render <DocumentCard /> inside the existing <section>.",
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
    "The card is visible in the browser with no errors in the console",
    buildWorks,
    "Check that the component is exported, imported, and rendered with valid JSX syntax.",
  ),
);

printResults(results, "SVEFGPBZCBARAG");