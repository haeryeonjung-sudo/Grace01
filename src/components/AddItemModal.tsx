import React, { useState } from 'react';
import {
  StatutoryTask,
  MonthlyIssue,
  SpecialComplaint,
  KeyContact,
  TaskCycle,
} from '../types';
import { BookOpen, Phone, Plus, Siren, X, Zap } from 'lucide-react';

interface Props {
  onAddTask: (task: StatutoryTask) => void;
  onAddIssue: (issue: MonthlyIssue) => void;
  onAddComplaint: (complaint: SpecialComplaint) => void;
  onAddContact: (contact: KeyContact) => void;
  onClose: () => void;
}

export const AddItemModal: React.FC<Props> = ({
  onAddTask,
  onAddIssue,
  onAddComplaint,
  onAddContact,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'task' | 'issue' | 'complaint' | 'contact'>('task');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('기초보장');
  const [taskCycle, setTaskCycle] = useState<Exclude<TaskCycle, '전체'>>('월간');
  const [taskPeriod, setTaskPeriod] = useState('');
  const [taskBasis, setTaskBasis] = useState('');
  const [taskGuideline, setTaskGuideline] = useState('');
  const [taskDocNo, setTaskDocNo] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  // Issue form state
  const [issueTitle, setIssueTitle] = useState('');
  const [issueCategory, setIssueCategory] = useState('현안과제');
  const [issueDeadline, setIssueDeadline] = useState('2026-10-20');
  const [issueDDay, setIssueDDay] = useState(18);
  const [issueDesc, setIssueDesc] = useState('');
  const [issueBudget, setIssueBudget] = useState('');
  const [issueHelper, setIssueHelper] = useState('');

  // Complaint form state
  const [compTitle, setCompTitle] = useState('');
  const [compName, setCompName] = useState('');
  const [compType, setCompType] = useState<'상습반복 악성' | '폭언·협박 위험' | '다수민원 청구' | '현장 위험주의'>('상습반복 악성');
  const [compPast, setCompPast] = useState('');
  const [compManual, setCompManual] = useState('');
  const [compLegal, setCompLegal] = useState('탕정파출소 핫라인 연계');
  const [compAddress, setCompAddress] = useState('충청남도 아산시 탕정면 탕정면로 27');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactRank, setContactRank] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [contactCat, setContactCat] = useState<'internal' | 'external'>('internal');
  const [contactPhone, setContactPhone] = useState('041-540-');
  const [contactMobile, setContactMobile] = useState('010-');
  const [contactEmail, setContactEmail] = useState('@korea.kr');
  const [contactDuties, setContactDuties] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const newTask: StatutoryTask = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      category: taskCategory,
      cycle: taskCycle,
      periodDescription: taskPeriod || '상시 처리',
      statutoryBasis: taskBasis || '관련 법령 규정',
      ordinanceOrGuideline: taskGuideline || '업무 편람 지침',
      onnaraDocNumber: taskDocNo || `아산시 탕정면-${new Date().getFullYear()}-신규호`,
      systems: [
        {
          name: '온나라',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          purpose: '공문 시행 및 업무 관리',
          permissionPath: '온나라 포털 권한 신청',
        },
      ],
      procedure: ['신청 및 서류 검토', '전산 입력 및 결재', '결과 통보'],
      keyNotes: taskNotes || '기한 내 처리 필수',
      isUnderstood: false,
      qaThread: [],
      priority: 'normal',
    };
    onAddTask(newTask);
    onClose();
  };

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;
    const newIssue: MonthlyIssue = {
      id: `issue-${Date.now()}`,
      title: issueTitle.trim(),
      category: issueCategory,
      deadline: issueDeadline,
      dDay: Number(issueDDay) || 14,
      description: issueDesc || '당면 현안 세부 내용',
      urgentPoints: ['관련 부서 사전 협조 요청', '마감일 전 면장 결재 완료'],
      budgetAmount: issueBudget || undefined,
      assignedHelper: issueHelper || '담당 팀장 협조',
      isUnderstood: false,
      warningLevel: 'warning',
      qaThread: [],
    };
    onAddIssue(newIssue);
    onClose();
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle.trim()) return;
    const newComp: SpecialComplaint = {
      id: `comp-${Date.now()}`,
      title: compTitle.trim(),
      complainerName: compName || '민원인',
      complainerType: compType,
      riskLevel: 'urgent',
      pastIssues: compPast || '반복 민원 제기 이력',
      responseManual: compManual || '2인 1조 동석 및 녹취 사전 고지',
      legalActionStatus: compLegal,
      locationName: '관내 주거지역',
      latitude: 37.5835 + (Math.random() - 0.5) * 0.006,
      longitude: 127.0035 + (Math.random() - 0.5) * 0.006,
      address: compAddress,
      isUnderstood: false,
      qaThread: [],
    };
    onAddComplaint(newComp);
    onClose();
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) return;
    const newContact: KeyContact = {
      id: `contact-${Date.now()}`,
      name: contactName.trim(),
      rankTitle: contactRank || '담당 주무관',
      organization: contactOrg || '아산시청 사회복지과',
      category: contactCat,
      phone: contactPhone,
      mobile: contactMobile,
      email: contactEmail,
      duties: contactDuties || '업무 총괄 협조',
      notes: [],
    };
    onAddContact(newContact);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        {/* Modal Top */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm sm:text-base font-bold">
              새 인수인계 항목 등록
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 border-b border-slate-200 text-xs font-semibold bg-slate-50">
          <button
            type="button"
            onClick={() => setActiveTab('task')}
            className={`py-3 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
              activeTab === 'task'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            법정사무
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('issue')}
            className={`py-3 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
              activeTab === 'issue'
                ? 'border-rose-600 text-rose-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            당면현안
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('complaint')}
            className={`py-3 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
              activeTab === 'complaint'
                ? 'border-amber-600 text-amber-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Siren className="w-3.5 h-3.5" />
            특이민원
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-2 flex items-center justify-center gap-1 border-b-2 transition-colors ${
              activeTab === 'contact'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            연락처
          </button>
        </div>

        {/* Modal Body Forms */}
        <div className="p-6 max-h-[70vh] overflow-y-auto text-xs">
          {/* 1. Task Form */}
          {activeTab === 'task' && (
            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  단위 사무명 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 주민자치센터 프로그램 강사료 지출 결의"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    주기 구분
                  </label>
                  <select
                    value={taskCycle}
                    onChange={(e) => setTaskCycle(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="일간">일간</option>
                    <option value="주간">주간</option>
                    <option value="월간">월간</option>
                    <option value="분기">분기</option>
                    <option value="연간">연간</option>
                    <option value="수시">수시</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    분야 카테고리
                  </label>
                  <input
                    type="text"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  근거 법률 및 조례
                </label>
                <input
                  type="text"
                  placeholder="예: 지방자치법 제14조, 아산시 찾아가는 보건복지 조례"
                  value={taskBasis}
                  onChange={(e) => setTaskBasis(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  인수인계 실무 핵심 팁 & 노하우
                </label>
                <textarea
                  rows={2}
                  placeholder="후임자가 실수하기 쉬운 부분, 증빙 서류 누락 주의점 등..."
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  법정사무 등록하기
                </button>
              </div>
            </form>
          )}

          {/* 2. Issue Form */}
          {activeTab === 'issue' && (
            <form onSubmit={handleCreateIssue} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  당면 현안 과제명 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 10월 3분기 복지급여 부정수급 전수 실태조사 보고"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    처리기한 (마감일)
                  </label>
                  <input
                    type="date"
                    value={issueDeadline}
                    onChange={(e) => setIssueDeadline(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    D-Day 일수
                  </label>
                  <input
                    type="number"
                    value={issueDDay}
                    onChange={(e) => setIssueDDay(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  예산 및 집행 예정액
                </label>
                <input
                  type="text"
                  placeholder="예: 4,500,000원 (구비 일상경비)"
                  value={issueBudget}
                  onChange={(e) => setIssueBudget(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  현안 세부 내용 및 추진 계획
                </label>
                <textarea
                  rows={3}
                  placeholder="현안의 배경, 보고 경로, 주의사항..."
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
                >
                  당면현안 등록하기
                </button>
              </div>
            </form>
          )}

          {/* 3. Complaint Form */}
          {activeTab === 'complaint' && (
            <form onSubmit={handleCreateComplaint} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  특이민원 건명 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 대학로 2길 강OO 민원인 (보조금 강요 및 주취 소란)"
                  value={compTitle}
                  onChange={(e) => setCompTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    민원인 성명/인적사항
                  </label>
                  <input
                    type="text"
                    placeholder="예: 강OO (남, 61세)"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    민원 유형
                  </label>
                  <select
                    value={compType}
                    onChange={(e) => setCompType(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="상습반복 악성">상습반복 악성</option>
                    <option value="폭언·협박 위험">폭언·협박 위험</option>
                    <option value="다수민원 청구">다수민원 청구</option>
                    <option value="현장 위험주의">현장 위험주의</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  완화 및 대응 노하우 (안전 매뉴얼)
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 단독 응대 금지, CCTV 민원실 유도, 녹취 고지..."
                  value={compManual}
                  onChange={(e) => setCompManual(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  관내 발생지 주소 (지도 연동)
                </label>
                <input
                  type="text"
                  value={compAddress}
                  onChange={(e) => setCompAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                >
                  특이민원 등록하기
                </button>
              </div>
            </form>
          )}

          {/* 4. Contact Form */}
          {activeTab === 'contact' && (
            <form onSubmit={handleCreateContact} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    성명 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    구분
                  </label>
                  <select
                    value={contactCat}
                    onChange={(e) => setContactCat(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="internal">사내 (시청/주무과)</option>
                    <option value="external">사외 (유관기관/관내)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    소속 기관/부서
                  </label>
                  <input
                    type="text"
                    placeholder="아산시청 사회복지과"
                    value={contactOrg}
                    onChange={(e) => setContactOrg(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    직급/직위
                  </label>
                  <input
                    type="text"
                    placeholder="행정주사보 7급"
                    value={contactRank}
                    onChange={(e) => setContactRank(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    행정전화 (내선)
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    휴대전화
                  </label>
                  <input
                    type="text"
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  주요 담당 업무
                </label>
                <input
                  type="text"
                  placeholder="예: 기초연금 책정 및 수당 전산관리"
                  value={contactDuties}
                  onChange={(e) => setContactDuties(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  연락처 등록하기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
