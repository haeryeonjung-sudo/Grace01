import React, { useRef } from 'react';
import {
  HandoverMeta,
  StatutoryTask,
  MonthlyIssue,
  SpecialComplaint,
  KeyContact,
  SignatureRecord,
  ApprovalStage,
} from '../types';
import { Download, Printer, X, ShieldCheck, CheckCheck } from 'lucide-react';

interface Props {
  meta: HandoverMeta;
  tasks: StatutoryTask[];
  issues: MonthlyIssue[];
  complaints: SpecialComplaint[];
  contacts: KeyContact[];
  signatures: Record<string, SignatureRecord>;
  approvalStage: ApprovalStage;
  onClose: () => void;
}

export const HandoverDocumentModal: React.FC<Props> = ({
  meta,
  tasks,
  issues,
  complaints,
  contacts,
  signatures,
  approvalStage,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Header Bar - Hidden in print */}
        <div className="px-6 py-4 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">
                표준 사무인계인수서 (지방공무원 복무규정 제8조 표준서식)
              </h3>
              <p className="text-xs text-slate-300">
                전자 결재 및 전자서명 내역이 포함된 행정 표준 공문서 뷰어
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              인쇄 및 PDF 저장
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div
          ref={printRef}
          className="p-8 sm:p-12 overflow-y-auto flex-1 font-serif text-slate-900 leading-relaxed print:overflow-visible print:p-0"
        >
          {/* Official Document Top Frame */}
          <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
            <span className="text-xs tracking-widest text-slate-500 font-sans block mb-1">
              [별지 제1호 서식] 「지방공무원 복무규정」 제8조 관련
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-slate-900 my-2">
              사 무 인 계 인 수 서
            </h1>
            <p className="text-xs text-slate-600 font-sans">
              소속: {meta.orgName} {meta.departmentName} {meta.teamName} (직위: {meta.positionName})
            </p>
          </div>

          {/* 1. Summary of Persons */}
          <div className="mb-6">
            <h4 className="text-sm font-bold font-sans text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-900 inline-block"></span>
              1. 인계·인수자 및 입회자 인적사항
            </h4>
            <div className="border border-slate-900 text-xs font-sans">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-900">
                    <th className="py-2 px-3 border-r border-slate-900 w-1/4">구 분</th>
                    <th className="py-2 px-3 border-r border-slate-900 w-1/4">직 급</th>
                    <th className="py-2 px-3 border-r border-slate-900 w-1/4">성 명</th>
                    <th className="py-2 px-3 w-1/4">서명 또는 날인</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="py-2.5 px-3 border-r border-slate-900 font-bold bg-slate-50">
                      인계자 (전임자)
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-900">{meta.transferorRank}</td>
                    <td className="py-2.5 px-3 border-r border-slate-900 font-semibold">{meta.transferorName}</td>
                    <td className="py-2.5 px-3 font-semibold text-blue-700">
                      {signatures.transferor?.signed ? (
                        signatures.transferor.signatureImage ? (
                          <img
                            src={signatures.transferor.signatureImage}
                            alt="서명"
                            className="h-7 mx-auto inline-block"
                          />
                        ) : (
                          <span className="border border-blue-600 px-2 py-0.5 rounded text-[11px]">
                            [전자서명필]
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 font-normal">(미서명)</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="py-2.5 px-3 border-r border-slate-900 font-bold bg-slate-50">
                      인수자 (후임자)
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-900">{meta.transfereeRank}</td>
                    <td className="py-2.5 px-3 border-r border-slate-900 font-semibold">{meta.transfereeName}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-700">
                      {signatures.transferee?.signed ? (
                        signatures.transferee.signatureImage ? (
                          <img
                            src={signatures.transferee.signatureImage}
                            alt="서명"
                            className="h-7 mx-auto inline-block"
                          />
                        ) : (
                          <span className="border border-emerald-600 px-2 py-0.5 rounded text-[11px]">
                            [전자서명필]
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 font-normal">(확인 중)</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 border-r border-slate-900 font-bold bg-slate-50">
                      입회자 (담당팀장)
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-900">{meta.supervisorRank}</td>
                    <td className="py-2.5 px-3 border-r border-slate-900 font-semibold">{meta.supervisorName}</td>
                    <td className="py-2.5 px-3 font-semibold text-purple-700">
                      {signatures.supervisor?.signed ? (
                        signatures.supervisor.signatureImage ? (
                          <img
                            src={signatures.supervisor.signatureImage}
                            alt="서명"
                            className="h-7 mx-auto inline-block"
                          />
                        ) : (
                          <span className="border border-purple-600 px-2 py-0.5 rounded text-[11px]">
                            [입회확인필]
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 font-normal">(입회 대기)</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 font-sans mt-1.5">
              * 인계인수일자: {meta.deadlineDate} (인사발령일: {meta.appointmentDate})
            </p>
          </div>

          {/* 2. Statutory Tasks Summary */}
          <div className="mb-6">
            <h4 className="text-sm font-bold font-sans text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-900 inline-block"></span>
              2. 주요 담당 업무 및 법정 사무 목록 ({tasks.length}종)
            </h4>
            <div className="border border-slate-900 text-xs font-sans">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-900 text-center">
                    <th className="py-1.5 px-2 border-r border-slate-900 w-12">연번</th>
                    <th className="py-1.5 px-3 border-r border-slate-900 w-16">주기</th>
                    <th className="py-1.5 px-3 border-r border-slate-900">단위 사무명</th>
                    <th className="py-1.5 px-3 border-r border-slate-900">근거 법령 및 지침</th>
                    <th className="py-1.5 px-2 border-r border-slate-900 w-24">연계 시스템</th>
                    <th className="py-1.5 px-2 text-center w-20">숙지여부</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t, idx) => (
                    <tr key={t.id} className="border-b border-slate-300">
                      <td className="py-2 px-2 text-center border-r border-slate-900">{idx + 1}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-900 font-medium">{t.cycle}</td>
                      <td className="py-2 px-3 border-r border-slate-900 font-semibold">{t.title}</td>
                      <td className="py-2 px-3 border-r border-slate-900 text-[11px] text-slate-700">
                        {t.statutoryBasis}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-900 text-center text-[11px]">
                        {t.systems.map((s) => s.name).join(', ')}
                      </td>
                      <td className="py-2 px-2 text-center font-bold">
                        {t.isUnderstood ? (
                          <span className="text-emerald-700">완료</span>
                        ) : (
                          <span className="text-amber-700">진행중</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Monthly Issues & Budget */}
          <div className="mb-6">
            <h4 className="text-sm font-bold font-sans text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-900 inline-block"></span>
              3. 당면 미결 현안 및 예산 집행 관리 ({issues.length}건)
            </h4>
            <div className="border border-slate-900 text-xs font-sans">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-900 text-center">
                    <th className="py-1.5 px-2 border-r border-slate-900 w-12">연번</th>
                    <th className="py-1.5 px-3 border-r border-slate-900">현안 과제명</th>
                    <th className="py-1.5 px-3 border-r border-slate-900 w-24">처리 기한</th>
                    <th className="py-1.5 px-3 border-r border-slate-900">예산 및 계약 현황</th>
                    <th className="py-1.5 px-3 w-40">협조 및 인수 중점사항</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((i, idx) => (
                    <tr key={i.id} className="border-b border-slate-300">
                      <td className="py-2 px-2 text-center border-r border-slate-900">{idx + 1}</td>
                      <td className="py-2 px-3 border-r border-slate-900 font-semibold">
                        {i.title}
                        {i.carriedOver && (
                          <span className="ml-1 text-[10px] text-purple-700 border border-purple-300 px-1 rounded">
                            이월사업
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-900 text-center font-mono font-medium">
                        {i.deadline} (D-{i.dDay})
                      </td>
                      <td className="py-2 px-3 border-r border-slate-900 text-[11px]">
                        <div>{i.budgetAmount || '해당 없음'}</div>
                        <div className="text-slate-500 text-[10px]">{i.budgetItem}</div>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-700">
                        {i.assignedHelper}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Special Complaints & Litigation */}
          <div className="mb-6">
            <h4 className="text-sm font-bold font-sans text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-900 inline-block"></span>
              4. 특이민원 및 진행 중인 쟁송·행정심판 조치사항 ({complaints.length}건)
            </h4>
            <div className="border border-slate-900 text-xs font-sans">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-900 text-center">
                    <th className="py-1.5 px-2 border-r border-slate-900 w-12">연번</th>
                    <th className="py-1.5 px-3 border-r border-slate-900 w-28">민원인 및 유형</th>
                    <th className="py-1.5 px-3 border-r border-slate-900">과거 쟁점 및 성향</th>
                    <th className="py-1.5 px-3">완화 대응 매뉴얼 및 법적 조치</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, idx) => (
                    <tr key={c.id} className="border-b border-slate-300">
                      <td className="py-2 px-2 text-center border-r border-slate-900">{idx + 1}</td>
                      <td className="py-2 px-3 border-r border-slate-900">
                        <div className="font-bold">{c.complainerName}</div>
                        <div className="text-[10px] text-rose-700 font-semibold">[{c.complainerType}]</div>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-900 text-[11px] text-slate-700 leading-relaxed">
                        {c.pastIssues}
                      </td>
                      <td className="py-2 px-3 text-[11px] leading-relaxed">
                        <div className="font-medium text-slate-900 mb-1">{c.responseManual}</div>
                        <div className="text-[10px] text-indigo-700">법적상태: {c.legalActionStatus}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Concluding and Certification */}
          <div className="mt-10 pt-6 border-t border-slate-900 text-center font-sans">
            <p className="text-sm font-medium text-slate-800 mb-6">
              위와 같이 「지방공무원 복무규정」 제8조에 따라 담당 사무의 인계인수를 성실히 필하였음을 확인합니다.
            </p>

            <div className="text-base font-bold text-slate-900 mb-8 tracking-widest">
              {today}
            </div>

            {/* Signature Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-xs">
              <div className="p-3 border border-slate-400 rounded-lg bg-slate-50">
                <span className="text-[10px] text-slate-500 block">인계자 (전임)</span>
                <span className="font-bold text-slate-900 block my-1">{meta.transferorName}</span>
                <span className="text-[10px] text-blue-700 font-bold">
                  {signatures.transferor?.signed ? '(서명완료)' : '(미서명)'}
                </span>
              </div>

              <div className="p-3 border border-slate-400 rounded-lg bg-slate-50">
                <span className="text-[10px] text-slate-500 block">인수자 (후임)</span>
                <span className="font-bold text-slate-900 block my-1">{meta.transfereeName}</span>
                <span className="text-[10px] text-emerald-700 font-bold">
                  {signatures.transferee?.signed ? '(서명완료)' : '(확인대기)'}
                </span>
              </div>

              <div className="p-3 border border-slate-400 rounded-lg bg-slate-50">
                <span className="text-[10px] text-slate-500 block">입회자 (팀장)</span>
                <span className="font-bold text-slate-900 block my-1">{meta.supervisorName}</span>
                <span className="text-[10px] text-purple-700 font-bold">
                  {signatures.supervisor?.signed ? '(입회확인)' : '(대기)'}
                </span>
              </div>

              <div className="p-3 border border-slate-400 rounded-lg bg-slate-50">
                <span className="text-[10px] text-slate-500 block">최종승인 (면장)</span>
                <span className="font-bold text-slate-900 block my-1">{meta.directorName}</span>
                <span className="text-[10px] text-amber-700 font-bold">
                  {signatures.director?.signed ? '(승인완료)' : '(결재대기)'}
                </span>
              </div>
            </div>

            <div className="text-lg font-black text-slate-900 mt-8 tracking-widest">
              {meta.orgName} {meta.departmentName}장 귀하
            </div>
          </div>
        </div>

        {/* Footer actions - hidden in print */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 rounded-b-2xl flex items-center justify-between text-xs text-slate-600 print:hidden">
          <span>* 「행정 효율과 협업 촉진에 관한 규정」 표준 서식 준용</span>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            인쇄창 열기 (A4 규격)
          </button>
        </div>
      </div>
    </div>
  );
};
