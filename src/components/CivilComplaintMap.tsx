import React, { useState } from 'react';
import { SpecialComplaint } from '../types';
import { AlertTriangle, MapPin, Building2, ShieldAlert, Compass, Eye, Train, Waves } from 'lucide-react';

interface Props {
  complaints: SpecialComplaint[];
  selectedId: string | null;
  onSelectComplaint: (id: string) => void;
}

export const CivilComplaintMap: React.FC<Props> = ({
  complaints,
  selectedId,
  onSelectComplaint,
}) => {
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  // Administrative map coordinates normalized to SVG viewBox 0 0 800 500
  // Tangjeong-myeon center ~ 36.8045, 127.0543
  const centerLat = 36.8045;
  const centerLng = 127.0543;
  const scale = 8500; // coordinate projection scale for Tangjeong area

  const getCoordinates = (lat: number, lng: number) => {
    const x = 400 + (lng - centerLng) * scale * 1.5;
    const y = 250 - (lat - centerLat) * (scale * 2.2);
    return { x: Math.max(70, Math.min(730, x)), y: Math.max(60, Math.min(440, y)) };
  };

  const centerOffice = {
    name: '탕정면 행정복지센터 & 보건지소',
    type: 'office',
    lat: 36.8045,
    lng: 127.0543,
    ...getCoordinates(36.8045, 127.0543),
  };

  const policeOffice = {
    name: '탕정파출소 (비상 핫라인)',
    type: 'police',
    lat: 36.8035,
    lng: 127.0515,
    ...getCoordinates(36.8035, 127.0515),
  };

  const fireStation = {
    name: '탕정119안전센터',
    type: 'fire',
    lat: 36.8095,
    lng: 127.0490,
    ...getCoordinates(36.8095, 127.0490),
  };

  const activeComplaint = complaints.find(
    (c) => c.id === (activeHoverId || selectedId)
  );

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-md">
      {/* Map Control Bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-rose-400" />
            관내 주요 민원 발생지 GIS 현장 지도 (충남 아산시 탕정면 관할)
          </h4>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            고위험 특이민원 ({complaints.filter(c => c.riskLevel === 'urgent').length}개소)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            주의 현장 ({complaints.filter(c => c.riskLevel === 'warning').length}개소)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block"></span>
            면사무소·파출소·119
          </span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[420px] bg-[#0c121e] overflow-hidden select-none">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2,2" />
            </pattern>
            {/* Radial Glow */}
            <radialGradient id="tangjeongCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="500" fill="url(#grid)" />

          {/* Tangjeong-myeon administrative boundary polygon */}
          <polygon
            points="100,70 340,40 680,60 760,240 710,430 330,460 120,410 70,220"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="6,4"
          />

          <circle cx="400" cy="250" r="280" fill="url(#tangjeongCenter)" />

          {/* Gokgyocheon Stream (Southern boundary) */}
          <path
            d="M 50,440 Q 250,420 450,450 T 780,430"
            fill="none"
            stroke="#0284c7"
            strokeWidth="14"
            strokeOpacity="0.3"
            strokeLinecap="round"
          />
          <text x="500" y="445" fill="#38bdf8" fontSize="10" fontWeight="bold">곡교천 (Gokgyo Stream) ~ 남측 관할경계</text>

          {/* Main Arterial Roads */}
          {/* Samsung-ro (North-South main spine: Display City) */}
          <path
            d="M 280,40 Q 310,220 330,440"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 280,40 Q 310,220 330,440"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="300" y="110" fill="#64748b" fontSize="10" transform="rotate(78, 300, 110)">삼성로 (Samsung-ro)</text>

          {/* Tangjeongmyeon-ro (West-East connecting to Dong office) */}
          <path
            d="M 80,260 Q 380,250 720,270"
            fill="none"
            stroke="#334155"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <text x="140" y="252" fill="#64748b" fontSize="9">탕정면로 ➔</text>

          {/* Handulmulbit-ro (East to Tangjeong Station & New Town) */}
          <path
            d="M 440,250 Q 560,320 740,360"
            fill="none"
            stroke="#334155"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <text x="560" y="325" fill="#64748b" fontSize="9" transform="rotate(22, 560, 325)">한들물빛로 (한들물빛도시)</text>

          {/* Samsung Display Asan Campus (Industrial Complex Area) */}
          <g transform="translate(190, 110)">
            <rect x="-70" y="-30" width="140" height="60" rx="8" fill="#1e3a8a" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="3,2" />
            <text x="0" y="-6" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">🏢 삼성디스플레이</text>
            <text x="0" y="12" fill="#60a5fa" fontSize="8" textAnchor="middle">아산 1·2캠퍼스</text>
          </g>

          {/* Tra-palace & Mediterranean Village (Myeongam-ri) */}
          <g transform="translate(480, 140)">
            <rect x="-60" y="-25" width="120" height="50" rx="8" fill="#0369a1" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
            <text x="0" y="-4" fill="#bae6fd" fontSize="9.5" textAnchor="middle" fontWeight="bold">🏘️ 트라팰리스 & 지중해마을</text>
            <text x="0" y="12" fill="#7dd3fc" fontSize="8" textAnchor="middle">(명암리 상가단지)</text>
          </g>

          {/* Handulmulbit New Town & Tangjeong Station (Maegok-ri) */}
          <g transform="translate(620, 340)">
            <rect x="-65" y="-28" width="130" height="56" rx="8" fill="#047857" fillOpacity="0.2" stroke="#34d399" strokeWidth="1" strokeDasharray="2,2" />
            <text x="0" y="-6" fill="#a7f3d0" fontSize="9.5" textAnchor="middle" fontWeight="bold">🏙️ 한들물빛도시</text>
            <text x="0" y="12" fill="#6ee7b7" fontSize="8.5" textAnchor="middle">🚆 1호선 탕정역</text>
          </g>

          {/* Natural Villages (Galsan-ri, Yongdu-ri, Dongsan-ri) */}
          <g transform="translate(150, 360)">
            <text x="0" y="0" fill="#64748b" fontSize="9.5" fontWeight="600">🌾 갈산리·용두리 (자연마을/농촌)</text>
          </g>

          {/* Public Offices */}
          {/* Tangjeong-myeon Center */}
          <g transform={`translate(${centerOffice.x}, ${centerOffice.y})`} className="cursor-pointer">
            <circle cx="0" cy="0" r="15" fill="#1d4ed8" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="6.5" fill="#60a5fa" />
            <rect x="-68" y="16" width="136" height="22" rx="5" fill="#0f172a" stroke="#1d4ed8" strokeWidth="1" />
            <text x="0" y="31" fill="#93c5fd" fontSize="9.5" textAnchor="middle" fontWeight="bold">🏛️ 탕정면 행정복지센터</text>
            <text x="0" y="47" fill="#60a5fa" fontSize="8.5" textAnchor="middle" fontWeight="600">(찾아가는 보건복지팀 & 탕정보건지소)</text>
          </g>

          {/* Police Station */}
          <g transform={`translate(${policeOffice.x}, ${policeOffice.y})`}>
            <circle cx="0" cy="0" r="10" fill="#0369a1" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4" fill="#38bdf8" />
            <text x="0" y="-14" fill="#7dd3fc" fontSize="9" textAnchor="middle" fontWeight="600">👮 탕정파출소 (비상벨)</text>
          </g>

          {/* Fire Station */}
          <g transform={`translate(${fireStation.x}, ${fireStation.y})`}>
            <circle cx="0" cy="0" r="9" fill="#b91c1c" fillOpacity="0.25" stroke="#f87171" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="3.5" fill="#f87171" />
            <text x="0" y="-12" fill="#fca5a5" fontSize="8.5" textAnchor="middle">🚒 탕정119안전센터</text>
          </g>

          {/* Complaint Hazard Locations */}
          {complaints.map((c) => {
            const coords = getCoordinates(c.latitude, c.longitude);
            const isSelected = c.id === selectedId;
            const isHovered = c.id === activeHoverId;
            const isUrgent = c.riskLevel === 'urgent';
            const color = isUrgent ? '#ef4444' : '#f59e0b';
            const rippleColor = isUrgent ? '#f87171' : '#fbbf24';

            return (
              <g
                key={c.id}
                id={`map-pin-${c.id}`}
                transform={`translate(${coords.x}, ${coords.y})`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectComplaint(c.id)}
                onMouseEnter={() => setActiveHoverId(c.id)}
                onMouseLeave={() => setActiveHoverId(null)}
              >
                {/* Pulse wave for urgent */}
                <circle cx="0" cy="0" r={isSelected || isHovered ? 24 : 16} fill={rippleColor} fillOpacity="0.2" className="animate-ping" />
                <circle cx="0" cy="0" r={isSelected || isHovered ? 18 : 13} fill="#0f172a" stroke={color} strokeWidth={isSelected ? 3 : 2} />

                {/* Inner Icon */}
                <circle cx="0" cy="0" r="5" fill={color} />

                {/* Label Box */}
                <g transform="translate(0, -26)">
                  <rect
                    x="-75"
                    y="-12"
                    width="150"
                    height="24"
                    rx="6"
                    fill={isSelected ? '#1e1b4b' : '#0f172a'}
                    stroke={color}
                    strokeWidth={isSelected ? 2 : 1}
                    className="filter drop-shadow-md"
                  />
                  <text
                    x="0"
                    y="3"
                    fill={isUrgent ? '#fca5a5' : '#fde68a'}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    ⚠️ {c.complainerName.split(' ')[0]} ({c.locationName.slice(0, 7)})
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Inspector HUD Card if Selected */}
        {activeComplaint && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-slate-950/95 border border-slate-700/80 rounded-xl p-3.5 shadow-xl backdrop-blur-md text-xs animate-fade-in z-20">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      activeComplaint.riskLevel === 'urgent'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {activeComplaint.complainerType}
                  </span>
                  <span className="font-bold text-slate-100">{activeComplaint.complainerName}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  {activeComplaint.address}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectComplaint(activeComplaint.id)}
                className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3 h-3" />
                대응매뉴얼
              </button>
            </div>

            <div className="mt-2 space-y-1 text-[11px]">
              <div className="text-slate-300 font-medium">
                <span className="text-rose-400 font-bold">주요 특이사항: </span>
                {activeComplaint.pastIssues}
              </div>
              <div className="text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="text-blue-400 font-semibold">비상 핫라인: </span>
                탕정파출소(041-542-0112) 및 행정복지센터 민원데스크 비상벨 연동
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>💡 <strong>현장 팁:</strong> 탕정면은 디스플레이 산단 신도시(한들물빛도시·트라팰리스)와 농촌 자연마을(갈산·용두·동산리)이 공존하므로 맞춤 출장 동선 수립 요망.</span>
        </div>
        <div className="text-slate-500">
          GIS 좌표계산: WGS84 ➔ SVG 투영
        </div>
      </div>
    </div>
  );
};
