

interface SOP {
  id: string;
  title: string;
  description: string;
}

interface SOPViewerProps {
  sop: SOP;
  onClose: () => void;
}

export function SOPViewer({ sop, onClose }: SOPViewerProps) {
  return (
    <div className="sop-modal">
      <div className="sop-modal-content">
        <div className="sop-modal-header">
          <h2>{sop.title}</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <p className="sop-description">{sop.description}</p>
      </div>
    </div>
  );
} 