import { useState } from "react";

export default function TypeHere({ imageURL, onSubmit, onCancel }) {
  const [comment, setComment] = useState("");

  return (
    <div className="type-here-container">
      <input
        type="text"
        placeholder="Ваш комментарий..."
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit(comment);
          } else if (e.key === 'Escape') {
            onCancel();
          }
        }}
      />
      <div className="button-group">
        <button onClick={() => onSubmit(comment)}>Добавить в избранное</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  );
}
