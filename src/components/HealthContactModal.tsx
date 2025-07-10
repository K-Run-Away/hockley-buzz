import { useState, useEffect } from 'react';
import { HealthContact } from '../api/healthContacts';

interface HealthContactModalProps {
  initialContact?: Partial<HealthContact>;
  onSave: (contact: { name: string; number: string; description: string; category: string }) => void;
  onCancel: () => void;
}

export function HealthContactModal({ initialContact, onSave, onCancel }: HealthContactModalProps) {
  const [name, setName] = useState(initialContact?.name || '');
  const [number, setNumber] = useState(initialContact?.number || '');
  const [description, setDescription] = useState(initialContact?.description || '');
  const [category, setCategory] = useState(initialContact?.category || '');

  useEffect(() => {
    setName(initialContact?.name || '');
    setNumber(initialContact?.number || '');
    setDescription(initialContact?.description || '');
    setCategory(initialContact?.category || '');
  }, [initialContact]);

  const handleSave = () => {
    onSave({ name, number, description, category });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{initialContact ? 'Edit Health Contact' : 'Add Health Contact'}</h3>
        <div className="form-group">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            value={number}
            onChange={e => setNumber(e.target.value)}
            placeholder="Number"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="Category"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            className="form-textarea"
            required
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <button onClick={onCancel} className="close-button">Cancel</button>
          <button onClick={handleSave} className="save-button">Save</button>
        </div>
      </div>
    </div>
  );
} 