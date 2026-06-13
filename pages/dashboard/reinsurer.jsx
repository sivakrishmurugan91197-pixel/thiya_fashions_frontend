import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Plus, Search, MoreVertical, Users, Calendar, Circle, CheckCircle, CheckCircle2, Clock, Target, TrendingUp, Edit, Edit2, Trash2, Eye } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AddProjectModal from '@/components/modals/AddProjectModal';
import ProjectDetailModal from '@/components/modals/ProjectDetailModal';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { useAppearance } from '@/contexts/AppearanceContext';
import useSessionStorage from "../../hooks/useSessionStorage";
import axiosClient from "@/utils/axios";

const taskData = [
  { id: 1, title: 'Design new landing page', project: 'Website Redesign', priority: 'High', status: '0', dueDate: '2024-11-30', assignee: 'Sarah Johnson' },
  { id: 2, title: 'Fix authentication bug', project: 'Backend API', priority: 'Critical', status: '0', dueDate: '2024-11-28', assignee: 'Mike Chen' },
  { id: 3, title: 'Update documentation', project: 'Documentation', priority: 'Low', status: '1', dueDate: '2024-12-05', assignee: 'Emma Wilson' },
  { id: 4, title: 'Implement payment gateway', project: 'E-commerce', priority: 'High', status: '0', dueDate: '2024-12-01', assignee: 'John Doe' },
  { id: 5, title: 'Code review for PR #234', project: 'Backend API', priority: 'Medium', status: '1', dueDate: '2024-11-29', assignee: 'Sarah Johnson' },
  { id: 6, title: 'Setup CI/CD pipeline', project: 'DevOps', priority: 'High', status: '1', dueDate: '2024-11-25', assignee: 'Mike Chen' },
  { id: 7, title: 'Mobile app testing', project: 'Mobile App', priority: 'Medium', status: '0', dueDate: '2024-12-03', assignee: 'Emma Wilson' },
  { id: 8, title: 'Database optimization', project: 'Backend API', priority: 'Medium', status: '1', dueDate: '2024-11-24', assignee: 'John Doe' },
];

