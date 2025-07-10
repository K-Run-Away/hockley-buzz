import { useState, useEffect, useRef } from 'react'
import { SOPViewer } from './components/SOPViewer'
import { SOPEditor } from './components/SOPEditor'
import { SOP, getSOPs, saveSOP, updateSOP } from './api/sops'
import './App.css'
import { AcknowledgementModal } from './components/AcknowledgementModal'
import { Announcement, getAnnouncements, addAnnouncement } from './api/announcements'
import { HealthContact, getHealthContacts, addHealthContact, updateHealthContact, deleteHealthContact } from './api/healthContacts'
import { HealthContactModal } from './components/HealthContactModal'

const staffGroups = {
  clinical: [
    'VB', 'SB', 'SA', 'MN', 'SN', 'JBl', 'GB', 'KH', 'DH', 'AG', 'AI', 'JBa', 'KS', 'KW', 'AG', 'HF'
  ],
  admin: [
    'AB', 'AS', 'NK', 'RL', 'LL', 'CC', 'DB'
  ]
};

function App() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: ''
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  const [sops, setSops] = useState<SOP[]>([]);

  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [sopSearchTerm, setSopSearchTerm] = useState('');

  const [editingSOP, setEditingSOP] = useState<SOP | null>(null);

  const [isSOPDropdownOpen, setIsSOPDropdownOpen] = useState(false);
  const [isContactsDropdownOpen, setIsContactsDropdownOpen] = useState(false);
  const sopDropdownRef = useRef<HTMLDivElement>(null);
  const contactsDropdownRef = useRef<HTMLDivElement>(null);

  const [ackModalAnnouncementId, setAckModalAnnouncementId] = useState<string | null>(null);

  const [healthContacts, setHealthContacts] = useState<HealthContact[]>([]);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<HealthContact | null>(null);

  useEffect(() => {
    loadAnnouncements();
    loadSOPs();
    loadHealthContacts();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sopDropdownRef.current &&
        !sopDropdownRef.current.contains(event.target as HTMLElement)
      ) {
        setIsSOPDropdownOpen(false);
      }
      if (
        contactsDropdownRef.current &&
        !contactsDropdownRef.current.contains(event.target as HTMLElement)
      ) {
        setIsContactsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSOPs = async () => {
    try {
      const data = await getSOPs();
      setSops(data);
    } catch (err) {
      console.error('Error loading SOPs:', err);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error('Error loading announcements:', err);
    }
  };

  const loadHealthContacts = async () => {
    try {
      const data = await getHealthContacts();
      setHealthContacts(data);
    } catch (err) {
      console.error('Error loading health contacts:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncement.title.trim() && newAnnouncement.content.trim()) {
      try {
        const announcement = await addAnnouncement({
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          date: new Date().toLocaleDateString(),
        });
        setAnnouncements([announcement, ...announcements]);
        setNewAnnouncement({ title: '', content: '' });
        setIsFormVisible(false);
      } catch (err) {
        console.error('Error adding announcement:', err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = healthContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isEditorVisible, setIsEditorVisible] = useState(false);

  const handleEditSOP = (sop: SOP) => {
    setEditingSOP(sop);
    setIsEditorVisible(true);
  };

  const handleSaveSOP = async (newSOP: { title: string; description: string }) => {
    try {
      if (editingSOP) {
        const updated = await updateSOP(editingSOP.id, newSOP);
        if (!updated || !updated.id) {
          alert('Failed to update SOP.');
          return;
        }
        setSops(sops.map(sop => sop.id === updated.id ? updated : sop));
        setEditingSOP(null);
      } else {
        const savedSOP = await saveSOP(newSOP);
        setSops([savedSOP, ...sops]);
      }
      setIsEditorVisible(false);
    } catch (err: any) {
      alert('Failed to save SOP: ' + (err?.message || err));
      console.error('Error saving SOP:', err);
    }
  };

  const filteredSOPs = sops.filter(sop =>
    sop.title.toLowerCase().includes(sopSearchTerm.toLowerCase()) ||
    sop.description.toLowerCase().includes(sopSearchTerm.toLowerCase())
  );

  const handleSaveContact = async (contact: { name: string; number: string; description: string; category: string }) => {
    try {
      if (editingContact) {
        const updated = await updateHealthContact(editingContact.id, contact);
        setHealthContacts(healthContacts.map(c => c.id === updated.id ? updated : c));
        setEditingContact(null);
      } else {
        const newContact = await addHealthContact(contact);
        setHealthContacts([newContact, ...healthContacts]);
      }
      setIsContactModalVisible(false);
    } catch (err: any) {
      alert('Failed to save contact: ' + (err?.message || err));
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await deleteHealthContact(id);
      setHealthContacts(healthContacts.filter(c => c.id !== id));
    } catch (err: any) {
      alert('Failed to delete contact: ' + (err?.message || err));
    }
  };

  return (
    <div className="app">
      <div className="floating-banner">
        Next clinical meeting 28th June 2025 at 1pm! Check your NHS emails
      </div>
      <header className="header">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1>Hockley Buzz</h1>
        </div>
      </header>
      <main className="main-content">
        <section className="noticeboard">
          <div className="noticeboard-header">
            <h2>Noticeboard</h2>
            <button 
              className="add-button"
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              {isFormVisible ? 'Cancel' : '+ New Announcement'}
            </button>
          </div>

          {isFormVisible && (
            <form onSubmit={handleSubmit} className="announcement-form">
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={newAnnouncement.title}
                  onChange={handleInputChange}
                  placeholder="Announcement Title"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="content"
                  value={newAnnouncement.content}
                  onChange={handleInputChange}
                  placeholder="Announcement Content"
                  className="form-textarea"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Post Announcement
              </button>
            </form>
          )}

          <div className="announcements">
            {announcements.map(announcement => (
              <div key={announcement.id} className="announcement-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{announcement.title}</h3>
                  <button
                    className="add-button"
                    style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}
                    onClick={() => setAckModalAnnouncementId(String(announcement.id))}
                  >
                    View Acknowledgements
                  </button>
                </div>
                <p>{announcement.content}</p>
                <small>{announcement.date}</small>
                {ackModalAnnouncementId === String(announcement.id) && (
                  <AcknowledgementModal
                    announcementId={String(announcement.id)}
                    staffInitials={[...staffGroups.clinical, ...staffGroups.admin]}
                    onClose={() => setAckModalAnnouncementId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
        <section className="right-panel">
          <div className="sop-search" ref={sopDropdownRef}>
            <div className="sop-header">
              <h2>Standard Operating Procedures</h2>
              <button 
                className="add-button"
                onClick={() => setIsEditorVisible(true)}
              >
                + New SOP
              </button>
            </div>
            <div className="search-box" style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search SOPs..."
                className="search-input"
                value={sopSearchTerm}
                onChange={(e) => setSopSearchTerm(e.target.value)}
                onFocus={() => setIsSOPDropdownOpen(true)}
              />
              <button
                className="dropdown-toggle"
                onClick={() => setIsSOPDropdownOpen((open) => !open)}
                aria-label="Toggle SOP dropdown"
                style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                tabIndex={-1}
              >
                ▼
              </button>
              {isSOPDropdownOpen && (
                <div className="dropdown-list">
                  {filteredSOPs.length === 0 ? (
                    <div className="dropdown-empty">No results found</div>
                  ) : (
                    filteredSOPs.map(sop => (
                      <div 
                        key={sop.id} 
                        className="sop-card"
                        onClick={() => { setSelectedSOP(sop); setIsSOPDropdownOpen(false); }}
                        style={{ cursor: 'pointer' }}
                      >
                        <h3>{sop.title}</h3>
                        <p>{sop.description}</p>
                        <small>Last updated: {new Date(sop.updated_at || sop.created_at || '').toLocaleDateString()}</small>
                        <button className="add-button" onClick={(e) => { e.stopPropagation(); handleEditSOP(sop); }} style={{marginLeft: 8, fontSize: '0.9rem', padding: '0.4rem 1rem'}}>Edit</button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="contacts">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Useful Health Numbers</h2>
              <button className="add-button" onClick={() => { setEditingContact(null); setIsContactModalVisible(true); }}>
                + Add Number
              </button>
            </div>
            <div className="search-box" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search health services..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsContactsDropdownOpen(true)}
              />
              <button
                className="dropdown-toggle"
                onClick={() => setIsContactsDropdownOpen((open) => !open)}
                aria-label="Toggle contacts dropdown"
                style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                tabIndex={-1}
              >
                ▼
              </button>
              {isContactsDropdownOpen && (
                <div className="dropdown-list">
                  {filteredContacts.length === 0 ? (
                    <div className="dropdown-empty">No results found</div>
                  ) : (
                    filteredContacts.map(contact => (
                      <div key={contact.id} className="contact-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3>{contact.name}</h3>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="add-button" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }} onClick={() => { setEditingContact(contact); setIsContactModalVisible(true); }}>Edit</button>
                            <button className="add-button" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem', background: '#ffb3b3', color: '#222' }} onClick={() => handleDeleteContact(contact.id)}>Delete</button>
                          </div>
                        </div>
                        <p className="contact-number">{contact.number}</p>
                        <p className="contact-description">{contact.description}</p>
                        <span className="contact-category">{contact.category}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            {isContactModalVisible && (
              <HealthContactModal
                initialContact={editingContact || undefined}
                onSave={handleSaveContact}
                onCancel={() => { setIsContactModalVisible(false); setEditingContact(null); }}
              />
            )}
          </div>
        </section>
      </main>
      {selectedSOP && (
        <SOPViewer
          sop={selectedSOP}
          onClose={() => setSelectedSOP(null)}
        />
      )}
      {isEditorVisible && (
        <SOPEditor
          onSave={handleSaveSOP}
          onCancel={() => { setIsEditorVisible(false); setEditingSOP(null); }}
          initialTitle={editingSOP?.title}
          initialDescription={editingSOP?.description}
        />
      )}
    </div>
  )
}

export default App 