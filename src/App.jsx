import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  PlayCircle, 
  ClipboardList, 
  LogOut, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  Trash2,
  ChevronLeft,
  Menu
} from 'lucide-react';
import './App.css';

// Import all units
import unit1 from './k3_tryout/data/unit1.json';
import unit2 from './k3_tryout/data/unit2.json';
import unit3 from './k3_tryout/data/unit3.json';
import unit4 from './k3_tryout/data/unit4.json';
import unit5 from './k3_tryout/data/unit5.json';
import unit6 from './k3_tryout/data/unit6.json';
import unit7 from './k3_tryout/data/unit7.json';
import unit8 from './k3_tryout/data/unit8.json';
import unit9 from './k3_tryout/data/unit9.json';

const units = [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9];

const getRandomQuestions = (num = 50) => {
  let selected = [];
  
  // Shuffle each unit individually
  const shuffledUnits = units.map(unit => {
    const copy = [...unit];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  });

  // Round-robin selection to guarantee questions from ALL units
  let unitIndex = 0;
  while (selected.length < num) {
    if (shuffledUnits[unitIndex].length > 0) {
      selected.push(shuffledUnits[unitIndex].pop());
    }
    unitIndex = (unitIndex + 1) % shuffledUnits.length;
  }

  // Shuffle the final 50 selected questions
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }
  
  
  return selected.map(q => {
    // Clone to avoid mutating original data
    const newQ = { ...q, options: { ...q.options } };
    const correctAnswerText = newQ.options[newQ.answer];
    
    // Shuffle the values
    const optionValues = Object.values(newQ.options).sort(() => 0.5 - Math.random());
    const keys = Object.keys(newQ.options);
    
    const newOptions = {};
    optionValues.forEach((val, idx) => {
      const key = keys[idx];
      newOptions[key] = val;
      if (val === correctAnswerText) {
        newQ.answer = key;
      }
    });
    
    newQ.options = newOptions;
    return newQ;
  });
};

// --- Layout Components ---

