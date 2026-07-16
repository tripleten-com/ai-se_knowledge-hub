import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { check, printResults, PROJECT_ROOT } from "./utils.js";

console.log("Lesson 03: Props\n");

const results = [];

const typesPath = path.join(PROJECT_ROOT, "src", "types.ts");

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

const typesExists = fs.existsSync(typesPath);
const documentCardExists = fs.existsSync(documentCardPath);
const appExists = fs.existsSync(appPath);

const typesCode = typesExists
  ? fs.readFileSync(typesPath, "utf8")
  : "";

const documentCardCode = documentCardExists
  ? fs.readFileSync(documentCardPath, "utf8")
  : "";

const appCode = appExists
  ? fs.readFileSync(appPath, "utf8")
  : "";

// Isolate the Document type literal so its fields can be checked
// independently of the order the student declares them in.
const documentTypeMatch = typesCode.match(
  /export\s+type\s+Document\s*=\s*\{[\s\S]*?\}/,
);
const documentTypeBlock = documentTypeMatch?.[0] ?? "";

const exportsDocumentType =
  /id\s*:\s*string/.test(documentTypeBlock) &&
  /title\s*:\s*string/.test(documentTypeBlock) &&
  /preview\s*:\s*string/.test(documentTypeBlock) &&
  /image\s*:\s*string/.test(documentTypeBlock);

results.push(
  check(
    "types.ts exists and exports a valid Document type",
    typesExists && exportsDocumentType,
    "Create src/types.ts and export a Document type with four string fields: id: string, title: string, preview: string, and image: string.",
  ),
);

const importsDocumentTypeInCard =
  /^import\s+type\s+{\s*Document\s*}\s+from\s+["']\.\.\/\.\.\/types["'];?$/m.test(
    documentCardCode,
  );

results.push(
  check(
    "DocumentCard.tsx imports the Document type",
    importsDocumentTypeInCard,
    'Import the Document type from ../../types using import type { Document } from "../../types";',
  ),
);

const hasDocumentCardProps =
  /type\s+DocumentCardProps\s*=\s*{[\s\S]*document\s*:\s*Document[\s\S]*}/.test(
    documentCardCode,
  );

results.push(
  check(
    "DocumentCardProps defines a typed document prop",
    hasDocumentCardProps,
    "Create a DocumentCardProps type with a document property typed as Document: type DocumentCardProps = { document: Document; }",
  ),
);

const receivesTypedDocumentProp =
  /function\s+DocumentCard\s*\(\s*{\s*document\s*}\s*:\s*DocumentCardProps\s*\)/.test(
    documentCardCode,
  ) ||
  /const\s+DocumentCard\s*(?::\s*React\.FC<DocumentCardProps>\s*)?=\s*\(\s*{\s*document\s*}\s*:\s*DocumentCardProps\s*\)\s*=>/.test(
    documentCardCode,
  );

results.push(
  check(
    "DocumentCard receives the document prop with the correct type",
    receivesTypedDocumentProp,
    "Update the DocumentCard function parameter to ({ document }: DocumentCardProps).",
  ),
);

const hasCardStructure =
  /<article\s+className=["']document-card["'][\s\S]*<img[\s\S]*className=["']document-card__image["'][\s\S]*\/>[\s\S]*<h3>[\s\S]*<\/h3>[\s\S]*<p>[\s\S]*<\/p>[\s\S]*<\/article>/.test(
    documentCardCode,
  );

results.push(
  check(
    "DocumentCard includes the required card structure",
    hasCardStructure,
    'Check that the DocumentCard component contains an <article> element with the document-card class, an <img> element with the document-card__image class, an <h3> element, and a <p> element.',
  ),
);

const rendersDocumentData =
  /document\.title/.test(documentCardCode) &&
  /document\.preview/.test(documentCardCode) &&
  /document\.image/.test(documentCardCode);

results.push(
  check(
    "DocumentCard renders the document data in the card",
    rendersDocumentData,
    "Replace the Document placeholder text with values from the document prop such as document.title, document.preview, and document.image.",
  ),
);

const importsDocumentTypeInApp =
  /^import\s+type\s+{\s*Document\s*}\s+from\s+["']\.\.\/\.\.\/types["'];?$/m.test(
    appCode,
  );

results.push(
  check(
    "App.tsx imports the Document type",
    importsDocumentTypeInApp,
    'Import the Document type from ../../types in App.tsx using import type { Document } from "../../types";',
  ),
);

// Isolate the sampleDocument object literal so its fields can be checked
// independently of the order the student writes them in.
const sampleDocumentMatch = appCode.match(
  /const\s+sampleDocument\s*:\s*Document\s*=\s*\{[\s\S]*?\}/,
);
const sampleDocumentBlock = sampleDocumentMatch?.[0] ?? "";

const hasSampleDocument =
  /id\s*:\s*["']1["']/.test(sampleDocumentBlock) &&
  /title\s*:\s*["']Security Policy["']/.test(sampleDocumentBlock) &&
  /preview\s*:\s*["']Updated access control guidelines\.["']/.test(
    sampleDocumentBlock,
  ) &&
  /image\s*:\s*["']\/images\/security-policy\.svg["']/.test(
    sampleDocumentBlock,
  );

results.push(
  check(
    "sampleDocument is created with the correct type and values",
    hasSampleDocument,
    "Create a sampleDocument object typed as Document with the required id, title, preview, and image values: const sampleDocument: Document = { ... }",
  ),
);

const passesDocumentProp =
  /<DocumentCard\s+document=\{sampleDocument\}\s*(?:\/>|>\s*<\/DocumentCard>)/.test(appCode);

results.push(
  check(
    "DocumentCard receives sampleDocument through the document prop",
    passesDocumentProp,
    "Pass sampleDocument to <DocumentCard /> using document={sampleDocument}",
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
    "The app builds successfully",
    buildWorks,
    "Check for TypeScript errors, missing imports, and invalid JSX syntax.",
  ),
);

printResults(results, "CEBCFCBJRE");