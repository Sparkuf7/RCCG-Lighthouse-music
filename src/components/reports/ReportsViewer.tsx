import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  Target,
  Users,
  CheckCircle2,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { LighthouseLogo } from '../brand/LighthouseLogo';

export const ReportsViewer: React.FC = () => {
  const {
    members,
    events,
    attendanceRecords,
    prospects,
    developmentGoals,
    settings,
  } = useMinistry();

  const [reportType, setReportType] = useState<'executive' | 'attendance' | 'recruitment' | 'development'>('executive');

  const activeMembers = members.filter((m) => m.status === 'ACTIVE_MEMBER');
  const developingMembers = members.filter((m) => m.status === 'DEVELOPING');
  const targetCount = settings.target_active_members || 30;

  const totalAttended = attendanceRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
  const overallAttendanceRate =
    attendanceRecords.length > 0
      ? Math.round((totalAttended / attendanceRecords.length) * 100)
      : 94;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Full Name,Section,Role,Status,Vocal/Instrument,Attendance %']
        .concat(
          members.map(
            (m) =>
              `"${m.full_name}","${m.section}","${m.leadership_role}","${m.status}","${
                m.vocal_part !== 'Not Applicable' ? m.vocal_part : m.instrument
              }","${m.attendance_stats.percentage}%"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RCCG_Lighthouse_Music_Ministry_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#173B2D]/40 border border-white/5 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-[#F3D21A]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Governance & Oversight
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Ministry Reports & Analytics</h2>
          <p className="text-xs text-[#AAB8B2] mt-0.5">
            Executive summaries for Pastor, Director, and church council.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#24513B] hover:bg-[#173B2D] border border-white/10 text-white rounded-xl text-xs font-bold transition shadow"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] rounded-xl text-xs font-extrabold transition shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex items-center gap-2 bg-[#0B1F1C] p-1.5 rounded-2xl border border-white/5 overflow-x-auto">
        {[
          { key: 'executive', label: 'Pastoral Executive Summary' },
          { key: 'attendance', label: 'Attendance Health Analysis' },
          { key: 'recruitment', label: 'Recruitment & 30-Target Pipeline' },
          { key: 'development', label: 'Individual & Ensemble Development' },
        ].map((rep) => (
          <button
            key={rep.key}
            onClick={() => setReportType(rep.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              reportType === rep.key
                ? 'bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/40 shadow'
                : 'text-[#AAB8B2] hover:text-white'
            }`}
          >
            {rep.label}
          </button>
        ))}
      </div>

      {/* PRINTABLE REPORT CARD CONTAINER */}
      <div className="bg-[#173B2D]/30 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <LighthouseLogo variant="full" />
          <div className="text-right text-xs text-[#AAB8B2]">
            <span className="font-bold text-white block">Official Ministry Document</span>
            <span>Date: {new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Report Content */}
        {reportType === 'executive' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-white">Executive Pastoral Health Report</h3>
              <p className="text-xs text-[#AAB8B2] mt-0.5">
                Overview prepared for Pastor Daniel Adeleke and Church Administration.
              </p>
            </div>

            {/* Key KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-[#0B1F1C]/70 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">Active Ensemble</span>
                <span className="text-2xl font-black text-white">{activeMembers.length} / {targetCount}</span>
              </div>
              <div className="bg-[#0B1F1C]/70 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-[#F3D21A] block">Developing Talent</span>
                <span className="text-2xl font-black text-[#F3D21A]">{developingMembers.length}</span>
              </div>
              <div className="bg-[#0B1F1C]/70 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Attendance Rate</span>
                <span className="text-2xl font-black text-emerald-400">{overallAttendanceRate}%</span>
              </div>
              <div className="bg-[#0B1F1C]/70 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-blue-400 block">Recruitment Pipeline</span>
                <span className="text-2xl font-black text-blue-400">{prospects.length}</span>
              </div>
            </div>

            {/* Narrative Sections */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#0B1F1C]/50 border border-white/5 space-y-1.5">
                <h4 className="font-bold text-[#D4AF37] text-sm">1. Progress on 30-Member Target</h4>
                <p className="text-[#AAB8B2] leading-relaxed">
                  The music ministry currently stands at {activeMembers.length} active committed members and {developingMembers.length} in the development pipeline. The goal of 30 grounded worshippers is approached with an emphasis on spiritual stamina, musical training, and team unity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B1F1C]/50 border border-white/5 space-y-1.5">
                <h4 className="font-bold text-[#D4AF37] text-sm">2. Ensemble Quality & Repertoire</h4>
                <p className="text-[#AAB8B2] leading-relaxed">
                  Active focus areas of Blend, Harmony, and Listening have led to audible improvements in sectional intonation. The choir is presently preparing classical gospel anthems and African high praise medleys for Communion and Thanksgiving services.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B1F1C]/50 border border-white/5 space-y-1.5">
                <h4 className="font-bold text-[#D4AF37] text-sm">3. Pastoral Care & Engagement</h4>
                <p className="text-[#AAB8B2] leading-relaxed">
                  Attendance is tracked without punitive language. Members needing follow-up receive direct pastoral visits and sectional leader check-ins to offer spiritual and practical support.
                </p>
              </div>
            </div>
          </div>
        )}

        {reportType === 'attendance' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white">Attendance Audit & Section Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1F1C] text-[#AAB8B2] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Member</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Present</th>
                    <th className="p-3">Late</th>
                    <th className="p-3">Excused</th>
                    <th className="p-3">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-white/5">
                      <td className="p-3 font-semibold text-white">{m.full_name}</td>
                      <td className="p-3 text-[#AAB8B2]">{m.section}</td>
                      <td className="p-3 text-emerald-400 font-bold">{m.attendance_stats.present}</td>
                      <td className="p-3 text-amber-400 font-bold">{m.attendance_stats.late}</td>
                      <td className="p-3 text-blue-400 font-bold">{m.attendance_stats.excused}</td>
                      <td className="p-3 text-white font-extrabold">{m.attendance_stats.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'recruitment' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white">Recruitment & Church Connection Report</h3>
            <p className="text-xs text-[#AAB8B2]">
              Detailed breakdown of candidates moving from discovery to full active membership.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prospects.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#0B1F1C]/60 border border-white/5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="px-2 py-0.5 rounded bg-[#24513B] text-[#F3D21A] text-[10px] font-bold">
                      {p.current_stage}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#AAB8B2] mt-1">{p.interested_role} • {p.church_connection}</p>
                  <p className="text-[10px] text-[#D4AF37] mt-2">Assigned Leader: {p.assigned_leader_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportType === 'development' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white">Talent Development & Training Report</h3>
            <div className="space-y-2.5">
              {developmentGoals.map((g) => (
                <div key={g.id} className="p-3.5 rounded-2xl bg-[#0B1F1C]/60 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{g.member_name}</span>
                    <span className="text-[11px] text-[#AAB8B2] block">{g.goal_title} ({g.category})</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#24513B] text-[#F3D21A]">
                    {g.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