const statusConfig = {
  '0': { label: 'Inactive', icon: Clock, color: 'text-red-500', bg: 'bg-red-100' },
  '1': { label: 'Active', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
};

const priorityConfig = {
  'Low': { color: 'text-gray-600', bg: 'bg-gray-100' },
  'Medium': { color: 'text-blue-600', bg: 'bg-blue-100' },
  'High': { color: 'text-orange-600', bg: 'bg-orange-100' },
  'Critical': { color: 'text-red-600', bg: 'bg-red-100' },
};

export default function Projects() {
  const router = useRouter();
  const { status: statusFilter } = router.query;
  const { accentColor } = useAppearance();

  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState(statusFilter || 'all');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuClosing, setMenuClosing] = useState(false);
  const menuRefs = useRef({});
  const menuRef = useRef(null);
  const formPageRef = useRef(false);
  const [redirectLoading, setRedirectLoading] = useState(false);
  const [quotations, setQuotations] = useState([]);
  // const [countryID] = useSessionStorage('country_id', '2');
  const countryID = 2;
  const [countryCode, setCountryCode] = useState('');
  const [reinsurerTotal, setReinsurerTotal] = useState('0');
  const [reinsurerActive, setReinsurerActive] = useState('0');
  const [reinsurerInactive, setReinsurerInactive] = useState('0');
  const [selectedLogo, setSelectedLogo] = useState('');
  const [isOpenLogoUrl, setIsOpenLogoUrl] = useState(false);
  const COUNTRY = [
    { id: '2', value: 'Malaysia', code: 'MY' },
    { id: '3', value: 'Singapore', code: 'SG' },
    { id: '4', value: 'Hongkong', code: 'HK' },
    { id: '5', value: 'Thailand', code: 'TH' },
    { id: '6', value: 'Philippines', code: 'PH' },
    { id: '7', value: 'Vietnam', code: 'VN' },
    { id: '8', value: 'Indonesia', code: 'ID' },
  ];

  useEffect(() => {
    console.log(countryID, "countryID");
    const CountryValue = COUNTRY.find(c => c.id === String(countryID));
    if (CountryValue) {
      setCountryCode(CountryValue.code);
    }
    if (!formPageRef.current) {
      formPageRef.current = true;
      getFetchData();
    }
  }, []);


  const handleCreateProject = (projectData) => {
    console.log('Creating project:', projectData);
    setShowAddProject(false);
  };

  const filteredReinsurer = quotations.filter(task => {
    const matchesFilter = filter === 'all' || task.status == filter;
    const matchesSearch = task.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });


  const stats = {
    total: taskData.length,
    todo: taskData.filter(t => t.status === 'todo').length,
    inProgress: taskData.filter(t => t.status === 'in-progress').length,
    completed: taskData.filter(t => t.status === 'completed').length,
  };

  const getFetchData = async () => {
    setRedirectLoading(true);
    try {
      const res = await axiosClient.post('/api/jade/getReinsurerDetails', {
        countryID: Number(countryID)
      }, {
        headers: {
          clientSecret: process.env.NEXT_PUBLIC_CLIENTSECRET,
          clientId: process.env.NEXT_PUBLIC_CLIENTID
        }
      })
      if (res.data && res.data.isSuccess == true) {
        setQuotations(res.data.data);
        console.log('response_quotations_reinsurer', res.data.data);
        setReinsurerTotal(res.data.data?.length);
        const counts = res.data.data?.reduce(
          (acc, item) => {
            if (item.status === 1) acc.active += 1;
            if (item.status === 0) acc.inactive += 1;
            acc.total += 1;
            return acc;
          },
          { active: 0, inactive: 0, total: 0 }
        );
        setReinsurerActive(counts?.active);
        setReinsurerInactive(counts?.inactive);
        setRedirectLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setRedirectLoading(false);
    }
  };

  const handleLogoView = async (logoUrl) => {
    setRedirectLoading(true);
    console.log(logoUrl, "quote_image");
    const selectedCountry = COUNTRY.find(c => c.id === String(countryID));
    setSelectedLogo('');
    if (logoUrl != '' && logoUrl != null) {
      try {
        const res = await axiosClient.post('/api/jade/getcompanyurl', {
          countryID: selectedCountry?.code || 'MY',
          company_url: logoUrl,
        }, {
          headers: {
            clientSecret: process.env.NEXT_PUBLIC_CLIENTSECRET,
            clientId: process.env.NEXT_PUBLIC_CLIENTID
          }
        })
        if (res.data && res.data.success == true) {
          setRedirectLoading(false);
          console.log(res.data.url, "URL Response");
          setSelectedLogo(res.data.url);
          setIsOpenLogoUrl(true);
        }
      } catch (error) {
        setRedirectLoading(false);
      }
    } else {
      setRedirectLoading(false);
    }
  };

  const onCloseLogoUrl = () => {
    setIsOpenLogoUrl(false);
  }
  
  return (
    <DashboardLayout
      title="Reinsurer - Project Management"
      description="Manage and track all your projects"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">ReInsurer</h1>
          <p className="text-gray-500 text-sm">Manage and track all your projects</p>
        </div>
        <button
          onClick={() => setShowAddProject(true)}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          <Plus size={16} /> Add ReInsurer
        </button>
      </div>

      {/* Stats Cards - Minimalist Design */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Total Reinsurer</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{reinsurerTotal}</p>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Users className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Active Reinsurer</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{reinsurerActive}</p>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Active Reinsurer</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{reinsurerInactive}</p>
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
              <Clock className="text-cyan-600 dark:text-cyan-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              style={filter === 'all' ? { backgroundColor: accentColor } : {}}
            >
              All
            </button>
            <button
              onClick={() => setFilter('1')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === '1' ? 'text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              style={filter === '1' ? { backgroundColor: accentColor } : {}}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('0')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === '0' ? 'text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              style={filter === '0' ? { backgroundColor: accentColor } : {}}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Company Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Registration No</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Phone No</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Company Logo</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Admin Profile Image</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            {/* <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredReinsurer.map((task) => {
                const StatusIcon = statusConfig[task.status].icon;
                return (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{task.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{task.company_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{task.registration_number}</td>
                    <td className="px-6 py-4">{task.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{task.phone_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <button onClick={() => handleLogoView(task.company_logo_path)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`} >View Logo</button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <button onClick={() => handleLogoView(task.profile_picture_path)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`} > View Image</button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[task.status].bg} ${statusConfig[task.status].color}`}>
                        <StatusIcon size={14} />
                        {statusConfig[task.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative" ref={openMenuId === task.id ? menuRef : null}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {openMenuId === task.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-menu-in">
                            <button
                              // onClick={() => handleMenuAction('view', task.id)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Eye size={16} className="text-gray-500 dark:text-gray-400" />
                              View Reinsurer
                            </button>
                            <button
                              // onClick={() => handleMenuAction('edit', task.id)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Edit2 size={16} className="text-gray-500 dark:text-gray-400" />
                              Edit Reinsurer
                            </button>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                            <button
                              // onClick={() => handleMenuAction('delete', task.id)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 size={16} />
                              Delete Reinsurer
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody> */}

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">

              {filteredReinsurer.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No record found
                  </td>
                </tr>
              ) : (
                filteredReinsurer.map((task) => {
                  const StatusIcon = statusConfig[task.status].icon;
                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                        {task.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {task.company_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {task.registration_number}
                      </td>
                      <td className="px-6 py-4">{task.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {task.phone_number}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleLogoView(task.company_logo_path)}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          View Logo
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleLogoView(task.profile_picture_path)}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          View Image
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[task.status].bg} ${statusConfig[task.status].color}`}
                        >
                          <StatusIcon size={14} />
                          {statusConfig[task.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative" ref={openMenuId === task.id ? menuRef : null}>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>
                          {openMenuId === task.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-menu-in">
                              <button
                                // onClick={() => handleMenuAction('view', task.id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <Eye size={16} className="text-gray-500 dark:text-gray-400" />
                                View Reinsurer
                              </button>
                              <button
                                // onClick={() => handleMenuAction('edit', task.id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <Edit2 size={16} className="text-gray-500 dark:text-gray-400" />
                                Edit Reinsurer
                              </button>
                              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                              <button
                                // onClick={() => handleMenuAction('delete', task.id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 size={16} />
                                Delete Reinsurer
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpenLogoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onCloseLogoUrl}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Close Button */}
            <button
              onClick={onCloseLogoUrl}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* Content */}
            <div className="p-6 flex items-center justify-center min-h-[200px]">
              {selectedLogo ? (
                <img
                  src={selectedLogo}
                  alt="Company Logo"
                  className="max-w-[200px] max-h-[150px] object-contain"
                />
              ) : (
                <p className="text-sm text-gray-500">
                  No logo available
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={showAddProject}
        onClose={() => setShowAddProject(false)}
        onSubmit={handleCreateProject}
      />

      {/* Edit Project Modal */}
      <AddProjectModal
        isOpen={showEditProject}
        onClose={() => setShowEditProject(false)}
        onSubmit={(data) => {
          console.log('Updating project:', data);
          setShowEditProject(false);
        }}
        initialData={selectedProject}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={showProjectDetail}
        onClose={() => setShowProjectDetail(false)}
        project={selectedProject}
      />
    </DashboardLayout>
  );
}
