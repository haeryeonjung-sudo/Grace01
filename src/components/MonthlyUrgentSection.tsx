import React, { useState } from 'react';
import { MonthlyIssue, UserRole } from '../types';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  FileSpreadsheet,
  HelpCircle,
  MessageSquare,
  Send,
  User,
  Zap,
} from 'lucide-react';

interface Props {
  issues: MonthlyIssue[];
  currentRole: UserRole;
  onToggleUnderstood: (id: string) => void;
  onAddQuestion: (issueId: string, question: string) => void;
  onAddAnswer: (issueId: string, qaId: string, answer: string) => void;
}

export const MonthlyUrgentSection: React.FC<Props> = ({
  issues,
  currentRole,
  onToggleUnderstood,
  onAddQuestion,
  onAddAnswer,
}) => {
  const [questionInput, setQuestionInput] = useState<Record<string, string>>({});
  const [answerInput, setAnswerInput] = useState<Record<string, string>>({});
  const [expandedQA, setExpandedQA] = useState<Record<string, boolean>>({});

  const sortedIssues = [...issues].sort((a, b) => a.dDay - b.dDay);

  const handleSendQuestion = (issueId: string) => {
    const q = questionInput[issueId]?.trim();
    if (!q) return;
    onAddQuestion(issueId, q);
    setQuestionInput((prev) => ({ ...prev, [issueId]: '' }));
  };

  const handleSendAnswer = (issueId: string, qaId: string) => {
    const a = answerInput[qaId]?.trim();
    if (!a) return;
    onAddAnswer(issueId, qaId, a);
    setAnswerInput((prev) => ({ ...prev, [qaId]: '' }));
  };

  return (
    <section className="mb-10" id="section-monthly-urgent">
      {/* Section Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-rose-600 rounded-sm inline-block"></span>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-rose-600" />
              2. 한 달 내 해결해야 할 사항 (당면 현안 및 예산)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
              {issues.filter((i) => i.isUnderstood).length}/{issues.length}건 숙지 완료
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-4.5">
            인사발령 직후 30일 내 반드시 처리·집행해야 하는 의회 수감자료, 예산 집행, 이월사업 마감 현황입니다.
          </p>
        </div>
      </div>

      {/* Timeline Card Stack */}
      <div className="space-y-4">
        {sortedIssues.map((issue) => {
          const isUrgent = issue.warningLevel === 'urgent' || issue.dDay <= 7;
          const isQAOpen = expandedQA[issue.id];

          return (
            <div
              key={issue.id}
              className={`bg-white rounded-xl border p-4 sm:p-5 transition-all shadow-xs hover:shadow-md ${
                issue.isUnderstood
                  ? 'border-emerald-300 ring-1 ring-emerald-100'
                  : isUrgent
                  ? 'border-rose-300 bg-gradient-to-r from-rose-50/20 to-white'
                  : 'border-slate-200'
              }`}
            >
              {/* Header: D-Day & Title & Checkbox */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  {/* D-Day badge */}
                  <div
                    className={`px-2.5 py-1.5 rounded-xl font-extrabold text-sm shrink-0 flex flex-col items-center justify-center min-w-[58px] ${
                      isUrgent
                        ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                        : issue.warningLevel === 'warning'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    <span className="text-[10px] font-normal leading-none">마감</span>
                    <span className="leading-tight">D-{issue.dDay}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                        {issue.category}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        기한: {issue.deadline}
                      </span>
                      {issue.carriedOver && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                          이월사업
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {issue.title}
                    </h4>
                  </div>
                </div>

                {/* Understand Button */}
                <button
                  type="button"
                  onClick={() => onToggleUnderstood(issue.id)}
                  className={`self-start sm:self-auto shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${
                    issue.isUnderstood
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {issue.isUnderstood ? '현안 숙지완료' : '현안 숙지확인'}
                </button>
              </div>

              {/* Body: Description & Urgent Points */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-3 text-xs">
                {/* Left 7 cols: details */}
                <div className="lg:col-span-7 space-y-2.5">
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {issue.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-800 text-[11px] block">
                      📌 당면 현안 핵심 처리 포인트
                    </span>
                    {issue.urgentPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-600">
                        <span className="text-rose-500 font-bold shrink-0">•</span>
                        <span className="leading-relaxed">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 5 cols: Budget, Contract, Helper */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-2 bg-slate-50/70 p-3 rounded-lg border border-slate-200/70">
                  <div className="space-y-2">
                    {issue.budgetAmount && (
                      <div className="flex items-start gap-2">
                        <Coins className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[11px] text-slate-500 block">집행 예정 예산액:</span>
                          <span className="font-extrabold text-slate-900 text-sm text-emerald-700">
                            {issue.budgetAmount}
                          </span>
                          {issue.budgetItem && (
                            <span className="text-[10px] text-slate-500 block">
                              과목: {issue.budgetItem}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {issue.contractDetails && (
                      <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                        <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[11px] text-slate-500 block">계약/전산 건:</span>
                          <span className="text-slate-800 font-medium">
                            {issue.contractDetails}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      협조: {issue.assignedHelper}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Q&A Toggle & Section */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedQA((prev) => ({ ...prev, [issue.id]: !prev[issue.id] }))
                    }
                    className="text-xs font-semibold text-slate-600 hover:text-blue-600 inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    인수 질문 / 전임자 조언 스레드 ({issue.qaThread.length}건)
                    <span className="text-[10px] text-slate-400">
                      {isQAOpen ? '▲ 접기' : '▼ 펼치기'}
                    </span>
                  </button>

                  <span className="text-[11px] text-slate-400">
                    {issue.isUnderstood ? '🟢 이해 완료됨' : '🔴 미숙지'}
                  </span>
                </div>

                {isQAOpen && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3 animate-fade-in text-xs">
                    {/* QA items */}
                    {issue.qaThread.length === 0 ? (
                      <p className="text-slate-400 text-center py-2 text-[11px]">
                        등록된 현안 질문이 없습니다. 궁금한 점을 남겨보세요.
                      </p>
                    ) : (
                      issue.qaThread.map((qa) => (
                        <div key={qa.id} className="space-y-1.5 bg-white p-2.5 rounded border border-slate-200">
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="font-bold text-slate-800">
                              ❓ {qa.author} ({qa.role})
                            </span>
                            <span>{qa.createdAt}</span>
                          </div>
                          <p className="text-slate-800 font-medium">{qa.question}</p>

                          {qa.answer ? (
                            <div className="mt-1.5 pt-1.5 border-t border-slate-100 pl-2 bg-blue-50/50 p-2 rounded">
                              <div className="flex items-center justify-between text-[10px] text-blue-800 font-bold">
                                <span>💬 {qa.answeredBy}</span>
                                <span>{qa.answeredAt}</span>
                              </div>
                              <p className="text-slate-700 mt-0.5 leading-relaxed">{qa.answer}</p>
                            </div>
                          ) : (
                            <div className="mt-2 pt-1 border-t border-slate-100 flex gap-1.5">
                              <input
                                type="text"
                                placeholder="현안 해결 조언 답변 작성..."
                                value={answerInput[qa.id] || ''}
                                onChange={(e) =>
                                  setAnswerInput((prev) => ({ ...prev, [qa.id]: e.target.value }))
                                }
                                className="flex-1 text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleSendAnswer(issue.id, qa.id)}
                                className="px-2.5 py-1 bg-blue-600 text-white rounded font-semibold text-[11px]"
                              >
                                등록
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}

                    {/* New question */}
                    <div className="flex gap-2 pt-1 border-t border-slate-200">
                      <input
                        type="text"
                        placeholder="이 당면 현안에 대해 질문하기..."
                        value={questionInput[issue.id] || ''}
                        onChange={(e) =>
                          setQuestionInput((prev) => ({ ...prev, [issue.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendQuestion(issue.id);
                        }}
                        className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendQuestion(issue.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                      >
                        <Send className="w-3 h-3" />
                        질문
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
