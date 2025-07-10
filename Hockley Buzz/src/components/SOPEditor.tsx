import { useState, useEffect } from 'react';

interface SOPEditorProps {
  onSave: (sop: { title: string; description: string }) => void;
  onCancel: () => void;
  initialTitle?: string;
  initialDescription?: string;
}

export function SOPEditor({ onSave, onCancel, initialTitle = '', initialDescription = '' }: SOPEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription]);

  const handleSave = () => {
    onSave({
      title,
      description,
    });
  };

  return (
    <div className="sop-modal">
      <div className="sop-modal-content editor">
        <div className="sop-modal-header">
          <h2>{initialTitle ? 'Edit SOP' : 'Create New SOP'}</h2>
          <button onClick={onCancel} className="close-button">×</button>
        </div>
        <div className="editor-form">
          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="SOP Title"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="SOP Description"
              className="form-textarea"
              required
            />
          </div>
        </div>
        <div className="editor-actions always-visible">
          <button onClick={handleSave} className="save-button">
            Save SOP
          </button>
        </div>
      </div>
    </div>
  );
} 