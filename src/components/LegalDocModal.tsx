import React from 'react';
import { BookOpen, ExternalLink, FileText, Scale, X } from 'lucide-react';

interface Props {
  title: string;
  statutoryBasis: string;
  guideline: string;
  onnaraDocNumber: string;
  onClose: () => void;
}

export const LegalDocModal: React.FC<Props> = ({
  title,
  statutoryBasis,
  guideline,
  onnaraDocNumber,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold">근거 법령 및 공문서 상세 정보</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">
              대상 단위사무
            </span>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">
              {title}
            </h4>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                <Scale className="w-3.5 h-3.5 text-blue-600" />
                근거 법률 및 시행령·규칙
              </span>
              <p className="text-slate-700 bg-white p-2 rounded border border-slate-200/80 leading-relaxed font-mono">
                {statutoryBasis}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                중앙부처 업무지침 및 자치법규(조례)
              </span>
              <p className="text-slate-700 bg-white p-2 rounded border border-slate-200/80 leading-relaxed font-mono">
                {guideline}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                온나라 행정문서 번호
              </span>
              <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200/80 font-mono text-slate-900">
                <span>{onnaraDocNumber}</span>
                <span className="text-[10px] text-indigo-600 font-sans font-bold bg-indigo-50 px-2 py-0.5 rounded">
                  행정망 검색 가능
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/70 text-blue-900 text-[11px] leading-relaxed">
            💡 <strong>실무 도움말:</strong> 행정업무 수행 중 민원인 법적 질의 또는 시의회 질의 시 위 근거 법령 및 지침서 조항을 우선적으로 명시하여 답변서를 작성하십시오.
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