const Sidebar = ({ isOpen, closeMenu }) => {
  const navItems = [
    { path: '/', label: 'Beranda Simulasi', icon: PlayCircle },
    { path: '/riwayat', label: 'Riwayat Test', icon: ClipboardList },
  ];

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <AlertTriangle size={24} />
        </div>
        <div>
          <div className="brand-title">SISTK3</div>
          <div className="brand-subtitle">Portal Peserta</div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <div className="nav-icon">
                <Icon size={20} />
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

const Header = ({ toggleMobileMenu }) => {
  const [name, setName] = useState(localStorage.getItem('sistk3_name') || 'Peserta K3');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeName = () => {
    const newName = window.prompt('Masukkan nama baru Anda:', name);
    if (newName && newName.trim()) {
      setName(newName.trim());
      localStorage.setItem('sistk3_name', newName.trim());
    }
    setShowMenu(false);
  };

  return (
    <header className="top-header glass-panel">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <Menu size={24} />
        </button>
      </div> {/* Spacer replacing the old search bar */}
      
      <div className="header-profile" style={{ position: 'relative' }} ref={menuRef}>
        <button className="profile-btn" onClick={() => setShowMenu(!showMenu)}>
          <div className="avatar">{name.charAt(0).toUpperCase()}</div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>{name}</span>
        </button>

        {showMenu && (
          <div className="glass-panel fade-in" style={{
            position: 'absolute', 
            top: '110%', 
            right: '0', 
            padding: '8px', 
            zIndex: 10, 
            minWidth: '160px'
          }}>
            <button 
              onClick={changeName}
              style={{ 
                width: '100%', 
                textAlign: 'left', 
                padding: '10px 16px', 
                borderRadius: '8px', 
                color: 'var(--text-primary)',
                transition: '0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Ganti Nama
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

// --- Page Components ---

const DashboardPeserta = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('sistk3_name') || 'Peserta';

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <h1 className="text-gradient">Selamat Datang, {userName}</h1>
        <p>Silahkan mulai simulasi test Kesehatan dan Keselamatan Kerja.</p>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="panel glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <PlayCircle size={64} style={{ color: 'var(--primary)', marginBottom: '24px' }} />
          <h2>Simulasi Test K3 (Acak)</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Test ini terdiri dari 50 soal pilihan ganda yang diambil secara acak dari seluruh materi K3. 
            Waktu pengerjaan adalah 90 menit. Pastikan koneksi stabil.
          </p>
          <button 
            className="nav-item active" 
            style={{ display: 'inline-flex', padding: '16px 32px', fontSize: '18px', background: 'var(--primary)', color: '#fff', justifyContent: 'center' }}
            onClick={() => navigate('/test')}
          >
            Mulai Simulasi Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for Reviewing Questions
const ReviewComponent = ({ questions, answers }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {questions.map((q, idx) => {
        const userAnswer = answers[idx];
        const isCorrect = userAnswer === q.answer;
        
        return (
          <div key={idx} className="glass-panel" style={{ padding: '24px', borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}` }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--text-muted)' }}>{idx + 1}.</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '16px', marginBottom: '16px' }}>{q.question}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(q.options).map(([key, value]) => {
                    let bgColor = 'var(--surface)';
                    let borderColor = 'var(--surface-border)';
                    
                    if (key === q.answer) {
                      bgColor = 'rgba(16, 185, 129, 0.1)';
                      borderColor = '#10b981';
                    } else if (key === userAnswer && !isCorrect) {
                      bgColor = 'rgba(239, 68, 68, 0.1)';
                      borderColor = '#ef4444';
                    }
                    
                    return (
                      <div key={key} style={{ 
                        padding: '12px 16px', 
                        borderRadius: '8px', 
                        background: bgColor,
                        border: `1px solid ${borderColor}`,
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{key}.</span>
                        <span>{value}</span>
                        {key === q.answer && <CheckCircle size={18} color="#10b981" style={{ marginLeft: 'auto' }} />}
                        {key === userAnswer && !isCorrect && <XCircle size={18} color="#ef4444" style={{ marginLeft: 'auto' }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const RiwayatTest = () => {
  const [history, setHistory] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sistk3_history')) || [];
    setHistory(saved.reverse());
  }, []);

  const handleClearAll = () => {
    if(window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat test? Tindakan ini tidak dapat dibatalkan.')) {
      localStorage.removeItem('sistk3_history');
      setHistory([]);
      setSelectedReview(null);
    }
  };

  if (selectedReview) {
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <button 
            onClick={() => setSelectedReview(null)} 
            className="nav-item active" 
            style={{ display: 'inline-flex', padding: '10px 20px', background: 'var(--surface)', gap: '8px' }}
          >
            <ChevronLeft size={18} />
            Kembali ke Daftar Riwayat
          </button>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: selectedReview.score >= 70 ? '#10b981' : '#f59e0b' }}>
              Skor: {selectedReview.score}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Waktu: {new Date(selectedReview.date).toLocaleString()}
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '24px' }}>Review Pembahasan Soal</h2>
        <ReviewComponent questions={selectedReview.questions || []} answers={selectedReview.answers || {}} />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient">Riwayat Simulasi</h1>
          <p>Klik pada riwayat untuk melihat pembahasan dan kunci jawaban.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={handleClearAll}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontWeight: '500', transition: '0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            <Trash2 size={18} />
            Hapus Semua
          </button>
        )}
      </div>
      
      <div className="content-grid" style={{ gridTemplateColumns: '1fr' }}>
        {history.length === 0 ? (
          <div className="panel glass-panel">
            <div className="empty-state">
              <ClipboardList size={64} style={{ marginBottom: '24px', color: 'var(--secondary)' }} />
              <h2>Belum Ada Riwayat</h2>
              <p>Anda belum menyelesaikan test apapun.</p>
            </div>
          </div>
        ) : (
          <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map((item, idx) => (
              <div 
                key={idx} 
                className="panel glass-panel" 
                onClick={() => {
                  if (item.questions) {
                    setSelectedReview(item);
                  } else {
                    alert('Data riwayat ini tidak memiliki detail pertanyaan (kemungkinan versi lama).');
                  }
                }}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: '0.2s transform'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Test K3 (50 Soal)</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Tanggal: {new Date(item.date).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.score >= 70 ? '#10b981' : '#f59e0b' }}>
                    Skor: {item.score}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Benar: {item.correct} / 50
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TestSession = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    // Init questions
    setQuestions(getRandomQuestions(50));
  }, []);

  useEffect(() => {
    if (isFinished || questions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, questions]);

  const handleAnswer = (qIndex, option) => {
    if (isFinished) return;
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const finishTest = () => {
    setIsFinished(true);
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / questions.length) * 100);
    const resultData = {
      date: new Date().toISOString(),
      score,
      correct,
      total: questions.length,
      questions, // Save the questions to display in review
      answers    // Save the user's answers to display in review
    };
    
    setScoreData(resultData);

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('sistk3_history')) || [];
    localStorage.setItem('sistk3_history', JSON.stringify([...existing, resultData]));
  };

  const confirmExit = () => {
    if(window.confirm('Yakin ingin keluar? Hasil test tidak akan disimpan.')) {
      navigate('/');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) return <div className="page-container">Memuat soal...</div>;

  if (isFinished && scoreData) {
    return (
      <div className="fade-in" style={{ padding: '24px' }}>
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', marginBottom: '32px' }}>
          <Award size={64} style={{ color: scoreData.score >= 70 ? '#10b981' : '#f59e0b', margin: '0 auto 16px' }} />
          <h1 className="text-gradient" style={{ fontSize: '48px', marginBottom: '8px' }}>Skor Anda: {scoreData.score}</h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
            Menjawab benar {scoreData.correct} dari {scoreData.total} soal.
          </p>
          <div style={{ marginTop: '24px' }}>
            <button 
              className="nav-item active" 
              style={{ display: 'inline-flex', padding: '12px 24px', background: 'var(--surface-active)', justifyContent: 'center' }}
              onClick={() => navigate('/')}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>

        <h2 style={{ marginBottom: '24px' }}>Pembahasan Soal</h2>
        <ReviewComponent questions={questions} answers={answers} />
      </div>
    );
  }

  return (
    <div className="test-layout fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* Test Header */}
      <header className="glass-panel test-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '20px', margin: 0 }}>SISTK3</h2>
        </div>
        
        <div className="test-header-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '18px' }}>
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={confirmExit}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', padding: '8px 16px', borderRadius: '20px', transition: '0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={18} />
            Keluar Test
          </button>
        </div>
      </header>

      {/* Test Body */}
      <div className="test-body">
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {questions.map((q, idx) => (
            <div key={idx} className="glass-panel question-panel">
              <div className="question-content">
                <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--primary)', minWidth: '24px' }}>{idx + 1}.</div>
                <div style={{ flex: 1 }}>
                  <p className="question-text">{q.question}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(q.options).map(([key, value]) => {
                      const isSelected = answers[idx] === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleAnswer(idx, key)}
                          className="option-btn"
                          style={{
                            background: isSelected ? 'var(--primary-glow)' : 'var(--surface)',
                            border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--surface-border)'}`,
                          }}
                          onMouseOver={(e) => { if(!isSelected) e.currentTarget.style.background = 'var(--surface-hover)' }}
                          onMouseOut={(e) => { if(!isSelected) e.currentTarget.style.background = 'var(--surface)' }}
                        >
                          <span style={{ fontWeight: 'bold', textTransform: 'uppercase', width: '24px' }}>{key}.</span>
                          <span>{value}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '60px' }}>
            <button
              onClick={() => {
                if(window.confirm('Anda yakin ingin mengumpulkan jawaban sekarang?')) {
                  finishTest();
                }
              }}
              style={{
                padding: '16px 48px',
                fontSize: '18px',
                fontWeight: 'bold',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '30px',
                boxShadow: '0 4px 20px var(--primary-glow)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Selesai & Kumpulkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <Router>
      <Routes>
        <Route path="/test" element={<TestSession />} />
        <Route path="*" element={
          <div className="app-layout">
            <Sidebar isOpen={isMobileMenuOpen} closeMenu={() => setIsMobileMenuOpen(false)} />
            <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <main className="main-content">
              <Header toggleMobileMenu={toggleMobileMenu} />
              <div className="page-container">
                <Routes>
                  <Route path="/" element={<DashboardPeserta />} />
                  <Route path="/riwayat" element={<RiwayatTest />} />
                </Routes>
              </div>
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
