import React, { useState } from 'react';
import { KeyContact, UserRole } from '../types';
import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Phone,
  PhoneCall,
  Plus,
  Search,
  Send,
  Shield,
  Smartphone,
  User,
  Users,
} from 'lucide-react';

interface Props {
  contacts: KeyContact[];
  currentRole: UserRole;
  onAddNote: (contactId: string, author: string, content: string) => void;
}

export const KeyContactsSection: React.FC<Props> = ({
  contacts,
  currentRole,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'internal' | 'external'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [callModalContact, setCallModalContact] = useState<KeyContact | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const filteredContacts = contacts.filter((c) => {
    if (activeTab !== 'all' && c.category !== activeTab) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.organization.toLowerCase().includes(term) ||
      c.duties.toLowerCase().includes(term) ||
      c.rankTitle.toLowerCase().includes(term)
    );
  });

  const handleAddNoteSubmit = (contactId: string) => {
    const text = noteInputs[contactId]?.trim();
    if (!text) return;
    const authorName =
      currentRole === 'transferee'
        ? '박신임 주무관(후임)'
        : currentRole === 'transferor'
        ? '김이음 주무관(전임)'
        : currentRole === 'supervisor'
        ? '이복지 팀장'
        : '이두열 면장';
    onAddNote(contactId, authorName, text);
    setNoteInputs((prev) => ({ ...prev, [contactId]: '' }));
    setExpandedNotes((prev) => ({ ...prev, [contactId]: true }));
  };

  return (
    <section className="mb-10" id="section-key-contacts">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-emerald-600 rounded-sm inline-block"></span>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              4. 필요 업무 연락처 및 관내 기관 (비상연락망)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              총 {contacts.length}명 등재
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-4.5">
            아산시청 담당 과, 탕정파출소 핫라인, 탕정면 이장협의회, 복지관 등 실무 직통 연락처 및 인수인계 통화 메모입니다.
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="이름, 부서, 담당업무 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-60"
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              전체 ({contacts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('internal')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'internal'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              사내·시청 ({contacts.filter((c) => c.category === 'internal').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('external')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'external'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              사외·관내유관 ({contacts.filter((c) => c.category === 'external').length})
            </button>
          </div>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => {
          const isInternal = contact.category === 'internal';
          const isNotesExpanded = expandedNotes[contact.id] ?? true;

          return (
            <div
              key={contact.id}
              className="flex flex-col justify-between bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2 mb-2 pb-2.5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isInternal
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isInternal ? '사내 (시청/면)' : '사외 (관내/유관)'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {contact.organization}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {contact.name}
                    </h4>
                    <span className="text-xs text-slate-600 font-medium block">
                      {contact.rankTitle}
                    </span>
                  </div>

                  {/* One-Click Call Button */}
                  <button
                    type="button"
                    onClick={() => setCallModalContact(contact)}
                    title="원클릭 다이얼 연결"
                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </button>
                </div>

                {/* Duties */}
                <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                  <strong className="text-slate-800">업무: </strong>
                  {contact.duties}
                </p>

                {/* Phone & Mobile & Email */}
                <div className="space-y-1 text-xs text-slate-600 mb-3 font-mono">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 font-sans" />
                    <span>행정전화: <strong className="text-slate-800">{contact.phone}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0 font-sans" />
                    <span>휴대전화: {contact.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 font-sans" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                </div>

                {/* Notes History */}
                <div className="border-t border-slate-100 pt-2 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedNotes((prev) => ({
                          ...prev,
                          [contact.id]: !isNotesExpanded,
                        }))
                      }
                      className="text-slate-700 font-bold flex items-center gap-1 text-[11px] hover:text-blue-600"
                    >
                      <MessageSquare className="w-3 h-3 text-slate-500" />
                      업무 소통 메모 ({contact.notes.length}건)
                      {isNotesExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {isNotesExpanded && (
                    <div className="space-y-2 mb-2 max-h-32 overflow-y-auto pr-1">
                      {contact.notes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-amber-50/70 p-2 rounded border border-amber-200/70 text-[11px]"
                        >
                          <div className="flex justify-between text-[10px] text-amber-900/80 mb-0.5">
                            <span className="font-bold">{note.author}</span>
                            <span>{note.date}</span>
                          </div>
                          <p className="text-amber-950 leading-relaxed font-medium">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Note Input */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex gap-1.5">
                <input
                  type="text"
                  placeholder="대화 이력 또는 업무 팁 기록..."
                  value={noteInputs[contact.id] || ''}
                  onChange={(e) =>
                    setNoteInputs((prev) => ({
                      ...prev,
                      [contact.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddNoteSubmit(contact.id);
                  }}
                  className="flex-1 text-[11px] border border-slate-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddNoteSubmit(contact.id)}
                  className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-900"
                >
                  기록
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* One-Click Call Simulation Dialog Modal */}
      {callModalContact && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <PhoneCall className="w-7 h-7" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              원클릭 행정전화 연결
            </span>
            <h4 className="text-lg font-bold text-slate-900 mt-2">
              {callModalContact.name} ({callModalContact.rankTitle})
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">{callModalContact.organization}</p>

            <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-xl font-black text-slate-900 font-mono tracking-wider">
                {callModalContact.phone}
              </div>
              <p className="text-xs text-slate-500">
                휴대폰: {callModalContact.mobile}
              </p>
            </div>

            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              모바일 기기에서는 바로 통화창이 열리며, PC 행정망에서는 행정전화 단말기(VoIP)로 발신 요청됩니다.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCallModalContact(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                닫기
              </button>
              <a
                href={`tel:${callModalContact.phone}`}
                onClick={() => setCallModalContact(null)}
                className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                전화 연결
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
