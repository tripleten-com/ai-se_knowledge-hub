import type { Document } from "../../types";
import "./DocumentCard.css";

type DocumentCardProps = {
  document: Document;
};

function DocumentCard({ document }: DocumentCardProps) {
  return (
    <article className="document-card">
      <img
        className="document-card__image"
        src={document.image}
        alt={document.title}
      />
      <h3>{document.title}</h3>
      <p>{document.preview}</p>
    </article>
  );
}

export default DocumentCard;
