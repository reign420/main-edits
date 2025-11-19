import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';
import { LogOut, Search, Users, Briefcase, Download, Eye, Filter, Trash2 } from 'lucide-react';

type Client = Database['public']['Tables']['clients']['Row'];
type JobApplicant = Database['public']['Tables']['job_applicants']['Row'];

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'clients' | 'applicants'>('clients');
  const [clients, setClients] = useState<Client[]>([]);
  const [applicants, setApplicants] = useState<JobApplicant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplicant | null>(null);
  const [visitTotals, setVisitTotals] = useState<{ total: number; today: number }>({ total: 0, today: 0 });

  const getResumeUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(filePath, 60); // 60 seconds expiry
      
      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting resume URL:', error);
      return null;
    }
  };

  const handleViewResume = async (applicant: JobApplicant) => {
    if (!applicant.resume_file_path) return;
    
    // If it's already a full URL, use it directly
    if (/^https?:\/\//.test(applicant.resume_file_path)) {
      window.open(applicant.resume_file_path, '_blank');
      return;
    }
    
    // Otherwise, get signed URL from Supabase storage
    const url = await getResumeUrl(applicant.resume_file_path);
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Unable to load resume. Please try again.');
    }
  };

  const deleteClient = async (id: string) => {
    const confirmed = window.confirm('Delete this client lead? This cannot be undone.');
    if (!confirmed) return;
    try {
      console.log('Attempting to delete client with ID:', id);
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete error:', error);
        alert('Error deleting client: ' + error.message);
        return;
      }
      console.log('Client deleted successfully');
      setSelectedClient(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error deleting client: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const deleteApplicant = async (id: string) => {
    const confirmed = window.confirm('Delete this job applicant? This cannot be undone.');
    if (!confirmed) return;
    try {
      console.log('Attempting to delete applicant with ID:', id);
      const { error } = await supabase.from('job_applicants').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete error:', error);
        alert('Error deleting applicant: ' + error.message);
        return;
      }
      console.log('Applicant deleted successfully');
      setSelectedApplicant(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting applicant:', error);
      alert('Error deleting applicant: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const startOfTodayIso = new Date(new Date().setHours(0,0,0,0)).toISOString();
      const [clientsResult, applicantsResult, totalVisits, todayVisits] = await Promise.all([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('job_applicants').select('*').order('created_at', { ascending: false }),
        supabase.from('website_visits').select('id', { count: 'exact', head: true }),
        supabase.from('website_visits').select('id', { count: 'exact', head: true }).gte('visited_at', startOfTodayIso)
      ]);

      if (clientsResult.data) setClients(clientsResult.data);
      if (applicantsResult.data) setApplicants(applicantsResult.data);
      setVisitTotals({ total: totalVisits.count || 0, today: todayVisits.count || 0 });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClientStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating client status:', error);
    }
  };

  const updateApplicantStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_applicants')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating applicant status:', error);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-semibold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Job Applicants</p>
                <p className="text-2xl font-semibold text-gray-900">{applicants.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Visits (Today)</p>
                <p className="text-2xl font-semibold text-gray-900">{visitTotals.today}</p>
                <p className="text-xs text-gray-500 mt-1">Total: {visitTotals.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Leads</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {clients.filter(c => c.status === 'new').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Licensed Applicants</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applicants.filter(a => a.is_licensed).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('clients')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'clients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Life Insurance Leads ({filteredClients.length})
              </button>
              <button
                onClick={() => setActiveTab('applicants')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'applicants'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Job Applicants ({filteredApplicants.length})
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  {activeTab === 'clients' ? (
                    <>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="closed">Closed</option>
                      <option value="rejected">Rejected</option>
                    </>
                  ) : (
                    <>
                      <option value="new">New</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="interview">Interview</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </>
                  )}
                </select>
              </div>
              <button
                onClick={() => exportToCSV(
                  activeTab === 'clients' ? filteredClients : filteredApplicants,
                  `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`
                )}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {activeTab === 'clients' ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coverage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div>Age: {client.age}, {client.gender}</div>
                          <div>Marital: {client.marital_status}</div>
                          <div>Smoking: {client.smoking_status}</div>
                          <div>Occupation: {client.occupation}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${client.desired_coverage_amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={client.status}
                          onChange={(e) => updateClientStatus(client.id, e.target.value)}
                          className={`text-sm rounded-full px-2 py-1 font-medium ${
                            client.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                            client.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                            client.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                            client.status === 'closed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedClient(client)}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteClient(client.id)}
                            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                            title="Delete lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Licensed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{applicant.full_name}</div>
                          <div className="text-sm text-gray-500">{applicant.email}</div>
                          <div className="text-sm text-gray-500">{applicant.phone_number}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          applicant.is_licensed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {applicant.is_licensed ? 'Licensed' : 'Unlicensed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {applicant.resume_file_path ? (
                          <button 
                            onClick={() => handleViewResume(applicant)}
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        ) : (
                          <span className="text-gray-400">No resume</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={applicant.status}
                          onChange={(e) => updateApplicantStatus(applicant.id, e.target.value)}
                          className={`text-sm rounded-full px-2 py-1 font-medium ${
                            applicant.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                            applicant.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                            applicant.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                            applicant.status === 'hired' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="interview">Interview</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(applicant.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedApplicant(applicant)}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteApplicant(applicant.id)}
                            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                            title="Delete applicant"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {((activeTab === 'clients' && filteredClients.length === 0) || 
            (activeTab === 'applicants' && filteredApplicants.length === 0)) && (
            <div className="text-center py-12">
              <p className="text-gray-500">No {activeTab} found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setSelectedClient(null)}
          />
          <div className="relative bg-white w-full max-w-2xl mx-4 rounded-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Client Inquiry Details</h3>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-900">Primary</h4>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">{selectedClient.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{selectedClient.email}</p>
                </div>
                {(selectedClient.height || selectedClient.weight) && (
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase text-gray-500">Height / Weight</p>
                    <p className="text-sm text-gray-900">{[selectedClient.height, selectedClient.weight].filter(Boolean).join(' / ')}</p>
                  </div>
                )}
                {selectedClient.medical_issues && (
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase text-gray-500">Medical Issues</p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedClient.medical_issues}</p>
                  </div>
                )}
                {selectedClient.medications && (
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase text-gray-500">Medications</p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedClient.medications}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{selectedClient.phone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">{selectedClient.address}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">City</p>
                  <p className="text-sm text-gray-900">{selectedClient.city}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">State</p>
                  <p className="text-sm text-gray-900">{selectedClient.state}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">ZIP Code</p>
                  <p className="text-sm text-gray-900">{selectedClient.zip_code}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">{new Date(selectedClient.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Age</p>
                  <p className="text-sm text-gray-900">{selectedClient.age}</p>
                </div>
                {selectedClient.birthdate && (
                  <div>
                    <p className="text-xs uppercase text-gray-500">Birthdate</p>
                    <p className="text-sm text-gray-900">{new Date(selectedClient.birthdate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase text-gray-500">Gender</p>
                  <p className="text-sm text-gray-900">{selectedClient.gender}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Marital Status</p>
                  <p className="text-sm text-gray-900">{selectedClient.marital_status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Smoking Status</p>
                  <p className="text-sm text-gray-900">{selectedClient.smoking_status}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase text-gray-500">Occupation</p>
                  <p className="text-sm text-gray-900">{selectedClient.occupation}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Coverage Amount</p>
                  <p className="text-sm text-gray-900">${selectedClient.desired_coverage_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Status</p>
                  <p className="text-sm text-gray-900">{selectedClient.status}</p>
                </div>
                {selectedClient.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase text-gray-500">Notes</p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedClient.notes}</p>
                  </div>
                )}

                {(selectedClient.spouse_name || selectedClient.spouse_email || selectedClient.spouse_phone || selectedClient.spouse_age || selectedClient.spouse_birthdate || selectedClient.spouse_gender || selectedClient.spouse_occupation || selectedClient.spouse_smoking_status || selectedClient.spouse_medical_issues || selectedClient.spouse_medications || selectedClient.spouse_height || selectedClient.spouse_weight) && (
                  <>
                    <div className="sm:col-span-2 mt-2">
                      <h4 className="text-sm font-semibold text-gray-900">Spouse</h4>
                    </div>
                    {selectedClient.spouse_name && (
                      <div>
                        <p className="text-xs uppercase text-gray-500">Name</p>
                        <p className="text-sm text-gray-900">{selectedClient.spouse_name}</p>
                      </div>
                    )}
                    {selectedClient.spouse_email && (
                      <div>
                        <p className="text-xs uppercase text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{selectedClient.spouse_email}</p>
                      </div>
                    )}
                    {selectedClient.spouse_phone && (
                      <div>
                        <p className="text-xs uppercase text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{selectedClient.spouse_phone}</p>
                      </div>
                    )}
                    {selectedClient.spouse_age !== undefined && selectedClient.spouse_age !== null && (
                      <div>
                        <p className="text-xs uppercase text-gray-500">Age</p>
                        <p className="text-sm text-gray-900">{selectedClient.spouse_age}</p>
                      </div>
                    )}
                    {selectedClient.spouse_birthdate && (
                      <div>
                        <p className="text-xs uppercase text-gray-500">Birthdate</p>
                        <p className="text-sm text-gray-900">{new Date(selectedClient.spouse_birthdate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedClient.spouse_gender && (
                      <div>
                        <p className="text-xs uppercase text-gray-500">Gender</p>
                        <p className="text-sm text-gray-900">{selectedClient.spouse_gender}</p>
                      </div>
                    )}
                    {selectedClient.spouse_occupation && (
                      <div className="sm:col-span-2">
                        <p className="text-xs uppercase text-gray-500">Occupation</p>
                        <p className="text-sm text-gray-900">{selectedClient.spouse_occupation}</p>
                      </div>
                    )}
                    {selectedClient.spouse_smoking_status && (
                      <div>
                        <p className="text-xs uppercase text-gray-500">Smoking Status</p>
                        <p className="text-sm text-gray-900">{selectedClient.spouse_smoking_status}</p>
                      </div>
                    )}
                    {selectedClient.spouse_medical_issues && (
                      <div className="sm:col-span-2">
                        <p className="text-xs uppercase text-gray-500">Medical Issues</p>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedClient.spouse_medical_issues}</p>
                      </div>
                    )}
                    {selectedClient.spouse_medications && (
                      <div className="sm:col-span-2">
                        <p className="text-xs uppercase text-gray-500">Medications</p>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedClient.spouse_medications}</p>
                      </div>
                    )}
                    {(selectedClient.spouse_height || selectedClient.spouse_weight) && (
                      <div className="sm:col-span-2">
                        <p className="text-xs uppercase text-gray-500">Height / Weight</p>
                        <p className="text-sm text-gray-900">{[selectedClient.spouse_height, selectedClient.spouse_weight].filter(Boolean).join(' / ')}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => selectedClient && deleteClient(selectedClient.id)}
                className="px-4 py-2 rounded-md border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setSelectedApplicant(null)}
          />
          <div className="relative bg-white w-full max-w-2xl mx-4 rounded-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Applicant Details</h3>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-gray-500">Full Name</p>
                  <p className="text-sm text-gray-900">{selectedApplicant.full_name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{selectedApplicant.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{selectedApplicant.phone_number}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">{new Date(selectedApplicant.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Licensed</p>
                  <p className="text-sm text-gray-900">{selectedApplicant.is_licensed ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Status</p>
                  <p className="text-sm text-gray-900">{selectedApplicant.status}</p>
                </div>
                {selectedApplicant.resume_file_path && (
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase text-gray-500">Resume</p>
                    <button
                      onClick={() => handleViewResume(selectedApplicant)}
                      className="text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Resume</span>
                    </button>
                  </div>
                )}
                {selectedApplicant.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase text-gray-500">Notes</p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedApplicant.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => selectedApplicant && deleteApplicant(selectedApplicant.id)}
                className="px-4 py-2 rounded-md border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}