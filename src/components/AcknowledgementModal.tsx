import { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';

interface AcknowledgementModalProps {
  announcementId: string;
  staffInitials: string[];
  onClose: () => void;
}



export function AcknowledgementModal({ announcementId, staffInitials, onClose }: AcknowledgementModalProps) {
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Lock scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      // Restore scroll when modal is closed
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    // Fetch existing acknowledgements for this announcement
    supabase
      .from('acknowledgements')
      .select('staff_initials, acknowledged')
      .eq('announcement_id', announcementId)
      .then(({ data }) => {
        if (data) {
          const ackMap: Record<string, boolean> = {};
          data.forEach((row: { staff_initials: string; acknowledged: boolean }) => {
            ackMap[row.staff_initials] = row.acknowledged;
          });
          setAcknowledged(ackMap);
        }
      });
  }, [announcementId]);

  const handleToggle = async (initials: string) => {
    const newValue = !acknowledged[initials];
    setAcknowledged((prev) => ({ ...prev, [initials]: newValue }));

    // Upsert (insert or update) the acknowledgement
    await supabase.from('acknowledgements').upsert([
      {
        announcement_id: announcementId,
        staff_initials: initials,
        acknowledged: newValue,
        acknowledged_at: new Date().toISOString(),
      }
    ]);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Acknowledgements</h3>
        <ul>
          {staffInitials.map((initials) => (
            <li key={initials} style={{marginBottom: '0.5rem'}}>
              <label>
                <input
                  type="checkbox"
                  checked={!!acknowledged[initials]}
                  onChange={() => handleToggle(initials)}
                />
                <span style={{marginLeft: '0.5rem'}}>{initials}</span>
              </label>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
} 