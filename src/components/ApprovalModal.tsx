import React, { useRef, useState, useEffect } from 'react';
import { ApprovalStage, HandoverMeta, SignatureRecord, UserRole } from '../types';
import {
  CheckCircle2,
  FileCheck,
  RotateCcw,
  ShieldCheck,
  X,
  PenTool,
  AlertCircle,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  meta: HandoverMeta;
  approvalStage: ApprovalStage;
  currentRole: UserRole;
  signatures: Record<string, SignatureRecord>;
  onSaveSignature: (role: string, signatureDataUrl: string, comment: string) => void;
  onAdvanceStage: (nextStage: ApprovalStage) => void;
  onRejectStage: (targetStage: ApprovalStage, reason: string) => void;
  onClose: () => void;
}

export const ApprovalModal: React.FC<Props> = ({
  meta,
  approvalStage,
  currentRole,
  signatures,
  onSaveSignature,
  onAdvanceStage,
  onRejectStage,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Initialize canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#1e3a8a'; // deep navy ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSignAndAdvance = () => {
    const canvas = canvasRef.current;
    let dataUrl = '';
    if (canvas && hasDrawn) {
      dataUrl = canvas.toDataURL('image/png');
    }

    // Save signature
    onSaveSignature(currentRole, dataUrl, commentInput);

    // Determine next stage
    if (approvalStage === 'draft') {
      onAdvanceStage('receiver_review');
    } else if (approvalStage === 'receiver_review') {
      onAdvanceStage('supervisor_review');
    } else if (approvalStage === 'supervisor_review') {
      onAdvanceStage('director_approved');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    if (approvalStage === 'supervisor_review') {
      onRejectStage('receiver_review', rejectReason);
    } else if (approvalStage === 'director_approved') {
      onRejectStage('supervisor_review', rejectReason);
    }
  };

  const stageList = [
    { key: 'draft', title: '1. 인계서 작성 완료', who: `${meta.transferorName} (전임)` },
    { key: 'receiver_review', title: '2. 인수자 확인 및 서명', who: `${meta.transfereeName} (후임)` },
    { key: 'supervisor_review', title: '3. 팀장 검토 및 입회', who: `${meta.supervisorName} (팀장)` },
    { key: 'director_approved', title: '4. 면장 최종 승인', who: `${meta.directorName} (면장)` },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">
                공무원 사무인계인수 결재 및 전자서명
              </h3>
              <p className="text-xs text-slate-400">
                GPKI 행정전자서명 연동 전자결재 승인 프로세스
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Workflow Stepper Visual */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              결재 진행 단계
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {stageList.map((stg, idx) => {
                const isCurrent = stg.key === approvalStage;
                const isPassed =
                  (approvalStage === 'receiver_review' && idx < 1) ||
                  (approvalStage === 'supervisor_review' && idx < 2) ||
                  (approvalStage === 'director_approved' && idx <= 3);

                return (
                  <div
                    key={stg.key}
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between mb-1">
                      <span>{stg.title.split(' ')[0]}</span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-[11px] truncate font-medium">
                      {stg.title.slice(3)}
                    </div>
                    <div className={`text-[10px] mt-1 ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                      {stg.who}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Status Banner */}
          {approvalStage === 'director_approved' ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <Award className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">
                  면장 최종 승인이 완료되었습니다!
                </h4>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  인계인수서 작성이 종결되었으며, 표준 서식에 모든 관계자의 전자서명이 수록되었습니다. 상단의 [사무인계인수서 출력] 버튼을 통해 공문서로 보관하거나 PDF로 내려받을 수 있습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
              <div>
                <strong>현재 대기 단계: </strong>
                <span>
                  {approvalStage === 'draft' && '전임자 인계서 초안 완료 ➔ 인수자 확인 대기'}
                  {approvalStage === 'receiver_review' && '인수자(후임자) 숙지 확인 및 서명 대기'}
                  {approvalStage === 'supervisor_review' && '입회자(담당팀장) 입회 확인 및 검토 대기'}
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-200/70 text-blue-900 font-bold">
                진행 대기
              </span>
            </div>
          )}

          {/* Signature History Cards */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2.5">
              기록된 서명 및 의견 내역
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {(Object.values(signatures) as SignatureRecord[]).map((sig) => (
                <div
                  key={sig.role}
                  className={`p-3 rounded-xl border ${
                    sig.signed
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white border-dashed border-slate-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{sig.roleLabel}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        sig.signed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {sig.signed ? '서명완료' : '미서명'}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] mb-2">
                    {sig.name} ({sig.rank})
                    {sig.signedAt && ` · ${sig.signedAt}`}
                  </div>

                  {sig.signatureImage ? (
                    <div className="h-10 bg-white border border-slate-200 rounded flex items-center justify-center p-1 mb-2">
                      <img src={sig.signatureImage} alt="서명" className="h-full object-contain" />
                    </div>
                  ) : sig.signed ? (
                    <div className="text-[11px] text-blue-600 font-mono mb-2">
                      [GPKI 전자서명 검증 완료]
                    </div>
                  ) : null}

                  {sig.comment && (
                    <p className="text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-100">
                      "{sig.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Electronic Signature Canvas & Comment Form (if not yet approved) */}
          {approvalStage !== 'director_approved' && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-blue-600" />
                  현재 로그인 계정({currentRole === 'transferee' ? `${meta.transfereeName} 인수자` : currentRole === 'transferor' ? `${meta.transferorName} 인계자` : currentRole === 'supervisor' ? `${meta.supervisorName} 팀장` : `${meta.directorName} 면장`}) 전자서명 입력
                </span>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  서명 지우기
                </button>
              </div>

              {/* Canvas Pad */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white flex flex-col items-center justify-center relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={120}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="cursor-crosshair touch-none w-full max-w-full"
                />
                {!hasDrawn && (
                  <span className="absolute pointer-events-none text-xs text-slate-400 select-none">
                    이곳에 마우스나 터치로 서명을 남겨주세요
                  </span>
                )}
              </div>

              {/* Comment Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  결재 및 인수인계 검토 의견 (선택 사항)
                </label>
                <input
                  type="text"
                  placeholder="예: 주요 법정사무 및 악성민원 대응수칙 철저히 확인하였습니다."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                {approvalStage !== 'draft' && (
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(!showRejectForm)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                  >
                    보완 요구 (반려)
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    닫기
                  </button>
                  <button
                    type="button"
                    onClick={handleSignAndAdvance}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    서명 저장 및 다음 결재 단계 승인
                  </button>
                </div>
              </div>

              {/* Reject Form Dropdown */}
              {showRejectForm && (
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs space-y-2">
                  <span className="font-bold text-rose-900 block">
                    보완 요구 사유 작성
                  </span>
                  <input
                    type="text"
                    placeholder="보완 또는 추가 설명이 필요한 사항을 적어주세요..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-rose-300 bg-white"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      className="px-2.5 py-1 text-slate-600"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="px-3 py-1 bg-rose-600 text-white rounded font-bold"
                    >
                      이전 단계로 반려
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
