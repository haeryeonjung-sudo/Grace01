import React, { useState } from 'react';
import { SpecialComplaint, UserRole } from '../types';
import { CivilComplaintMap } from './CivilComplaintMap';
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Scale,
  Send,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
} from 'lucide-react';

interface Props {
  complaints: SpecialComplaint[];
  currentRole: UserRole;
  onToggleUnderstood: (id: string) => void;
  onAddQuestion: (complaintId: string, question: string) => void;
  onAddAnswer: (complaintId: string, qaId: string, answer: string) => void;
}

export const SpecialComplaintsSection: React.FC<Props> = ({
  complaints,
  currentRole,
  onToggleUnderstood,
  onAddQuestion,
  onAddAnswer,
}) => {
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [questionInput, setQuestionInput] = useState<Record<string, string>>({});
  const [answerInput, setAnswerInput] = useState<Record<string, string>>({});
  const [expandedQA, setExpandedQA] = useState<Record<string, boolean>>({});

  const handleSelectFromMap = (id: string) => {
    setSelectedComplaintId(id);
    const element = document.getElementById(`complaint-card-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSendQuestion = (complaintId: string) => {
    const q = questionInput[complaintId]?.trim();
    if (!q) return;
    onAddQuestion(complaintId, q);
    setQuestionInput((prev) => ({ ...prev, [complaintId]: '' }));
  };

  const handleSendAnswer = (complaintId: string, qaId: string) => {
    const a = answerInput[qaId]?.trim();
    if (!a) return;
    onAddAnswer(complaintId, qaId, a);
    setAnswerInput((prev) => ({ ...prev, [qaId]: '' }));
  };

  return (
    <section className="mb-10" id="section-special-complaints">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-rose-600 rounded-sm inline-block"></span>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Siren className="w-5 h-5 text-rose-600" />
              3. 특이사항 및 민원 관리 (악성민원 및 현안 쟁점)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              주의관리 대상 {complaints.length}건
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-4.5">
            상습·반복 민원인 응대 매뉴얼, 공무원 보호조치, 진행 중인 행정심판 및 관내 발생지 현장 지도입니다.
          </p>
        </div>
      </div>

      {/* Interactive GIS Map of Civil Complaints */}
      <div className="mb-6">
        <CivilComplaintMap
          complaints={complaints}
          selectedId={selectedComplaintId}
          onSelectComplaint={handleSelectFromMap}
        />
      </div>

      {/* Warning Complaint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complaints.map((c) => {
          const isSelected = c.id === selectedComplaintId;
          const isUrgent = c.riskLevel === 'urgent';
          const isQAOpen = expandedQA[c.id];

          return (
            <div
              key={c.id}
              id={`complaint-card-${c.id}`}
              className={`flex flex-col bg-white rounded-xl border transition-all duration-200 shadow-xs hover:shadow-md ${
                isSelected
                  ? 'border-rose-500 ring-2 ring-rose-200'
                  : c.isUnderstood
                  ? 'border-emerald-300 ring-1 ring-emerald-100'
                  : 'border-rose-200'
              }`}
            >
              {/* Card Banner */}
              <div
                className={`p-4 border-b flex items-start justify-between gap-2 ${
                  isUrgent
                    ? 'bg-rose-50/70 border-rose-100 text-rose-950'
                    : 'bg-amber-50/70 border-amber-100 text-amber-950'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1 ${
                        isUrgent
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {c.complainerType}
                    </span>
                    <span className="text-[11px] font-bold text-slate-900 bg-white/80 px-2 py-0.5 rounded border border-slate-200/80">
                      {c.complainerName}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold leading-snug mt-1 text-slate-900">
                    {c.title}
                  </h4>
                </div>

                {/* Understand Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleUnderstood(c.id)}
                  className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors border ${
                    c.isUnderstood
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {c.isUnderstood ? '숙지완료' : '숙지확인'}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between text-xs space-y-3">
                {/* Past Issues */}
                <div>
                  <span className="font-bold text-slate-800 text-[11px] block mb-1">
                    📋 과거 주요 이슈 및 성향
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    {c.pastIssues}
                  </p>
                </div>

                {/* Response Manual - Crucial Highlight */}
                <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 text-rose-950">
                  <span className="font-extrabold text-[11px] flex items-center gap-1 text-rose-800 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    대응 및 완화 노하우 (필독 안전수칙)
                  </span>
                  <p className="leading-relaxed font-medium">
                    {c.responseManual}
                  </p>
                </div>

                {/* Legal and Litigation */}
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <Scale className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">법적 조치: </strong>
                      <span>{c.legalActionStatus}</span>
                    </div>
                  </div>

                  {c.ongoingLitigationOrAudit && (
                    <div className="p-2 bg-indigo-50/60 rounded border border-indigo-100 text-indigo-900 leading-tight">
                      <strong>⚖️ 진행 사건: </strong>
                      {c.ongoingLitigationOrAudit}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {c.address}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectFromMap(c.id)}
                    className="text-blue-600 hover:text-blue-800 font-semibold shrink-0"
                  >
                    지도 핀 확인 ➔
                  </button>
                </div>
              </div>

              {/* QA Accordion */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedQA((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
                    }
                    className="text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <MessageSquare className="w-3 h-3" />
                    민원 대응 Q&A ({c.qaThread.length}건)
                    <span>{isQAOpen ? '▲' : '▼'}</span>
                  </button>
                  <span className="text-[10px] text-slate-400">
                    {c.isUnderstood ? '🟢 안전수칙 확인됨' : '🔴 미확인'}
                  </span>
                </div>

                {isQAOpen && (
                  <div className="mt-2 space-y-2 pt-2 border-t border-slate-200">
                    {c.qaThread.map((qa) => (
                      <div key={qa.id} className="bg-white p-2 rounded border border-slate-200 text-[11px]">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-slate-700">❓ {qa.author}</span>
                          <span>{qa.createdAt}</span>
                        </div>
                        <p className="text-slate-800 mt-0.5">{qa.question}</p>
                        {qa.answer && (
                          <div className="mt-1 pt-1 border-t border-slate-100 pl-1.5 text-blue-900 bg-blue-50/50 p-1.5 rounded">
                            <span className="font-bold text-[10px]">💬 {qa.answeredBy}: </span>
                            {qa.answer}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="이 민원인 관련 질문..."
                        value={questionInput[c.id] || ''}
                        onChange={(e) =>
                          setQuestionInput((prev) => ({ ...prev, [c.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendQuestion(c.id);
                        }}
                        className="flex-1 text-[11px] border border-slate-300 rounded px-2 py-1 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendQuestion(c.id)}
                        className="px-2 py-1 bg-slate-800 text-white rounded text-[11px] font-semibold"
                      >
                        등록
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
