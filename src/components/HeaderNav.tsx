import React from 'react';
import { UserRole, HandoverMeta, ApprovalStage } from '../types';
import {
  FileText,
  CheckCircle2,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Building,
} from 'lucide-react';

interface Props {
  meta: HandoverMeta;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  approvalStage: ApprovalStage;
  onOpenApprovalModal: () => void;
  onOpenDocModal: () => void;
  onOpenAddItemModal: () => void;
  onResetData: () => void;
}

export const HeaderNav: React.FC<Props> = ({
  meta,
  currentRole,
  onChangeRole,
  approvalStage,
  onOpenApprovalModal,
  onOpenDocModal,
  onOpenAddItemModal,
  onResetData,
}) => {
  const roleLabels: Record<UserRole, { label: string; name: string; title: string; badge: string }> = {
    transferee: {
      label: '인수자 (후임)',
      name: meta.transfereeName,
      title: meta.transfereeRank,
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    transferor: {
      label: '인수인계자 (전임)',
      name: meta.transferorName,
      title: meta.transferorRank,
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    supervisor: {
      label: '입회자 (팀장)',
      name: meta.supervisorName,
      title: meta.supervisorRank,
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    director: {
      label: '최종결재권자 (면장)',
      name: meta.directorName,
      title: meta.directorRank,
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Government Security Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-100 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            정부 행정망 보안접속 (GPKI/EPKI 인증 인가)
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            인사발령 기간 한시적 보안권한 승인 [유효기간: 2026.10.05까지]
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span>규정 근거: 「지방공무원 복무규정」 제8조 (사무인계)</span>
          <button
            type="button"
            onClick={onResetData}
            title="기본 모의데이터로 초기화"
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            초기화
          </button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Department */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-black text-lg shadow-sm border border-blue-900/20">
            이음
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                이음공무
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
                스마트 인수인계
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-400" />
              {meta.orgName} {meta.departmentName} {meta.teamName} · {meta.positionName}
            </p>
          </div>
        </div>

        {/* Current User Role Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role selector dropdown */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-medium px-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-600" />
              현재 로그인:
            </span>
            <select
              id="role-switcher-select"
              value={currentRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="text-xs font-semibold bg-white text-slate-800 border border-slate-300 rounded-md px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="transferee">👨‍💼 인수자 (후임: {meta.transfereeName})</option>
              <option value="transferor">👩‍💼 인계자 (전임: {meta.transferorName})</option>
              <option value="supervisor">👔 입회자 (팀장: {meta.supervisorName})</option>
              <option value="director">🏛️ 승인자 (면장: {meta.directorName})</option>
            </select>
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            id="btn-add-item"
            onClick={onOpenAddItemModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            항목 추가
          </button>

          {/* Official Document Generator Button */}
          <button
            type="button"
            id="btn-open-official-doc"
            onClick={onOpenDocModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            사무인계인수서 출력
          </button>

          {/* Approval Action Button */}
          <button
            type="button"
            id="btn-approval-process"
            onClick={onOpenApprovalModal}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors ${
              approvalStage === 'director_approved'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {approvalStage === 'director_approved' ? '최종결재 완료됨' : '결재·전자서명'}
          </button>
        </div>
      </div>
    </header>
  );
};
