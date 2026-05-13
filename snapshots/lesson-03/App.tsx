import type { Document } from "../../types";
import Header from "../Header/Header";
import DocumentCard from "../DocumentCard/DocumentCard";

const sampleDocument: Document = {
  id: "1",
  title: "Security Policy",
  preview: "Updated access control guidelines.",
  image: "/images/security-policy.svg",
};

function App() {
  return (
    <>
      <Header />
      <section>
        <DocumentCard document={sampleDocument} />
      </section>
    </>
  );
}

export default App;
