import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { check, printResults, PROJECT_ROOT } from "./utils.js";

console.log("Lesson 05: Rendering Lists with map\n");

const results = [];

const appPath = path.join(
  PROJECT_ROOT,
  "src",
  "components",
  "App",
  "App.tsx",
);

const documentListPath = path.join(
  PROJECT_ROOT,
  "src",
  "components",
  "DocumentList",
  "DocumentList.tsx",
);

const appExists = fs.existsSync(appPath);
const documentListExists = fs.existsSync(documentListPath);

const appCode = appExists ? fs.readFileSync(appPath, "utf8") : "";
const documentListCode = documentListExists
  ? fs.readFileSync(documentListPath, "utf8")
  : "";

const hasDocumentsArray =
  /const\s+documents\s*:\s*Document\[\]\s*=\s*\[[\s\S]*id\s*:\s*["']1["'][\s\S]*title\s*:\s*["']Security Policy["'][\s\S]*preview\s*:\s*["']Updated access control guidelines\.["'][\s\S]*image\s*:\s*["']\/images\/security-policy\.svg["'][\s\S]*id\s*:\s*["']2["'][\s\S]*title\s*:\s*["']Onboarding Guide["'][\s\S]*preview\s*:\s*["']Getting started with the team\.["'][\s\S]*image\s*:\s*["']\/images\/onboarding-guide\.svg["'][\s\S]*id\s*:\s*["']3["'][\s\S]*title\s*:\s*["']Product Roadmap["'][\s\S]*preview\s*:\s*["']Q3 priorities and milestones\.["'][\s\S]*image\s*:\s*["']\/images\/q3-product-roadmap\.svg["'][\s\S]*\]/.test(appCode);

results.push(
  check(
    "documents array is created with three document objects in App.tsx",
    hasDocumentsArray,
    "Replace sampleDocument with const documents: Document[] = [...] and include three objects with id, title, preview, and image.",
  ),
);

const exportsDocumentList =
  /function\s+DocumentList\s*\(/.test(documentListCode) &&
  /export\s+default\s+(?:function\s+)?DocumentList[\s({;]?/.test(documentListCode);

results.push(
  check(
    "DocumentList.tsx exists and exports DocumentList",
    documentListExists && exportsDocumentList,
    "Create src/components/DocumentList/DocumentList.tsx and export the component with export default DocumentList;.",
  ),
);

const rendersListSection =
  /<section\s+className=["']document-list["'][\s\S]*<\/section>/.test(
    documentListCode,
  );

results.push(
  check(
    "DocumentList renders a list section",
    rendersListSection,
    'Return a <section className="document-list">...</section> from DocumentList.',
  ),
);

const hasDocumentListProps =
  /type\s+DocumentListProps\s*=\s*{[\s\S]*documents\s*:\s*Document\[\]\s*;?[\s\S]*onDelete\s*:\s*\(\s*id\s*:\s*string\s*\)\s*=>\s*void\s*;?[\s\S]*}/.test(
    documentListCode,
  );

const hasTypedFunctionSignature =
  /function\s+DocumentList\s*\(\s*{\s*documents\s*,\s*onDelete\s*}\s*:\s*DocumentListProps\s*\)/.test(
    documentListCode,
  );

results.push(
  check(
    "DocumentList receives typed documents and onDelete props",
    hasDocumentListProps && hasTypedFunctionSignature,
    "Create type DocumentListProps = { documents: Document[]; onDelete: (id: string) => void; } and use function DocumentList({ documents, onDelete }: DocumentListProps).",
  ),
);

// Extract callback parameter name so any identifier is accepted (not just "doc").
const mapCallbackMatch = documentListCode.match(/documents\.map\s*\(\s*\((\w+)\)/);
const mapParam = mapCallbackMatch?.[1];

// Accept parenthesized arrow body or block body, and self-closing or explicit closing tag.
const mapsDocumentsToCards =
  mapParam !== undefined &&
  new RegExp(
    `<DocumentCard[\\s\\S]*key=\\{${mapParam}\\.id\\}[\\s\\S]*document=\\{${mapParam}\\}[\\s\\S]*onDelete=\\{onDelete\\}[\\s\\S]*(?:\\/>|>\\s*<\\/DocumentCard>)`,
  ).test(documentListCode);

results.push(
  check(
    "DocumentList maps documents to DocumentCard components correctly",
    mapsDocumentsToCards,
    "Use documents.map((doc) => <DocumentCard key={doc.id} document={doc} onDelete={onDelete} />) inside the section.",
  ),
);

const importsDocumentList =
  /import\s+DocumentList\s+from\s+["']\.\.\/DocumentList\/DocumentList["'];?/.test(
    appCode,
  );

// Accept either an inline arrow handler or a named handler that calls console.log("Deleting:", id).
const inlineHandler =
  /<DocumentList[\s\S]*documents=\{documents\}[\s\S]*onDelete=\{[\s\S]*console\.log\s*\(\s*["']Deleting:["']\s*,\s*id\s*\)[\s\S]*\}[\s\S]*(?:\/>|>\s*<\/DocumentList>)/.test(
    appCode,
  );

const namedHandler =
  /function\s+\w+\s*\(\s*id\s*:\s*string\s*\)\s*\{[\s\S]*console\.log\s*\(\s*["']Deleting:["']\s*,\s*id\s*\)[\s\S]*\}/.test(
    appCode,
  ) &&
  /<DocumentList[\s\S]*documents=\{documents\}[\s\S]*onDelete=\{\w+\}[\s\S]*(?:\/>|>\s*<\/DocumentList>)/.test(
    appCode,
  );

const rendersDocumentList = inlineHandler || namedHandler;

const directlyRendersDocumentCard =
  /<DocumentCard[\s\S]*\/>/.test(appCode);

results.push(
  check(
    "App.tsx uses DocumentList instead of DocumentCard",
    importsDocumentList && rendersDocumentList && !directlyRendersDocumentCard,
    'Import DocumentList and replace the temporary card with <DocumentList documents={documents} onDelete={(id) => console.log("Deleting:", id)} />.',
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
    "Check for missing imports, invalid prop names, missing key, and JSX or TypeScript syntax errors.",
  ),
);

printResults(results, "XRLZNFGRE");