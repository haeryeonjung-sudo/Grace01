import React, { useState } from 'react';
import { StatutoryTask, TaskCycle, UserRole } from '../types';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  Send,
  Sparkles,
  Server,
  FileCheck2,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface Props {
  tasks: StatutoryTask[];
  currentRole: UserRole;
  onToggleUnderstood: (id: string) => void;
  onAddQuestion: (taskId: string, question: string) => void;
  onAddAnswer: (taskId: string, qaId: string, answer: string) => void;
  onOpenLegalModal: (title: string, basis: string, guideline: string, docNo: string) => void;
}

export const StatutoryTasksSection: React.FC<Props> = ({
  tasks,
  currentRole,
  onToggleUnderstood,
  onAddQuestion,
  onAddAnswer,
  onOpenLegalModal,
}) => {
  const [selectedCycle, setSelectedCycle] = useState<TaskCycle>('전체');
  const [questionInput, setQuestionInput] = useState<Record<string, string>>({});
  const [answerInput, setAnswerInput] = useState<Record<string, string>>({});
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'systems' | 'procedure' | 'qa'>>({});

  const cycles: TaskCycle[] = ['전체', '일간', '주간', '월간', '분기', '연간', '수시'];

  const filteredTasks = tasks.filter((t) => {
    if (selectedCycle === '전체') return true;
    return t.cycle === selectedCycle;
  });

  const handleSendQuestion = (taskId: string) => {
    const q = questionInput[taskId]?.trim();
    if (!q) return;
    onAddQuestion(taskId, q);
    setQuestionInput((prev) => ({ ...prev, [taskId]: '' }));
  };

  const handleSendAnswer = (taskId: string, qaId: string) => {
    const a = answerInput[qaId]?.trim();
    if (!a) return;
    onAddAnswer(taskId, qaId, a);
    setAnswerInput((prev) => ({ ...prev, [qaId]: '' }));
  };

  return (
    <section className="mb-10" id="section-statutory-tasks">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-blue-600 rounded-sm inline-block"></span>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              1. 주요 업무 및 법정 사무
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
              {tasks.filter((t) => t.isUnderstood).length}/{tasks.length}건 숙지 완료
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-4.5">
            관련 법령, 업무처리지침, 온나라 공문서 번호 및 연계 행정정보시스템(새올·행복e음·e호조) 매뉴얼입니다.
          </p>
        </div>

        {/* Cycle Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {cycles.map((cycle) => {
            const count = cycle === '전체' ? tasks.length : tasks.filter((t) => t.cycle === cycle).length;
            const isSelected = selectedCycle === cycle;
            return (
              <button
                key={cycle}
                type="button"
                onClick={() => setSelectedCycle(cycle)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cycle} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const currentTab = activeTabMap[task.id] || 'procedure';

          return (
            <div
              key={task.id}
              className={`flex flex-col bg-white rounded-xl border transition-all duration-200 shadow-xs hover:shadow-md ${
                task.isUnderstood
                  ? 'border-emerald-300 ring-1 ring-emerald-100'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Top / Title */}
              <div className="p-4 pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    {/* Cycle Badge */}
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {task.cycle}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {task.category}
                    </span>
                    {task.isUnderstood ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        숙지 완료
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        숙지 진행 중
                      </span>
                    )}
                  </div>

                  {/* Understand Checkbox Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleUnderstood(task.id)}
                    className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors border ${
                      task.isUnderstood
                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {task.isUnderstood ? '숙지완료됨' : '설명듣고 숙지체크'}
                  </button>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 leading-snug">
                  {task.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {task.periodDescription}
                </p>
              </div>

              {/* Statutory Basis & Guidelines Accordion / Preview */}
              <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-semibold text-slate-700 truncate max-w-[280px]">
                    ⚖️ {task.statutoryBasis}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenLegalModal(
                        task.title,
                        task.statutoryBasis,
                        task.ordinanceOrGuideline,
                        task.onnaraDocNumber
                      )
                    }
                    className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-0.5 shrink-0"
                  >
                    법령·공문 번호 <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-slate-500 text-[11px] truncate mt-0.5">
                  온나라 문서: <span className="font-mono text-slate-700">{task.onnaraDocNumber}</span>
                </div>
              </div>

              {/* Sub Navigation Tabs inside Card */}
              <div className="flex border-b border-slate-100 text-xs bg-white px-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveTabMap((prev) => ({ ...prev, [task.id]: 'procedure' }))
                  }
                  className={`pb-2 px-2.5 font-semibold transition-colors border-b-2 ${
                    currentTab === 'procedure'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  업무 절차 & 노하우
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveTabMap((prev) => ({ ...prev, [task.id]: 'systems' }))
                  }
                  className={`pb-2 px-2.5 font-semibold transition-colors border-b-2 flex items-center gap-1 ${
                    currentTab === 'systems'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Server className="w-3 h-3" />
                  연계 시스템 ({task.systems.length})
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveTabMap((prev) => ({ ...prev, [task.id]: 'qa' }))
                  }
                  className={`pb-2 px-2.5 font-semibold transition-colors border-b-2 flex items-center gap-1 ${
                    currentTab === 'qa'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3 h-3" />
                  Q&A 스레드
                  {task.qaThread.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-bold">
                      {task.qaThread.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Card Body Content */}
              <div className="p-4 flex-1 text-xs">
                {currentTab === 'procedure' && (
                  <div>
                    <div className="space-y-1.5 mb-3">
                      <span className="font-semibold text-slate-700 block text-[11px]">
                        [단위사무 처리 흐름]
                      </span>
                      {task.procedure.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-600">
                          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-amber-900 text-[11px] leading-relaxed">
                      <strong className="text-amber-800 flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        인수인계 실무 핵심 팁:
                      </strong>
                      {task.keyNotes}
                    </div>
                  </div>
                )}

                {currentTab === 'systems' && (
                  <div className="space-y-2.5">
                    {task.systems.map((sys, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${sys.badgeColor}`}>
                            {sys.name}
                          </span>
                          <span className="text-[10px] text-slate-500">필수 행정망</span>
                        </div>
                        <p className="text-slate-700 text-[11px] font-medium mb-1">
                          목적: {sys.purpose}
                        </p>
                        <p className="text-slate-500 text-[10px] font-mono bg-white p-1.5 rounded border border-slate-200">
                          🔑 권한신청: {sys.permissionPath}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {currentTab === 'qa' && (
                  <div className="flex flex-col h-full">
                    {/* QA items list */}
                    <div className="space-y-2.5 mb-3 max-h-48 overflow-y-auto pr-1">
                      {task.qaThread.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">
                          아직 질문이 없습니다. 후임자가 궁금한 점을 남겨보세요.
                        </p>
                      ) : (
                        task.qaThread.map((qa) => (
                          <div
                            key={qa.id}
                            className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span className="font-semibold text-slate-700">
                                ❓ {qa.author} ({qa.role})
                              </span>
                              <span>{qa.createdAt}</span>
                            </div>
                            <p className="text-slate-800 font-medium">{qa.question}</p>

                            {/* Answer if exists */}
                            {qa.answer ? (
                              <div className="mt-1.5 pt-1.5 border-t border-slate-200 pl-2 bg-blue-50/60 p-2 rounded">
                                <div className="flex items-center justify-between text-[10px] text-blue-800">
                                  <span className="font-bold">
                                    💬 {qa.answeredBy}
                                  </span>
                                  <span>{qa.answeredAt}</span>
                                </div>
                                <p className="text-slate-700 mt-0.5 leading-relaxed">
                                  {qa.answer}
                                </p>
                              </div>
                            ) : (
                              <div className="mt-2 pt-1 border-t border-slate-200">
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="답변 입력 (전임자/팀장)..."
                                    value={answerInput[qa.id] || ''}
                                    onChange={(e) =>
                                      setAnswerInput((prev) => ({
                                        ...prev,
                                        [qa.id]: e.target.value,
                                      }))
                                    }
                                    className="flex-1 text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSendAnswer(task.id, qa.id)}
                                    className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-700"
                                  >
                                    등록
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* New Question Box */}
                    <div className="mt-auto pt-2 border-t border-slate-100 flex gap-2">
                      <input
                        type="text"
                        placeholder="이 단위사무에 관해 전임자에게 질문하기..."
                        value={questionInput[task.id] || ''}
                        onChange={(e) =>
                          setQuestionInput((prev) => ({
                            ...prev,
                            [task.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendQuestion(task.id);
                        }}
                        className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendQuestion(task.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        질문
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer status info */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {task.isUnderstood && task.understoodAt
                    ? `인수자 확인 완료 (${task.understoodAt})`
                    : '미확인 상태'}
                </span>
                <span className="font-medium text-slate-600">
                  우선순위: {task.priority === 'urgent' ? '🔴 긴급' : task.priority === 'warning' ? '🟡 주의' : '🟢 보통'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
