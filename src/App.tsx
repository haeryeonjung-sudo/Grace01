import React, { useState, useEffect } from 'react';
import {
  UserRole,
  ApprovalStage,
  HandoverMeta,
  StatutoryTask,
  MonthlyIssue,
  SpecialComplaint,
  KeyContact,
  SignatureRecord,
  QAItem,
} from './types';
import {
  initialHandoverMeta,
  initialStatutoryTasks,
  initialMonthlyIssues,
  initialSpecialComplaints,
  initialKeyContacts,
  initialSignatures,
} from './data/mockData';
import { HeaderNav } from './components/HeaderNav';
import { DashboardSummary } from './components/DashboardSummary';
import { StatutoryTasksSection } from './components/StatutoryTasksSection';
import { MonthlyUrgentSection } from './components/MonthlyUrgentSection';
import { SpecialComplaintsSection } from './components/SpecialComplaintsSection';
import { KeyContactsSection } from './components/KeyContactsSection';
import { HandoverDocumentModal } from './components/HandoverDocumentModal';
import { ApprovalModal } from './components/ApprovalModal';
import { AddItemModal } from './components/AddItemModal';
import { LegalDocModal } from './components/LegalDocModal';
import {
  BookOpen,
  Zap,
  Siren,
  Phone,
  LayoutDashboard,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Building,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // LocalStorage keys
  const STORAGE_PREFIX = 'tangjeong_myeon_v2_';

  // Helper to load or validate tangjeong data
  const loadInitialOrClean = <T,>(key: string, initial: T): T => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!saved) return initial;
      const parsed = JSON.parse(saved);
      const str = JSON.stringify(parsed);
      // If contains stale old district keywords, discard and use initial Tangjeong data
      if (str.includes('종로') || str.includes('혜화') || str.includes('정청렴') || str.includes('최동행')) {
        return initial;
      }
      return parsed;
    } catch {
      return initial;
    }
  };

  // State initialization with localStorage fallback and automatic stale data cleanup
  const [meta, setMeta] = useState<HandoverMeta>(() => loadInitialOrClean('meta', initialHandoverMeta));

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}currentRole`);
    return (saved as UserRole) || 'transferee';
  });

  const [approvalStage, setApprovalStage] = useState<ApprovalStage>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}approvalStage`);
    return (saved as ApprovalStage) || 'receiver_review';
  });

  const [signatures, setSignatures] = useState<Record<string, SignatureRecord>>(() => loadInitialOrClean('signatures', initialSignatures));

  const [tasks, setTasks] = useState<StatutoryTask[]>(() => loadInitialOrClean('tasks', initialStatutoryTasks));

  const [issues, setIssues] = useState<MonthlyIssue[]>(() => loadInitialOrClean('issues', initialMonthlyIssues));

  const [complaints, setComplaints] = useState<SpecialComplaint[]>(() => loadInitialOrClean('complaints', initialSpecialComplaints));

  const [contacts, setContacts] = useState<KeyContact[]>(() => loadInitialOrClean('contacts', initialKeyContacts));

  // Modal states
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [legalModalData, setLegalModalData] = useState<{
    title: string;
    basis: string;
    guideline: string;
    docNo: string;
  } | null>(null);

  // Active section tab
  const [activeTab, setActiveTab] = useState<'all' | 'statutory' | 'urgent' | 'complaints' | 'contacts'>('all');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}meta`, JSON.stringify(meta));
  }, [meta]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}currentRole`, currentRole);
  }, [currentRole]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}approvalStage`, approvalStage);
  }, [approvalStage]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}signatures`, JSON.stringify(signatures));
  }, [signatures]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}tasks`, JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}issues`, JSON.stringify(issues));
  }, [issues]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}complaints`, JSON.stringify(complaints));
  }, [complaints]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}contacts`, JSON.stringify(contacts));
  }, [contacts]);

  // Statistics Calculation
  const totalTasks = tasks.length;
  const understoodTasks = tasks.filter((t) => t.isUnderstood).length;

  const totalIssues = issues.length;
  const understoodIssues = issues.filter((i) => i.isUnderstood).length;

  const totalComplaints = complaints.length;
  const understoodComplaints = complaints.filter((c) => c.isUnderstood).length;

  const totalContacts = contacts.length;
  const understoodContacts = contacts.length; // contacts are considered known once listed

  const totalItems = totalTasks + totalIssues + totalComplaints;
  const totalUnderstood = understoodTasks + understoodIssues + understoodComplaints;
  const totalPercent = totalItems === 0 ? 100 : Math.round((totalUnderstood / totalItems) * 100);

  const totalStats = {
    totalItems,
    understoodCount: totalUnderstood,
    percent: totalPercent,
  };

  const categoryStats = {
    statutory: {
      total: totalTasks,
      understood: understoodTasks,
      percent: totalTasks === 0 ? 100 : Math.round((understoodTasks / totalTasks) * 100),
    },
    monthly: {
      total: totalIssues,
      understood: understoodIssues,
      percent: totalIssues === 0 ? 100 : Math.round((understoodIssues / totalIssues) * 100),
    },
    complaints: {
      total: totalComplaints,
      understood: understoodComplaints,
      percent: totalComplaints === 0 ? 100 : Math.round((understoodComplaints / totalComplaints) * 100),
    },
    contacts: {
      total: totalContacts,
      understood: understoodContacts,
      percent: 100,
    },
  };

  // Toggle Handlers
  const handleToggleTaskUnderstood = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.isUnderstood;
          if (next) {
            confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
          }
          return {
            ...t,
            isUnderstood: next,
            understoodAt: next ? new Date().toLocaleString('ko-KR') : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleToggleIssueUnderstood = (id: string) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const next = !i.isUnderstood;
          if (next) {
            confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
          }
          return {
            ...i,
            isUnderstood: next,
            understoodAt: next ? new Date().toLocaleString('ko-KR') : undefined,
          };
        }
        return i;
      })
    );
  };

  const handleToggleComplaintUnderstood = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isUnderstood;
          if (next) {
            confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
          }
          return {
            ...c,
            isUnderstood: next,
            understoodAt: next ? new Date().toLocaleString('ko-KR') : undefined,
          };
        }
        return c;
      })
    );
  };

  // Q&A Handlers
  const handleAddTaskQuestion = (taskId: string, questionText: string) => {
    const authorName =
      currentRole === 'transferee'
        ? `${meta.transfereeName} (후임)`
        : currentRole === 'transferor'
        ? `${meta.transferorName} (전임)`
        : currentRole === 'supervisor'
        ? `${meta.supervisorName} (팀장)`
        : `${meta.directorName} (면장)`;

    const newQA: QAItem = {
      id: `qa-${Date.now()}`,
      author: authorName,
      role: currentRole === 'transferee' ? '인수자' : '인계자',
      question: questionText,
      createdAt: new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, qaThread: [...t.qaThread, newQA] } : t))
    );
  };

  const handleAddTaskAnswer = (taskId: string, qaId: string, answerText: string) => {
    const responder =
      currentRole === 'transferor'
        ? `${meta.transferorName} (전임)`
        : currentRole === 'supervisor'
        ? `${meta.supervisorName} (팀장)`
        : '인계 담당자';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          qaThread: t.qaThread.map((qa) =>
            qa.id === qaId
              ? {
                  ...qa,
                  answer: answerText,
                  answeredBy: responder,
                  answeredAt: new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                }
              : qa
          ),
        };
      })
    );
  };

  const handleAddIssueQuestion = (issueId: string, questionText: string) => {
    const authorName =
      currentRole === 'transferee' ? `${meta.transfereeName} (후임)` : `${meta.transferorName} (전임)`;
    const newQA: QAItem = {
      id: `iqa-${Date.now()}`,
      author: authorName,
      role: '인수자',
      question: questionText,
      createdAt: new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, qaThread: [...i.qaThread, newQA] } : i))
    );
  };

  const handleAddIssueAnswer = (issueId: string, qaId: string, answerText: string) => {
    const responder = `${meta.transferorName} (전임)`;
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id !== issueId) return i;
        return {
          ...i,
          qaThread: i.qaThread.map((qa) =>
            qa.id === qaId
              ? {
                  ...qa,
                  answer: answerText,
                  answeredBy: responder,
                  answeredAt: new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                }
              : qa
          ),
        };
      })
    );
  };

  const handleAddComplaintQuestion = (complaintId: string, questionText: string) => {
    const authorName =
      currentRole === 'transferee' ? `${meta.transfereeName} (후임)` : `${meta.transferorName} (전임)`;
    const newQA: QAItem = {
      id: `cqa-${Date.now()}`,
      author: authorName,
      role: '인수자',
      question: questionText,
      createdAt: new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, qaThread: [...c.qaThread, newQA] } : c))
    );
  };

  const handleAddComplaintAnswer = (complaintId: string, qaId: string, answerText: string) => {
    const responder = `${meta.transferorName} (전임)`;
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          qaThread: c.qaThread.map((qa) =>
            qa.id === qaId
              ? {
                  ...qa,
                  answer: answerText,
                  answeredBy: responder,
                  answeredAt: new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                }
              : qa
          ),
        };
      })
    );
  };

  // Contacts Note Handler
  const handleAddContactNote = (contactId: string, author: string, content: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id !== contactId) return c;
        const newNote = {
          id: `note-${Date.now()}`,
          author,
          date: new Date().toLocaleDateString('ko-KR'),
          content,
        };
        return { ...c, notes: [newNote, ...c.notes] };
      })
    );
  };

  // Approval & Signature Handlers
  const handleSaveSignature = (role: string, signatureDataUrl: string, comment: string) => {
    setSignatures((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        signed: true,
        signatureImage: signatureDataUrl || prev[role]?.signatureImage,
        signedAt: new Date().toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        comment: comment || prev[role]?.comment,
      },
    }));
  };

  const handleAdvanceStage = (nextStage: ApprovalStage) => {
    setApprovalStage(nextStage);
  };

  const handleRejectStage = (targetStage: ApprovalStage, reason: string) => {
    setApprovalStage(targetStage);
    alert(`이전 단계로 반려되었습니다.\n반려 사유: ${reason}`);
  };

  // Update Meta Handler (e.g., from D-Day editor in Hero)
  const handleUpdateMeta = (updated: Partial<HandoverMeta>) => {
    setMeta((prev) => ({ ...prev, ...updated }));
  };

  // Switch tab and smooth scroll to section nav
  const handleSelectTabAndScroll = (tab: 'all' | 'statutory' | 'urgent' | 'complaints' | 'contacts') => {
    setActiveTab(tab);
    const element = document.getElementById('section-nav-tabs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Clean up any legacy localStorage from previous district templates on load
  useEffect(() => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('ieum_gongmu_v1_')) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // ignore
    }
  }, []);

  // Reset Data to Factory Defaults
  const handleResetData = () => {
    if (window.confirm('충남 아산시 탕정면 인수인계 기본 데이터로 초기화하시겠습니까?')) {
      localStorage.clear();
      setMeta(initialHandoverMeta);
      setTasks(initialStatutoryTasks);
      setIssues(initialMonthlyIssues);
      setComplaints(initialSpecialComplaints);
      setContacts(initialKeyContacts);
      setSignatures(initialSignatures);
      setApprovalStage('receiver_review');
      setCurrentRole('transferee');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* 1. Header Navigation */}
      <HeaderNav
        meta={meta}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        approvalStage={approvalStage}
        onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
        onOpenDocModal={() => setIsDocModalOpen(true)}
        onOpenAddItemModal={() => setIsAddItemModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 2. Top Dashboard Summary & Progress Ring */}
        <DashboardSummary
          meta={meta}
          totalStats={totalStats}
          categoryStats={categoryStats}
          approvalStage={approvalStage}
          tasks={tasks}
          issues={issues}
          complaints={complaints}
          contacts={contacts}
          onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
          onOpenDocModal={() => setIsDocModalOpen(true)}
          onSelectTab={handleSelectTabAndScroll}
          onToggleTaskUnderstood={handleToggleTaskUnderstood}
          onToggleIssueUnderstood={handleToggleIssueUnderstood}
          onToggleComplaintUnderstood={handleToggleComplaintUnderstood}
          onUpdateMeta={handleUpdateMeta}
        />

        {/* Sticky Section Navigation Tabs */}
        <div
          id="section-nav-tabs"
          className="sticky top-[108px] z-20 bg-slate-50/95 backdrop-blur-md py-2.5 mb-6 border-b border-slate-200"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                전체 한눈에 보기
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('statutory')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'statutory'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                1. 법정 사무 ({tasks.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('urgent')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'urgent'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-rose-500" />
                2. 한달 내 현안 ({issues.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('complaints')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'complaints'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <Siren className="w-3.5 h-3.5 text-amber-500" />
                3. 특이민원·지도 ({complaints.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contacts')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'contacts'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                4. 업무 연락처 ({contacts.length})
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                실시간 인계 진행 중
              </span>
            </div>
          </div>
        </div>

        {/* 3. The 4 Core Administrative Sections */}
        {(activeTab === 'all' || activeTab === 'statutory') && (
          <StatutoryTasksSection
            tasks={tasks}
            currentRole={currentRole}
            onToggleUnderstood={handleToggleTaskUnderstood}
            onAddQuestion={handleAddTaskQuestion}
            onAddAnswer={handleAddTaskAnswer}
            onOpenLegalModal={(title, basis, guideline, docNo) =>
              setLegalModalData({ title, basis, guideline, docNo })
            }
          />
        )}

        {(activeTab === 'all' || activeTab === 'urgent') && (
          <MonthlyUrgentSection
            issues={issues}
            currentRole={currentRole}
            onToggleUnderstood={handleToggleIssueUnderstood}
            onAddQuestion={handleAddIssueQuestion}
            onAddAnswer={handleAddIssueAnswer}
          />
        )}

        {(activeTab === 'all' || activeTab === 'complaints') && (
          <SpecialComplaintsSection
            complaints={complaints}
            currentRole={currentRole}
            onToggleUnderstood={handleToggleComplaintUnderstood}
            onAddQuestion={handleAddComplaintQuestion}
            onAddAnswer={handleAddComplaintAnswer}
          />
        )}

        {(activeTab === 'all' || activeTab === 'contacts') && (
          <KeyContactsSection
            contacts={contacts}
            currentRole={currentRole}
            onAddNote={handleAddContactNote}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 print:hidden mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              이음
            </div>
            <div>
              <p className="font-bold text-slate-200">
                이음공무 - 공무원 맞춤형 스마트 업무 인수인계 시스템
              </p>
              <p className="text-[11px] text-slate-400">
                근거: 「지방공무원 복무규정」 제8조(사무인계) 및 「행정 효율과 협업 촉진에 관한 규정」
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>연계시스템: 온나라·새올·행복e음·e호조·나이스</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              보안암호화 가동 중
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isDocModalOpen && (
        <HandoverDocumentModal
          meta={meta}
          tasks={tasks}
          issues={issues}
          complaints={complaints}
          contacts={contacts}
          signatures={signatures}
          approvalStage={approvalStage}
          onClose={() => setIsDocModalOpen(false)}
        />
      )}

      {isApprovalModalOpen && (
        <ApprovalModal
          meta={meta}
          approvalStage={approvalStage}
          currentRole={currentRole}
          signatures={signatures}
          onSaveSignature={handleSaveSignature}
          onAdvanceStage={handleAdvanceStage}
          onRejectStage={handleRejectStage}
          onClose={() => setIsApprovalModalOpen(false)}
        />
      )}

      {isAddItemModalOpen && (
        <AddItemModal
          onAddTask={(task) => setTasks((prev) => [task, ...prev])}
          onAddIssue={(issue) => setIssues((prev) => [issue, ...prev])}
          onAddComplaint={(complaint) => setComplaints((prev) => [complaint, ...prev])}
          onAddContact={(contact) => setContacts((prev) => [contact, ...prev])}
          onClose={() => setIsAddItemModalOpen(false)}
        />
      )}

      {legalModalData && (
        <LegalDocModal
          title={legalModalData.title}
          statutoryBasis={legalModalData.basis}
          guideline={legalModalData.guideline}
          onnaraDocNumber={legalModalData.docNo}
          onClose={() => setLegalModalData(null)}
        />
      )}
    </div>
  );
}
