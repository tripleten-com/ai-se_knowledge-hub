import type { Document } from "../../types";
import Header from "../Header/Header";
import DocumentList from "../DocumentList/DocumentList";

const documents: Document[] = [
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

function App() {
  function handleDelete(id: string) {
    console.log("Deleting:", id);
  }
  return (
    <>
      <Header />
      <section>
        <DocumentList documents={documents} onDelete={handleDelete} />
      </section>
    </>
  );
}

export default App;
