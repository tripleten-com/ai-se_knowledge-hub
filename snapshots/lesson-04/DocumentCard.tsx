import type { Document } from "../../types";
import "./DocumentCard.css";

type DocumentCardProps = {
  document: Document;
  onDelete: (id: string) => void;
};

function DocumentCard({ document, onDelete }: DocumentCardProps) {
  return (
    <article className="document-card">
      <img
        className="document-card__image"
        src={document.image}
        alt={document.title}
      />
      <h3>{document.title}</h3>
      <p>{document.preview}</p>
      <button
        className="document-card__button"
        onClick={() => onDelete(document.id)}
      >
        Delete
      </button>
    </article>
  );
}

export default DocumentCard;
