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

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Isolate the documents array, then each object literal within it, so
// fields can be checked independently of their order within an object and
// documents can be checked independently of their position in the array.
const documentsArrayMatch = appCode.match(
  /const\s+documents\s*:\s*Document\[\]\s*=\s*\[[\s\S]*?\]\s*;/,
);
const documentsArrayBlock = documentsArrayMatch?.[0] ?? "";
const documentObjects = documentsArrayBlock.match(/\{[^{}]*\}/g) ?? [];

const expectedDocuments = [
  {
    id: "1",
    title: "Security Policy",
    preview: "Updated access control guidelines.",
    image: "/images/security-policy.svg",
  },
  {
    id: "2",
    title: "Onboarding Guide",
    preview: "Getting started with the team.",
    image: "/images/onboarding-guide.svg",
  },
  {
    id: "3",
    title: "Product Roadmap",
    preview: "Q3 priorities and milestones.",
    image: "/images/q3-product-roadmap.svg",
  },
];

const hasDocumentsArray = expectedDocuments.every((doc) =>
  documentObjects.some((obj) =>
    Object.entries(doc).every(([key, value]) =>
      new RegExp(`${key}\\s*:\\s*["']${escapeRegExp(value)}["']`).test(obj),
    ),
  ),
);

results.push(
  check(
    "documents array is created with three document objects in App.tsx",
    hasDocumentsArray,
    "Replace sampleDocument with const documents: Document[] = [...] and include three objects with id, title, preview, and image.",
  ),
);

const exportsDocumentList =
  (/function\s+DocumentList\s*\(/.test(documentListCode) ||
    /const\s+DocumentList\s*(?::\s*React\.FC<DocumentListProps>\s*)?=\s*\(/.test(
      documentListCode,
    )) &&
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
  ) ||
  /const\s+DocumentList\s*(?::\s*React\.FC<DocumentListProps>\s*)?=\s*\(\s*{\s*documents\s*,\s*onDelete\s*}\s*:\s*DocumentListProps\s*\)\s*=>/.test(
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

// Isolate the first <DocumentCard /> element so its props can be checked
// independently of the order the student writes them in.
const documentCardTagMatch = documentListCode.match(
  /<DocumentCard\b[\s\S]*?(?:\/>|>[\s\S]*?<\/DocumentCard>)/,
);
const documentCardTag = documentCardTagMatch?.[0] ?? "";

const mapsDocumentsToCards =
  mapParam !== undefined &&
  new RegExp(`key=\\{${mapParam}\\.id\\}`).test(documentCardTag) &&
  new RegExp(`document=\\{${mapParam}\\}`).test(documentCardTag) &&
  /onDelete=\{onDelete\}/.test(documentCardTag);

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

// Isolate the first <DocumentList /> element so its props can be checked
// independently of the order the student writes them in.
const documentListTagMatch = appCode.match(
  /<DocumentList\b[\s\S]*?(?:\/>|>[\s\S]*?<\/DocumentList>)/,
);
const documentListTag = documentListTagMatch?.[0] ?? "";

const hasDocumentsProp = /documents=\{documents\}/.test(documentListTag);

// Accept either an inline arrow handler or a named handler that calls console.log("Deleting:", id).
const inlineHandler =
  hasDocumentsProp &&
  /onDelete=\{[\s\S]*console\.log\s*\(\s*["']Deleting:["']\s*,\s*id\s*\)[\s\S]*\}/.test(
    documentListTag,
  );

const namedHandler =
  /function\s+\w+\s*\(\s*id\s*:\s*string\s*\)\s*\{[\s\S]*console\.log\s*\(\s*["']Deleting:["']\s*,\s*id\s*\)[\s\S]*\}/.test(
    appCode,
  ) &&
  hasDocumentsProp &&
  /onDelete=\{\w+\}/.test(documentListTag);

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