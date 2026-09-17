import React, { useState } from 'react';
import {
  ApprovalStage,
  HandoverMeta,
  StatutoryTask,
  MonthlyIssue,
  SpecialComplaint,
  KeyContact,
} from '../types';
import {
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award,
  AlertCircle,
  FileCheck,
  Zap,
  BookOpen,
  Siren,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  HelpCircle,
  ExternalLink,
  Edit3,
  Flame,
  CheckSquare,
  ListTodo,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  meta: HandoverMeta;
  totalStats: {
    totalItems: number;
    understoodCount: number;
    percent: number;
  };
  categoryStats: {
    statutory: { total: number; understood: number; percent: number };
    monthly: { total: number; understood: number; percent: number };
    complaints: { total: number; understood: number; percent: number };
    contacts: { total: number; understood: number; percent: number };
  };
  approvalStage: ApprovalStage;
  tasks?: StatutoryTask[];
  issues?: MonthlyIssue[];
  complaints?: SpecialComplaint[];
  contacts?: KeyContact[];
  onOpenApprovalModal: () => void;
  onOpenDocModal?: () => void;
  onSelectTab?: (tab: 'all' | 'statutory' | 'urgent' | 'complaints' | 'contacts') => void;
  onToggleTaskUnderstood?: (id: string) => void;
  onToggleIssueUnderstood?: (id: string) => void;
  onToggleComplaintUnderstood?: (id: string) => void;
  onUpdateMeta?: (newMeta: Partial<HandoverMeta>) => void;
}

