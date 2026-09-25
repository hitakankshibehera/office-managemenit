import React from 'react';
import { Building2, Users, Briefcase, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DepartmentsView: React.FC = () => {
  const { departments, employees } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">Departments & Teams</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organizational hierarchy and departmental leadership structure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptEmps = employees.filter((e) => e.departmentId === dept.id);
          return (
            <div
              key={dept.id}
              className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#168BFF] flex items-center justify-center font-bold">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{dept.name}</h3>
                      <span className="text-xs text-slate-400">Wonder Light Adventure</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {dept.employeeCount ?? dept.totalEmployees} Members
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5 font-medium">Department Lead</span>
                    <span className="font-bold text-slate-800 text-sm">{dept.leadName ?? dept.headName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5 font-medium">Key Function</span>
                    <p className="text-slate-600 leading-relaxed">
                      {dept.name === 'Development'
                        ? 'Website architecture, booking engines, internal tools & mobile integrations.'
                        : dept.name === 'Marketing'
                        ? 'Adventure campaigns, social media storytelling, outreach & expeditions promotion.'
                        : dept.name === 'Sales'
                        ? 'Customer bookings, corporate trek packages, inquiry consultations.'
                        : 'People operations, compliance, talent acquisition & workplace culture.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Roster: {deptEmps.length} active in system</span>
                <span className="text-emerald-600 font-semibold">Active Unit</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
