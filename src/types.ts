export type UserRole = 'transferee' | 'transferor' | 'supervisor' | 'director';

export type ApprovalStage = 'draft' | 'receiver_review' | 'supervisor_review' | 'director_approved';

export type TaskCycle = '전체' | '일간' | '주간' | '월간' | '분기' | '연간' | '수시';

export type PriorityLevel = 'urgent' | 'warning' | 'normal';

export interface QAItem {
  id: string;
  author: string;
  role: string;
  question: string;
  createdAt: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
}

export interface StatutoryTask {
  id: string;
  title: string;
  category: string;
  cycle: Exclude<TaskCycle, '전체'>;
  periodDescription: string;
  statutoryBasis: string; // 근거 법령
  ordinanceOrGuideline: string; // 조례 및 업무지침
  onnaraDocNumber: string; // 온나라 공문서 번호
  systems: {
    name: string; // 새올, 온나라, e호조, 나이스, 행복e음 등
    badgeColor: string;
    purpose: string;
    permissionPath: string; // 권한 신청 경로
  }[];
  procedure: string[];
  keyNotes: string;
  isUnderstood: boolean;
  understoodAt?: string;
  qaThread: QAItem[];
  priority: PriorityLevel;
}

export interface MonthlyIssue {
  id: string;
  title: string;
  category: string;
  deadline: string; // e.g. "2026-10-12"
  dDay: number;
  description: string;
  urgentPoints: string[];
  budgetAmount?: string; // 예: "12,500,000원"
  budgetItem?: string; // 예: "사회보장적수혜금 (취약계층 난방연료비 지원)"
  contractDetails?: string; // 계약 건명
  carriedOver?: boolean; // 이월 사업 여부
  assignedHelper: string; // 협조 주무관/담당자
  isUnderstood: boolean;
  understoodAt?: string;
  warningLevel: 'urgent' | 'warning' | 'normal';
  qaThread: QAItem[];
}

export interface SpecialComplaint {
  id: string;
  title: string;
  complainerName: string;
  complainerType: '상습반복 악성' | '폭언·협박 위험' | '다수민원 청구' | '현장 위험주의';
  riskLevel: 'urgent' | 'warning';
  pastIssues: string; // 과거 주요 이슈
  responseManual: string; // 완화 및 대응 노하우
  legalActionStatus: string; // 법적 대응/고발 진행 여부
  ongoingLitigationOrAudit?: string; // 진행 중 소송/행정심판/감사 지적 사항
  locationName: string;
  latitude: number;
  longitude: number;
  address: string;
  isUnderstood: boolean;
  understoodAt?: string;
  qaThread: QAItem[];
}

export interface ContactNote {
  id: string;
  author: string;
  date: string;
  content: string;
}

export interface KeyContact {
  id: string;
  name: string;
  rankTitle: string; // 직위/직급 (예: 복지정책과 주무관, 회장 등)
  organization: string; // 소속 기관/부서
  category: 'internal' | 'external';
  phone: string;
  mobile: string;
  email: string;
  duties: string; // 주요 담당 업무
  notes: ContactNote[];
}

export interface SignatureRecord {
  role: 'transferor' | 'transferee' | 'supervisor' | 'director';
  roleLabel: string;
  name: string;
  rank: string;
  signed: boolean;
  signatureImage?: string; // data URL
  signedAt?: string;
  comment?: string;
}

export interface HandoverMeta {
  orgName: string; // "충청남도 아산시"
  departmentName: string; // "탕정면 행정복지센터"
  teamName: string; // "찾아가는 보건복지팀"
  positionName: string; // "찾아가는 보건복지 통합사례관리 및 방문보건·복지사각지대 발굴 총괄"
  transferorName: string; // 인수인계자 (전임)
  transferorRank: string; // 지방사회복지주무관 7급
  transfereeName: string; // 인수자 (후임)
  transfereeRank: string; // 지방사회복지주무관 8급
  supervisorName: string; // 입회자 (팀장)
  supervisorRank: string; // 지방행정주사 6급
  directorName: string; // 탕정면장/과장
  directorRank: string; // 행정사무관 5급
  appointmentDate: string; // 발령일 (2026-10-01)
  deadlineDate: string; // 인계 완료 마감일 (2026-09-30)
}