export const DashboardSummary: React.FC<Props> = ({
  meta,
  totalStats,
  categoryStats,
  approvalStage,
  tasks = [],
  issues = [],
  complaints = [],
  contacts = [],
  onOpenApprovalModal,
  onOpenDocModal,
  onSelectTab,
  onToggleTaskUnderstood,
  onToggleIssueUnderstood,
  onToggleComplaintUnderstood,
  onUpdateMeta,
}) => {
  // Hero interactive sub-tab state
  const [heroTab, setHeroTab] = useState<'overview' | 'radar' | 'timeline' | 'ai_briefing'>('overview');

  // Selected stage inspector in the approval stepper
  const [inspectedStage, setInspectedStage] = useState<number | null>(null);

  // D-Day & Workday editor modal/popover state
  const [showDateEditor, setShowDateEditor] = useState(false);
  const [tempAppointment, setTempAppointment] = useState(meta.appointmentDate);
  const [tempDeadline, setTempDeadline] = useState(meta.deadlineDate);

  // Selected timeline phase in 14-day roadmap
  const [activeRoadmapPhase, setActiveRoadmapPhase] = useState<number>(1);

  // D-Day calculation
  const deadline = new Date(meta.deadlineDate);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const dDay = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Calculate real workdays (excluding Sat & Sun)
  const calculateWorkdays = (startDate: Date, endDate: Date) => {
    let count = 0;
    const cur = new Date(startDate);
    cur.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (cur > end) return 0;

    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  };

  const workdaysRemaining = calculateWorkdays(now, deadline);

  const stages: { key: ApprovalStage; label: string; desc: string; role: string; hint: string }[] = [
    {
      key: 'draft',
      label: '1. 작성 완료',
      desc: '전임자 인계서 초안 작성 및 기본 항목 입력',
      role: `${meta.transferorName} (전임)`,
      hint: '법정사무, 한 달 내 미결 현안, 관내 특이민원 내역을 기안하고 초안을 확정합니다.',
    },
    {
      key: 'receiver_review',
      label: '2. 인수자 확인',
      desc: '후임자 세부항목 숙지 및 전자서명',
      role: `${meta.transfereeName} (후임)`,
      hint: '단위사무 편람 및 시스템 권한을 확인하고 의문사항 Q&A 후 전자서명합니다.',
    },
    {
      key: 'supervisor_review',
      label: '3. 팀장 검토',
      desc: '입회자 검토 및 입회확인 전자서명',
      role: `${meta.supervisorName} (팀장)`,
      hint: '인계인수 이행 상태와 예산 집행 현황을 대조 검증하고 입회 확인 날인합니다.',
    },
    {
      key: 'director_approved',
      label: '4. 면장 최종승인',
      desc: '지방공무원 복무규정 종결 및 보존',
      role: `${meta.directorName} (면장)`,
      hint: '사무인계인수서 최종 승인 결재를 완료하여 법적 인계인수 효력이 발생합니다.',
    },
  ];

  const getStageIndex = (stage: ApprovalStage) => {
    switch (stage) {
      case 'draft':
        return 0;
      case 'receiver_review':
        return 1;
      case 'supervisor_review':
        return 2;
      case 'director_approved':
        return 3;
    }
  };

  const currentStageIndex = getStageIndex(approvalStage);

  // SVG circular progress calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalStats.percent / 100) * circumference;

  // Grade badge based on %
  const getBadgeInfo = (pct: number) => {
    if (pct >= 100) return { text: '인계인수 완료 (완벽 적응)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (pct >= 80) return { text: '우수 진척도 (조기 적응권)', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (pct >= 50) return { text: '정상 진행 중 (핵심사항 집중)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { text: '숙지 시작 단계 (법정사무 우선)', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const badgeInfo = getBadgeInfo(totalStats.percent);

  // Trigger celebration
  const handleRingClick = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.35 },
    });
  };

  // Date saver
  const handleSaveDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateMeta) {
      onUpdateMeta({
        appointmentDate: tempAppointment,
        deadlineDate: tempDeadline,
      });
    }
    setShowDateEditor(false);
  };

  // Urgent and uncompleted items for Risk Radar
  const urgentIssues = issues.filter((i) => i.dDay <= 7 || i.warningLevel === 'urgent');
  const uncompletedTasks = tasks.filter((t) => !t.isUnderstood);
  const urgentComplaints = complaints.filter((c) => c.riskLevel === 'urgent' || !c.isUnderstood);

  // 14-Day Roadmap Phases
  const roadmapPhases = [
    {
      step: 1,
      range: '1 ~ 3일차',
      title: '행정정보망 권한 신청 & 법정사무 편람 열람',
      desc: '새올·온나라·행복e음·e호조 권한 신청, 일간/주간 기본 업무 매뉴얼 숙지',
      focus: '온나라 내부결재 번호 확인 및 새올 행정포털 ID 발급 연계',
      status: totalStats.percent >= 25 ? 'completed' : 'in_progress',
    },
    {
      step: 2,
      range: '4 ~ 7일차',
      title: '10월 미결 현안 및 세출예산 집행 파악',
      desc: '시의회 행감자료 제출, 삼성 후원 김장나눔 추진, 에너지바우처 접수 점검',
      focus: '마감 임박(D-Day) 현안 우선 처리 및 아산시청 사회복지과 협조라인 확인',
      status: totalStats.percent >= 50 ? 'completed' : totalStats.percent >= 25 ? 'in_progress' : 'pending',
    },
    {
      step: 3,
      range: '8 ~ 10일차',
      title: '관내 특이민원 지도 파악 & 현장 합동 순찰',
      desc: '상습 폭언 민원인 대응 매뉴얼(2인1조), 갈산리·트라팰리스·매곡리 현장 방문',
      focus: '탕정파출소 핫라인 및 비상벨 연계 확인, 저장강박 가구 현장 파악',
      status: totalStats.percent >= 75 ? 'completed' : totalStats.percent >= 50 ? 'in_progress' : 'pending',
    },
    {
      step: 4,
      range: '11 ~ 14일차',
      title: '최종 점검 & 4인 전자서명 표준 공문 결재 상신',
      desc: '미비항목 보완, 전임자·후임자·팀장·면장 전자서명 날인 및 인계서 보존',
      focus: '지방공무원 복무규정 제8조 준수 표준서식 출력 및 온나라 보관',
      status: totalStats.percent >= 100 ? 'completed' : totalStats.percent >= 75 ? 'in_progress' : 'pending',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 mb-6 transition-all">
      {/* Top Banner with D-Day, Interactive Date Popover, and Department */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Interactive D-Day Badge */}
          <button
            type="button"
            onClick={() => setShowDateEditor(!showDateEditor)}
            title="클릭하여 발령일정 및 실질 근무일 계산기 열기"
            className="group px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-1.5 shadow-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Clock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>D-{dDay === 0 ? 'DAY' : dDay}</span>
            <Edit3 className="w-3 h-3 opacity-60 group-hover:opacity-100 ml-0.5" />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                정기 인사발령
              </span>
              <button
                type="button"
                onClick={() => setShowDateEditor(!showDateEditor)}
                className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors underline-offset-2 hover:underline"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                발령: {meta.appointmentDate} ~ 마감: {meta.deadlineDate}
                <span className="text-[11px] font-bold text-blue-600 ml-1">
                  (실 근무일 {workdaysRemaining}일 남음)
                </span>
              </button>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {meta.departmentName} {meta.teamName} 업무 인수인계 종합 현황
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Action Pill: Print/View Document */}
          {onOpenDocModal && (
            <button
              type="button"
              onClick={onOpenDocModal}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-slate-600" />
              인계서 미리보기
            </button>
          )}

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${badgeInfo.color} flex items-center gap-1.5`}
          >
            <Award className="w-3.5 h-3.5" />
            {badgeInfo.text}
          </span>
        </div>
      </div>

      {/* Date & Workday Editor Modal / Dropdown */}
      {showDateEditor && (
        <form
          onSubmit={handleSaveDates}
          className="mt-3 p-4 bg-slate-50 border border-blue-200 rounded-xl animate-fade-in text-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>인사발령 일정 및 잔여 실근무일 시뮬레이터</span>
            </div>
            <span className="text-slate-500 text-[11px]">
              * 공무원 실무상 평일(월~금) 기준으로 실질 인계 가능 일수가 계산됩니다.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                인사발령 일자 (시작일)
              </label>
              <input
                type="date"
                value={tempAppointment}
                onChange={(e) => setTempAppointment(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                인수인계 완료 마감일 (보고일)
              </label>
              <input
                type="date"
                value={tempDeadline}
                onChange={(e) => setTempDeadline(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
              />
            </div>

            <div className="flex flex-col justify-center bg-white p-2.5 rounded border border-slate-200">
              <span className="text-[11px] text-slate-500">실질 인계 가용일수</span>
              <span className="font-extrabold text-blue-600 text-sm">
                평일 기준 약 {calculateWorkdays(now, new Date(tempDeadline))}일 (주말 제외)
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowDateEditor(false)}
              className="px-3 py-1 rounded bg-slate-200 text-slate-700 font-semibold"
            >
              닫기
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              일정 업데이트 적용
            </button>
          </div>
        </form>
      )}

      {/* Hero Interactive Sub-Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-200/80 pt-4 pb-2.5 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setHeroTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            heroTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>종합 성취 지표</span>
        </button>

        <button
          type="button"
          onClick={() => setHeroTab('radar')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            heroTab === 'radar'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>긴급 리스크 레이더</span>
          {(urgentIssues.length > 0 || urgentComplaints.length > 0) && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setHeroTab('timeline')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            heroTab === 'timeline'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>14일 인계 로드맵 & 일정</span>
        </button>

        <button
          type="button"
          onClick={() => setHeroTab('ai_briefing')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            heroTab === 'ai_briefing'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>AI 실무 팁 & 노하우</span>
        </button>
      </div>

      {/* ================= HERO TAB 1: OVERVIEW ================= */}
      {heroTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 animate-fade-in">
          {/* Left: Interactive Circular Progress Ring & Total Numbers (4 cols) */}
          <div
            onClick={handleRingClick}
            title="클릭하여 축하 효과 및 진척 세부내용 확인"
            className="lg:col-span-4 flex items-center justify-center sm:justify-start gap-5 bg-slate-50/70 hover:bg-slate-100/70 transition-all p-4 rounded-xl border border-slate-200/60 cursor-pointer group"
          >
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r={radius} stroke="#e2e8f0" strokeWidth="10" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke={
                    totalStats.percent >= 80
                      ? '#16a34a'
                      : totalStats.percent >= 50
                      ? '#2563eb'
                      : '#f59e0b'
                  }
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:scale-110 transition-transform">
                  {totalStats.percent}%
                </span>
                <span className="text-[11px] font-semibold text-slate-500">인수 성취도</span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold text-slate-500">총 인수인계 항목</span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">
                <span className="text-blue-600">{totalStats.understoodCount}</span>
                <span className="text-slate-400 font-normal text-sm"> / {totalStats.totalItems} 건</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-tight">
                원형 차트를 클릭하면 축하 효과와 함께 성취도를 재검증합니다.
              </p>
            </div>
          </div>

          {/* Middle: 4 Interactive Category Progress Bars (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
            {/* Statutory Tasks */}
            <div
              onClick={() => onSelectTab && onSelectTab('statutory')}
              className="p-1.5 -mx-1.5 rounded-lg hover:bg-blue-50/70 transition-all cursor-pointer group"
              title="클릭하여 1. 주요 법정 사무 섹션으로 이동"
            >
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 group-hover:text-blue-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  주요 법정 사무
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                </span>
                <span className="text-slate-600 font-mono text-[11px]">
                  {categoryStats.statutory.understood}/{categoryStats.statutory.total} ({categoryStats.statutory.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${categoryStats.statutory.percent}%` }}
                />
              </div>
            </div>

            {/* Monthly Issues */}
            <div
              onClick={() => onSelectTab && onSelectTab('urgent')}
              className="p-1.5 -mx-1.5 rounded-lg hover:bg-rose-50/70 transition-all cursor-pointer group"
              title="클릭하여 2. 한 달 내 현안 섹션으로 이동"
            >
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 group-hover:text-rose-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  한 달 내 현안
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                </span>
                <span className="text-slate-600 font-mono text-[11px]">
                  {categoryStats.monthly.understood}/{categoryStats.monthly.total} ({categoryStats.monthly.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${categoryStats.monthly.percent}%` }}
                />
              </div>
            </div>

            {/* Special Complaints */}
            <div
              onClick={() => onSelectTab && onSelectTab('complaints')}
              className="p-1.5 -mx-1.5 rounded-lg hover:bg-amber-50/70 transition-all cursor-pointer group"
              title="클릭하여 3. 특이·반복 민원 섹션으로 이동"
            >
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 group-hover:text-amber-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  특이·반복 민원
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                </span>
                <span className="text-slate-600 font-mono text-[11px]">
                  {categoryStats.complaints.understood}/{categoryStats.complaints.total} ({categoryStats.complaints.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${categoryStats.complaints.percent}%` }}
                />
              </div>
            </div>

            {/* Key Contacts */}
            <div
              onClick={() => onSelectTab && onSelectTab('contacts')}
              className="p-1.5 -mx-1.5 rounded-lg hover:bg-emerald-50/70 transition-all cursor-pointer group"
              title="클릭하여 4. 핵심 비상연락망 섹션으로 이동"
            >
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 group-hover:text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  핵심 비상연락망
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                </span>
                <span className="text-slate-600 font-mono text-[11px]">
                  {categoryStats.contacts.understood}/{categoryStats.contacts.total} ({categoryStats.contacts.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${categoryStats.contacts.percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Administrative Approval Progress Line (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-700" />
                  공무원 결재 및 승인 라인
                </span>
                <button
                  type="button"
                  onClick={onOpenApprovalModal}
                  className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-2 flex items-center gap-1"
                >
                  결재 진행 ➔
                </button>
              </div>

              {/* Stepper Bar with interactive click */}
              <div className="grid grid-cols-4 gap-1 relative">
                {stages.map((stg, idx) => {
                  const isPassed = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const isInspected = inspectedStage === idx;

                  return (
                    <button
                      type="button"
                      key={stg.key}
                      onClick={() => setInspectedStage(isInspected ? null : idx)}
                      className="flex flex-col items-center text-center group cursor-pointer"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'
                        } ${isInspected ? 'ring-2 ring-slate-900 scale-110' : ''}`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-1.5 leading-tight ${
                          isCurrent ? 'text-blue-700 font-extrabold' : 'text-slate-600'
                        }`}
                      >
                        {stg.label.split(' ')[1]}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[70px]">
                        {stg.role.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Stage Detail Inspector (shown when a step is clicked) */}
              {inspectedStage !== null && (
                <div className="mt-2.5 p-2.5 bg-white rounded-lg border border-blue-200 text-[11px] space-y-1 animate-fade-in shadow-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{stages[inspectedStage].label}</span>
                    <span className="text-blue-600">{stages[inspectedStage].role}</span>
                  </div>
                  <p className="text-slate-600 leading-tight">
                    {stages[inspectedStage].hint}
                  </p>
                  <button
                    type="button"
                    onClick={onOpenApprovalModal}
                    className="w-full mt-1 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] transition-colors"
                  >
                    이 단계에서 서명 및 승인 처리하기
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-blue-100/80 flex items-center justify-between text-xs text-blue-900">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                현재: <strong className="font-semibold">{stages[currentStageIndex]?.label}</strong>
              </span>
              <button
                type="button"
                onClick={onOpenApprovalModal}
                className="text-[11px] text-blue-700 font-semibold hover:underline"
              >
                {approvalStage === 'director_approved' ? '최종 승인완료' : '검토/서명하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HERO TAB 2: URGENT RISK RADAR ================= */}
      {heroTab === 'radar' && (
        <div className="pt-4 space-y-4 animate-fade-in text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-900">
            <div className="flex items-center gap-2 font-bold">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>긴급 리스크 레이더: 마감 임박 현안 & 특이민원 우선 체크리스트</span>
            </div>
            <span className="text-[11px] text-rose-700">
              히어로에서 바로 숙지 여부를 체크하여 실시간 성취율을 갱신할 수 있습니다.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Urgent Issues */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-800">
                <span className="flex items-center gap-1 text-rose-700">
                  <Zap className="w-3.5 h-3.5" />
                  D-7일 이내 긴급 미결 현안 ({urgentIssues.length}건)
                </span>
                <button
                  type="button"
                  onClick={() => onSelectTab && onSelectTab('urgent')}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  현안 전체보기 ➔
                </button>
              </div>

              {urgentIssues.length === 0 ? (
                <div className="text-slate-400 py-3 text-center">긴급 현안이 모두 숙지되었습니다.</div>
              ) : (
                urgentIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-start justify-between gap-2 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-slate-900 text-xs">{issue.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-100 text-rose-700 font-bold">
                          D-{issue.dDay}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] line-clamp-1">{issue.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleIssueUnderstood && onToggleIssueUnderstood(issue.id)}
                      className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                        issue.isUnderstood
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-300'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      {issue.isUnderstood ? '숙지완료' : '확인체크'}
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Urgent Complaints */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-800">
                <span className="flex items-center gap-1 text-amber-700">
                  <Siren className="w-3.5 h-3.5" />
                  폭언·현장 위험 특이민원 주의 ({urgentComplaints.length}건)
                </span>
                <button
                  type="button"
                  onClick={() => onSelectTab && onSelectTab('complaints')}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  특이민원 전체보기 ➔
                </button>
              </div>

              {urgentComplaints.length === 0 ? (
                <div className="text-slate-400 py-3 text-center">특이민원 대응수칙을 모두 숙지하였습니다.</div>
              ) : (
                urgentComplaints.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-start justify-between gap-2 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-slate-900 text-xs">{comp.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                          {comp.complainerType}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] line-clamp-1">{comp.responseManual}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleComplaintUnderstood && onToggleComplaintUnderstood(comp.id)}
                      className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                        comp.isUnderstood
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-300'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      {comp.isUnderstood ? '숙지완료' : '확인체크'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= HERO TAB 3: 14-DAY ROADMAP & TIMELINE ================= */}
      {heroTab === 'timeline' && (
        <div className="pt-4 space-y-4 animate-fade-in text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-blue-950">
            <div className="flex items-center gap-2 font-bold">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>지방공무원 정기인사 14일 인수인계 표준 이행 로드맵</span>
            </div>
            <span className="text-[11px] text-blue-700 font-semibold">
              단계별 버튼을 클릭하면 실무 체크 포인트를 열람할 수 있습니다.
            </span>
          </div>

          {/* Interactive Phase Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            {roadmapPhases.map((phase) => {
              const isSelected = activeRoadmapPhase === phase.step;

              return (
                <button
                  type="button"
                  key={phase.step}
                  onClick={() => setActiveRoadmapPhase(phase.step)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform -translate-y-0.5'
                      : phase.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-blue-700 text-white'
                          : phase.status === 'completed'
                          ? 'bg-emerald-200 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {phase.range}
                    </span>
                    {phase.status === 'completed' && (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                    )}
                  </div>
                  <h4 className="font-bold text-xs line-clamp-1">{phase.title}</h4>
                  <p
                    className={`text-[10px] mt-1 line-clamp-2 ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {phase.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed View of Active Roadmap Phase */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[11px]">
                  제{activeRoadmapPhase}단계 중점 실무사항
                </span>
                <span className="font-bold text-slate-800 text-xs">
                  {roadmapPhases[activeRoadmapPhase - 1]?.title}
                </span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                💡 <strong>행정 실무 권고사항:</strong> {roadmapPhases[activeRoadmapPhase - 1]?.focus}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenApprovalModal}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              결재 진행단계 확인
            </button>
          </div>
        </div>
      )}

      {/* ================= HERO TAB 4: AI BRIEFING & EXPERT TIPS ================= */}
      {heroTab === 'ai_briefing' && (
        <div className="pt-4 space-y-3.5 animate-fade-in text-xs">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between text-purple-950">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>공무원 맞춤형 실무 행정 가이드 & 전임자 노하우 브리핑</span>
            </div>
            <span className="text-[11px] text-purple-700 font-semibold">
              충남 아산시 탕정면 찾아가는 보건복지팀 특화 실무 가이드
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                온나라 & 행복e음 권한 승계
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                전임자의 온나라 결재선 및 행복e음 업무분장 코드는 발령 당일 아산시청 총무과(정보통신) 및 사회복지과에 내부결재 공문으로 즉시 이관 신청해야 통합사례관리 및 긴급지원 접수 공백이 방지됩니다.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                10월 아산시의회 행정사무감사 수감
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                한들물빛도시 신도시 인구 유입에 따른 1인 가구 및 산단 협력업체 위기 발굴 실적을 부각하고, 삼성디스플레이 나눔 협약 기탁금과 행복키움추진단 사업비는 9월 말 세출원장과 대조 검증을 필히 거치십시오.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                관내 특이민원 및 2인1조 안전수칙
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                갈산리 주취 민원인 방문 시 민원실 분리상담실 유도 및 웨어러블 캠을 작동하고, 폭력 위협 시 민원데스크 하단 비상벨을 즉시 터치하여 탕정파출소(3분 이내 출동 협약)에 즉시 지원을 요청하십시오.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
