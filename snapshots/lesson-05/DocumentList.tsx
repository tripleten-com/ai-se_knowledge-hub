import type { Document } from "../../types";
import DocumentCard from "../DocumentCard/DocumentCard";
import "./DocumentList.css";

type DocumentListProps = {
  documents: Document[];
  onDelete: (id: string) => void;
};

function DocumentList({ documents, onDelete }: DocumentListProps) {
  return (
    <section className="document-list">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} onDelete={onDelete} />
      ))}
    </section>
  );
}

export default DocumentList;
