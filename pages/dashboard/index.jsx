import { useState, useRef, useEffect } from 'react';
import { Plus, RefreshCcw, TrendingUp, TrendingDown, Users, CheckCircle, Clock, Target } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsSection from '@/components/sections/StatsSection';
import AnalyticsChart from '@/components/sections/AnalyticsChart';
import RemindersCard from '@/components/sections/RemindersCard';
import ProjectList from '@/components/sections/ProjectList';
import TeamCollaboration from '@/components/sections/TeamCollaboration';
import ProjectProgress from '@/components/sections/ProjectProgress';
import TimeTracker from '@/components/sections/TimeTracker';
import AddProjectModal from '@/components/modals/AddProjectModal';
import AddMemberModal from '@/components/modals/AddMemberModal';
import { useAppearance } from '@/contexts/AppearanceContext';
import axiosClient from "@/utils/axios";


export default function Dashboard() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const { accentColor } = useAppearance();
  const [time, setTime] = useState(null);
  const [country, setCountry] = useState("");
  const formPageRef = useRef(false);
  const [quotations, setQuotations] = useState([]);
  const [reinsurerBreakdown, setReinsurerBreakdown] = useState({});
  const [reinsurerList, setReinsurerList] = useState([]);
  const [insurerBreakdown, setInsurerBreakdown] = useState([]);
  const [selectedCountries, setselectedCountries] = useState(null);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [redirectLoading, setRedirectLoading] = useState(false);

  const COUNTRY = [
    { id: '2', value: 'Malaysia', code: 'MY' },
    { id: '3', value: 'Singapore', code: 'SG' },
    { id: '4', value: 'Hongkong', code: 'HK' },
    { id: '5', value: 'Thailand', code: 'TH' },
    { id: '6', value: 'Philippines', code: 'PH' },
    { id: '7', value: 'Vietnam', code: 'VN' },
    { id: '8', value: 'Indonesia', code: 'ID' },
  ];

  const performanceData = [
    { month: 'Jan', completed: 45, inProgress: 12, total: 57 },
    { month: 'Feb', completed: 52, inProgress: 15, total: 67 },
    { month: 'Mar', completed: 48, inProgress: 18, total: 66 },
    { month: 'Apr', completed: 61, inProgress: 14, total: 75 },
    { month: 'May', completed: 55, inProgress: 20, total: 75 },
    { month: 'Jun', completed: 67, inProgress: 16, total: 83 },
    { month: 'Jun', completed: 67, inProgress: 16, total: 83 },
  ];

  // const projectStatusData = [
  //   { name: 'Completed', value: 45, color: accentColor },
  //   { name: 'In Progress', value: 30, color: '#06b6d4' },
  //   { name: 'Pending', value: 15, color: '#f59e0b' },
  //   { name: 'On Hold', value: 10, color: '#ef4444' },
  // ];

  const teamProductivity = [
    { reinsurer_name: 'Sarah Johnson', countries: 'Malaysia, Singapore, Hongkong, Thailand', status: 0, insurers: 83, users: 83, quotes: 83 },
    { reinsurer_name: 'Mike Chen', countries: 'Singapore, Hongkong, Thailand', status: 1, insurers: 89, users: 83, quotes: 83 },
    { reinsurer_name: 'Emma Wilson', countries: 'Malaysia, Hongkong, Thailand', status: 0, insurers: 82, users: 83, quotes: 83 },
    { reinsurer_name: 'John Doe', countries: 'Malaysia, Singapore, Hongkong', status: 1, insurers: 85, users: 83, quotes: 83 },
    { reinsurer_name: 'Alex Brown', countries: 'Malaysia, Singapore, Thailand', status: 0, insurers: 80, users: 83, quotes: 83 },
  ];

  const InsurerList = [
    { reinsurer_name: 'Sarah Johnson', insurer_name: 'Johnson', countries: 'Malaysia, Singapore, Hongkong, Thailand', status: 0, users: 83, quotes: 83 },
    { reinsurer_name: 'Mike Chen', insurer_name: 'Chen', countries: 'Singapore, Hongkong, Thailand', status: 1, users: 83, quotes: 83 },
    { reinsurer_name: 'Emma Wilson', insurer_name: 'Wilson', countries: 'Malaysia, Hongkong, Thailand', status: 0, users: 83, quotes: 83 },
    { reinsurer_name: 'John Doe', insurer_name: 'Doe', countries: 'Malaysia, Singapore, Hongkong', status: 1, users: 83, quotes: 83 },
    { reinsurer_name: 'Alex Brown', insurer_name: 'Brown', countries: 'Malaysia, Singapore, Thailand', status: 0, users: 83, quotes: 83 },
  ];

  useEffect(() => {
    if (formPageRef.current) return;

    formPageRef.current = true;
    setTime(new Date());
    getFetchData();
  }, []);

  const handleRefresh = () => {
    setTime(new Date());
    getFetchData();
  };

  async function getFetchData() {
    setRedirectLoading(true);
    setQuotations([]);
    setProjectStatusData([]);
    try {
      const res = await axiosClient.post('/api/jade/getadmindasboarddetails', {}, {
        headers: {
          clientSecret: process.env.NEXT_PUBLIC_CLIENTSECRET,
          clientId: process.env.NEXT_PUBLIC_CLIENTID
        }
      })
      if (res.data && res.data.isSuccess == true) {
        setQuotations(res.data.data);
        setRedirectLoading(false);
        console.log('response_quotations', res.data.data);
        const reinsurerbreakdown = res?.data?.data?.reinsurer_breakdown || {};
        setReinsurerBreakdown(reinsurerbreakdown);
        const list = res?.data?.data?.reinsurer_breakdown?.reinsurer_wise_summary || [];
        setReinsurerList(list);
        const insurerbreakdown = res?.data?.data?.insurer_breakdown || [];
        setInsurerBreakdown(insurerbreakdown);
        const statusCount =
          res?.data?.data?.quotationsResults?.quotation_status_count || {};

        const StatusDataValue = [
          { name: 'In Progress', value: Number(statusCount.inprogress_count) || 0, color: '#f59e0b' },
          { name: 'Pending Approval', value: Number(statusCount.pending_approval_count) || 0, color: '#06b6d4' },
          { name: 'Quoted', value: Number(statusCount.quoted_count) || 0, color: accentColor },
          { name: 'Negative Declared', value: Number(statusCount.negative_declared_count) || 0, color: '#ef4444' },
          { name: 'Paid', value: Number(statusCount.paid_count) || 0, color: '#a2ef44' },
          { name: 'Insured', value: Number(statusCount.insured_count) || 0, color: '#8b44ef' },
          { name: 'Reject', value: Number(statusCount.reject_count) || 0, color: '#bcbcbc' },
        ];

        const total =
          Number(statusCount.overall_count) ||
          StatusDataValue.reduce((sum, item) => sum + item.value, 0);

        // const StatusData = StatusDataValue
        //   .filter(item => item.value > 0)
        //   .map(item => ({
        //     ...item,
        //     percentage: total ? Number(((item.value / total) * 100).toFixed(2)) : 0,
        //   }));

        const StatusData = StatusDataValue.map(item => ({
          ...item,
          percentage: total
            ? Number(((item.value / total) * 100).toFixed(2))
            : 0,
        }));

        setProjectStatusData(StatusData);
      }
    } catch (error) {
      console.log("error", error);
      setRedirectLoading(false);
    }
  };

  useEffect(() => {
    if (insurerBreakdown.length > 0 && !country) {
      setCountry(Object.keys(insurerBreakdown[0])[0]);
    }
  }, [insurerBreakdown]);

  useEffect(() => {
    const found = insurerBreakdown.find(item => item[country]);
    setselectedCountries(found ? found[country] : null);
  }, [country, insurerBreakdown]);

  const tableData = Array.isArray(selectedCountries?.details) ? selectedCountries.details : [];

  if (!time) return null;

  const formattedTime = time?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <DashboardLayout
      title="Dashboard - Project Management"
      description="Plan, prioritize, and accomplish your tasks with ease. Track your projects, team collaboration, and analytics in one place."
    >
      {/* Dashboard Title & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>
        <div className="flex gap-3">
          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }}></span>
            Last Updated: {formattedTime ?? "--:--:--"}
          </p>
          <button className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-lg"
            onClick={handleRefresh} style={{ backgroundColor: accentColor }}>
            <RefreshCcw size={16} />  Refresh
          </button>
        </div>
        {/* <div className="flex gap-3">
          <button 
            onClick={() => setShowAddProject(true)}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-lg"
            style={{ backgroundColor: accentColor }}
          >
            <Plus size={16} /> Add Project
          </button>
          <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors">
            Import Data
          </button>
        </div> */}

      </div>

      {/* Stats Grid */}
      <StatsSection {...quotations} />

      {/* Middle Section Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Leads Status Distribution</h3>

        <div className="flex flex-col lg:flex-row items-center gap-8">

          {/* CHART */}
          <div className="relative w-full lg:w-1/2 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} (${props.payload.percentage}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {/* {projectStatusData.reduce((s, i) => s + i.value, 0)} */}
                {quotations?.quotationsResults?.quotation_status_count?.overall_count ?? 0}
              </span>
            </div>
          </div>

          {/* LEGEND */}
          <div className="w-full lg:w-1/2 space-y-3">
            {projectStatusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.name}
                  </span>
                </div>

                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.value} <span className="text-gray-500">({item.percentage}%)</span>
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>


      {/* Middle Section Grid */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Project Quotation Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
              <XAxis dataKey="month" stroke="#9ca3af" className="dark:stroke-gray-500" />
              <YAxis stroke="#9ca3af" className="dark:stroke-gray-500" />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill={accentColor} name="Completed" radius={[8, 8, 0, 0]} />
              <Bar dataKey="inProgress" fill="#06b6d4" name="In Progress" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Average Completion</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">54.7</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">per month</p>
              </div>
              <div className="text-center border-x border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Success Rate</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">80.7%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">completion rate</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Best Month</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">June</p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">67 completed</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Quotation Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {projectStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800" >{item.value} {"(" + item.percentage + "%)"}</span>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Reinsurer Status Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Reinsurers</p>
                <p className="text-2xl font-bold text-black dark:text-white">{reinsurerBreakdown?.reinsurer_summary?.reinsurer_active ?? 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Inactive Reinsurers</p>
                <p className="text-2xl font-bold text-black dark:text-white">{reinsurerBreakdown?.reinsurer_summary?.reinsurer_inactive ?? 0}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                <Clock className="text-cyan-600 dark:text-cyan-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Insurers</p>
                <p className="text-2xl font-bold text-black dark:text-white">{reinsurerBreakdown?.totalinsurer?.insurer_total ?? 0}</p>
              </div>

              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Target className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Underwriters</p>
                <p className="text-2xl font-bold text-black dark:text-white">{reinsurerBreakdown?.totalunderwriter?.underwriter_total ?? 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Users className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Reinsurer Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Reinsurer ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Reinsurer Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Country</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Insurers / Brokers</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Underwriters</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Quotes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {reinsurerList?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No record found
                  </td>
                </tr>
              ) : (
                reinsurerList?.map((reinsurers) => (
                  <tr key={reinsurers.reinsurer_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-800 dark:text-white">{reinsurers.reinsurer_id}</td>
                    <td className="px-4 py-4 font-medium text-gray-800 dark:text-white">{reinsurers.reinsurer_name}</td>
                    {/* <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{reinsurers.countries}</td> */}
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                      <div className="flex flex-wrap gap-2">
                        {COUNTRY.filter(c => reinsurers.country_access?.[c.id] === "1")
                          .map((c, index, arr) => (
                            <span key={c.id} className="flex items-center">
                              <span className="px-0 py-1 text-sm text-gray-600 dark:text-gray-400 rounded-full">
                                {c.value}
                              </span>
                              {index < arr.length - 1 && (
                                <span className="mx-1 text-gray-500">,</span>
                              )}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${reinsurers.status == 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                        {reinsurers.status == 1 ? 'Active' : 'InActive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{reinsurers.superadmin_count}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{reinsurers.companyemployee_count}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{reinsurers.quotation_count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Insurer Status Distribution
          </h3>

          <select
            className="input-base text-sm w-full sm:w-48"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {COUNTRY.map((c) => (
              <option key={c.id} value={c.id}>
                {c.value}
              </option>
            ))}
          </select>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Insurers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCountries?.insurer_active_count ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>
          <div className="rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Inactive Insurers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCountries?.insurer_inactive_count ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                <Clock className="text-cyan-600 dark:text-cyan-400" size={24} />
              </div>
            </div>
          </div>
          <div className="rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Underwriters</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCountries?.total_underwriter_count ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Target className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200" style={{ width: '50%' }}>
            Insurer Status Distribution
          </h3>

          <select
            className="input-base text-sm"
            style={{ width: '20%' }}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="" disabled>
              Select Country
            </option>

            {COUNTRY.map((c) => (
              <option key={c.id} value={c.id}>
                {c.value}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Insurers</p>
                <p className="text-2xl font-bold text-black dark:text-white">83</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Inactive Insurers</p>
                <p className="text-2xl font-bold text-black dark:text-white">67</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                <Clock className="text-cyan-600 dark:text-cyan-400" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Underwriters</p>
                <p className="text-2xl font-bold text-black dark:text-white">16</p>
              </div>

              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Target className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Insurer Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Reinsurer ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Reinsurer Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Insurer ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Insurer Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Country</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Underwriters</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Quotes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {tableData?.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No record found
                  </td>
                </tr>
              ) : (
                tableData?.map((insurers) => (
                  <tr key={insurers.superadmin_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-800 dark:text-white">{insurers.reinsurer_id}</td>
                    <td className="px-4 py-4 font-medium text-gray-800 dark:text-white">{insurers.reinsurer_name}</td>
                    <td className="px-4 py-4 font-medium text-gray-800 dark:text-white">{insurers.superadmin_id}</td>
                    <td className="px-4 py-4 font-medium text-gray-800 dark:text-white">{insurers.superadmin_name}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{insurers.country}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${insurers.superadmin_status == 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                        {insurers.superadmin_status == 1 ? 'Active' : 'InActive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{insurers.company_employees_count}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{insurers.quotation_count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Team Members</p>
                <p className="text-2xl font-bold text-black dark:text-white">24</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Users className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div> */}


      {/* <AnalyticsChart />
        <RemindersCard />
        <ProjectList onNewProject={() => setShowAddProject(true)} /> */}

      {/* Bottom Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <TeamCollaboration onAddMember={() => setShowAddMember(true)} />
        <ProjectProgress />
        <TimeTracker />
      </div> */}

      {/* Add Project Modal */}
      {/* <AddProjectModal
        isOpen={showAddProject}
        onClose={() => setShowAddProject(false)}
        onSubmit={handleCreateProject}
      /> */}

      {/* Add Member Modal */}
      {/* <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        onSubmit={handleAddMember}
      /> */}
    </DashboardLayout>
  );
}
