import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, User, Settings, Bell, Search, Plus, Filter, Calendar, 
  BarChart3, Users, FolderOpen, MessageSquare, CheckCircle2, 
  Clock, AlertCircle, Star, ChevronDown, ChevronRight, Menu,
  Sun, Moon, Upload, Download, Edit2, Trash2, Eye, Play,
  Pause, Square, MoreHorizontal, Tag, Heart, Share2, X,
  ArrowUp, ArrowDown, ArrowRight, CheckSquare, Circle
} from 'lucide-react';

// Mock Data
const mockUser = {
  id: 1,
  name: 'Sarah Johnson',
  email: 'sarah@company.com',
  role: 'Marketing Lead',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
};

const mockCampaigns = [
  {
    id: 1,
    name: 'Q4 Product Launch',
    status: 'Active',
    progress: 75,
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    team: ['Sarah J.', 'Mike R.', 'Anna K.'],
    tasks: 12,
    completedTasks: 9,
    channels: ['Email', 'Social Media', 'SEO'],
    tags: ['Product Launch', 'High Priority']
  },
  {
    id: 2,
    name: 'Holiday Email Campaign',
    status: 'Draft',
    progress: 30,
    startDate: '2024-11-15',
    endDate: '2024-12-25',
    team: ['Anna K.', 'Tom L.'],
    tasks: 8,
    completedTasks: 2,
    channels: ['Email'],
    tags: ['Seasonal', 'Email Marketing']
  },
  {
    id: 3,
    name: 'Brand Awareness Initiative',
    status: 'Completed',
    progress: 100,
    startDate: '2024-08-01',
    endDate: '2024-10-15',
    team: ['Sarah J.', 'Mike R.', 'Lisa P.', 'Anna K.'],
    tasks: 15,
    completedTasks: 15,
    channels: ['Social Media', 'Content Marketing', 'PR'],
    tags: ['Brand Building', 'Content']
  }
];

const mockTasks = [
  {
    id: 1,
    title: 'Create product demo video',
    description: 'Record a 2-minute product demonstration video',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Mike R.',
    campaign: 'Q4 Product Launch',
    dueDate: '2024-11-15',
    tags: ['Video', 'Content Creation'],
    comments: 3
  },
  {
    id: 2,
    title: 'Design email templates',
    description: 'Create responsive email templates for holiday campaign',
    status: 'Todo',
    priority: 'Medium',
    assignee: 'Anna K.',
    campaign: 'Holiday Email Campaign',
    dueDate: '2024-11-20',
    tags: ['Design', 'Email'],
    comments: 1
  },
  {
    id: 3,
    title: 'Write blog post about new features',
    description: 'Comprehensive blog post covering all new product features',
    status: 'Review',
    priority: 'High',
    assignee: 'Sarah J.',
    campaign: 'Q4 Product Launch',
    dueDate: '2024-11-10',
    tags: ['Content', 'Blog'],
    comments: 5
  },
  {
    id: 4,
    title: 'Social media content calendar',
    description: 'Plan social media posts for December',
    status: 'Done',
    priority: 'Medium',
    assignee: 'Lisa P.',
    campaign: 'Holiday Email Campaign',
    dueDate: '2024-11-05',
    tags: ['Social Media', 'Planning'],
    comments: 2
  }
];

const mockNotifications = [
  { id: 1, message: 'New task assigned: Create product demo video', time: '5 minutes ago', read: false },
  { id: 2, message: 'Campaign "Q4 Product Launch" updated', time: '1 hour ago', read: false },
  { id: 3, message: 'Comment added to "Write blog post"', time: '2 hours ago', read: true },
  { id: 4, message: 'File uploaded to Brand Assets folder', time: '3 hours ago', read: true }
];

export default function MarketingTracker() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskView, setTaskView] = useState('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const commandPaletteRef = useRef(null);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setSelectedCampaign(null);
        setSelectedTask(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close command palette when clicking outside
  useEffect(() => {
    if (!showCommandPalette) return;

    const handleClickOutside = (event) => {
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(event.target)) {
        setShowCommandPalette(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCommandPalette]);

  const getUnreadNotifications = () => notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Draft': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'In Progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Todo': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Review': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Done': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors['Draft']}`}>
        {status}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const colors = {
      'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority] || colors['Medium']}`}>
        {priority}
      </span>
    );
  };

  const Sidebar = () => (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">Marketing Hub</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Internal Tracker</p>
            </div>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: 'dashboard', icon: Home, label: 'Dashboard' },
          { id: 'campaigns', icon: BarChart3, label: 'Campaigns' },
          { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
          { id: 'content', icon: FolderOpen, label: 'Content Hub' },
          { id: 'team', icon: Users, label: 'Team' },
          { id: 'analytics', icon: BarChart3, label: 'Analytics' },
          { id: 'feedback', icon: MessageSquare, label: 'Feedback' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              currentView === item.id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img
            src={mockUser.avatar}
            alt={mockUser.name}
            className="w-8 h-8 rounded-full ring-2 ring-blue-500"
          />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {mockUser.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {mockUser.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TopBar = () => (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns, tasks... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowCommandPalette(true)}
            className="pl-10 pr-4 py-2 w-80 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {getUnreadNotifications() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {getUnreadNotifications()}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {mockUser.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This month</option>
          </select>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Campaigns', value: '12', change: '+3', icon: BarChart3, color: 'blue' },
          { title: 'Tasks Completed', value: '89', change: '+12%', icon: CheckCircle2, color: 'green' },
          { title: 'Team Members', value: '24', change: '+2', icon: Users, color: 'purple' },
          { title: 'Assets Created', value: '156', change: '+8%', icon: FolderOpen, color: 'orange' }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Campaigns</h2>
          <div className="space-y-4">
            {mockCampaigns.slice(0, 3).map(campaign => (
              <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <StatusBadge status={campaign.status} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{campaign.tasks} tasks</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{campaign.team.length} members</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${campaign.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{campaign.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: Plus, label: 'Create Campaign', color: 'blue' },
              { icon: CheckSquare, label: 'Add Task', color: 'green' },
              { icon: Upload, label: 'Upload Asset', color: 'purple' },
              { icon: Users, label: 'Invite Team Member', color: 'orange' }
            ].map((action, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
              >
                <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20`}>
                  <action.icon className={`w-4 h-4 text-${action.color}-600 dark:text-${action.color}-400`} />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const CampaignsView = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your marketing campaigns</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCampaigns.map(campaign => (
          <div
            key={campaign.id}
            onClick={() => setSelectedCampaign(campaign)}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{campaign.name}</h3>
              <StatusBadge status={campaign.status} />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="text-gray-900 dark:text-white font-medium">{campaign.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tasks</span>
                <span className="text-gray-900 dark:text-white">{campaign.completedTasks}/{campaign.tasks}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Team</span>
                <div className="flex -space-x-2">
                  {campaign.team.slice(0, 3).map((member, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white font-medium"
                    >
                      {member.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                  {campaign.team.length > 3 && (
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-medium">
                      +{campaign.team.length - 3}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {campaign.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TasksView = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track task progress</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setTaskView('kanban')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                taskView === 'kanban'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setTaskView('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                taskView === 'list'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              List
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {taskView === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Todo', 'In Progress', 'Review', 'Done'].map(status => (
            <div key={status} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{status}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {mockTasks.filter(task => task.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {mockTasks.filter(task => task.status === status).map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</h4>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">{task.assignee}</span>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        <span>{task.comments}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <select className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                <option>All Campaigns</option>
                <option>Q4 Product Launch</option>
                <option>Holiday Email Campaign</option>
              </select>
              <select className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                <option>All Assignees</option>
                <option>Sarah J.</option>
                <option>Mike R.</option>
                <option>Anna K.</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Task</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Priority</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Assignee</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Due Date</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Campaign</th>
                  <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTasks.map(task => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <td className="p-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="p-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">{task.assignee}</td>
                    <td className="p-4 text-gray-900 dark:text-white">{task.dueDate}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{task.campaign}</td>
                    <td className="p-4">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const ContentHub = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage marketing assets and files</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            New Folder
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Folders</h3>
          <div className="space-y-2">
            {['Brand Assets', 'Campaign Materials', 'Templates', 'Videos', 'Images'].map((folder, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-900 dark:text-white">{folder}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Files</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'product-demo.mp4', type: 'video', size: '25.4 MB', modified: '2 hours ago' },
              { name: 'brand-guidelines.pdf', type: 'pdf', size: '2.1 MB', modified: '1 day ago' },
              { name: 'hero-banner.jpg', type: 'image', size: '1.8 MB', modified: '3 days ago' },
              { name: 'email-template.html', type: 'code', size: '45 KB', modified: '5 days ago' },
              { name: 'campaign-brief.docx', type: 'document', size: '892 KB', modified: '1 week ago' },
              { name: 'logo-variations.zip', type: 'archive', size: '15.3 MB', modified: '2 weeks ago' }
            ].map((file, index) => (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-3 mx-auto">
                  {file.type === 'video' && <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                  {file.type === 'pdf' && <FolderOpen className="w-6 h-6 text-red-600 dark:text-red-400" />}
                  {file.type === 'image' && <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />}
                  {file.type === 'code' && <Edit2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                  {file.type === 'document' && <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                  {file.type === 'archive' && <FolderOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm text-center mb-1 truncate">
                  {file.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">{file.size}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 text-center">{file.modified}</p>
                
                <div className="flex items-center justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded">
                    <Download className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded">
                    <Share2 className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded">
                    <MoreHorizontal className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TeamView = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage team members and roles</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[
          { name: 'Sarah Johnson', role: 'Marketing Lead', email: 'sarah@company.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face', status: 'online', tasks: 12 },
          { name: 'Mike Rodriguez', role: 'Content Creator', email: 'mike@company.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', status: 'online', tasks: 8 },
          { name: 'Anna Kim', role: 'Designer', email: 'anna@company.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', status: 'away', tasks: 15 },
          { name: 'Tom Liu', role: 'Social Media Manager', email: 'tom@company.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', status: 'offline', tasks: 6 },
          { name: 'Lisa Park', role: 'SEO Specialist', email: 'lisa@company.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face', status: 'online', tasks: 9 },
          { name: 'James Wilson', role: 'Marketing Intern', email: 'james@company.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', status: 'online', tasks: 4 }
        ].map((member, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-full mx-auto ring-4 ring-blue-500"
                />
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                  member.status === 'online' ? 'bg-green-500' :
                  member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{member.role}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">{member.email}</p>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-600 dark:text-gray-400">Active Tasks</span>
                <span className="font-medium text-gray-900 dark:text-white">{member.tasks}</span>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Message
                </button>
                <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This month</option>
            <option>This quarter</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Campaign ROI', value: '324%', change: '+12%', icon: BarChart3, color: 'green' },
          { title: 'Conversion Rate', value: '3.2%', change: '+0.8%', icon: ArrowUp, color: 'blue' },
          { title: 'Engagement Rate', value: '8.7%', change: '+2.1%', icon: Heart, color: 'red' },
          { title: 'Lead Quality Score', value: '87', change: '+5', icon: Star, color: 'yellow' }
        ].map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                <p className={`text-sm mt-1 ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} from last period
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Performance</h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization would go here</p>
              <p className="text-sm">(Integration with Recharts/Chart.js)</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Channel Performance</h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Pie chart visualization would go here</p>
              <p className="text-sm">(Integration with Recharts/Chart.js)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Campaign</th>
                <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Impressions</th>
                <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Clicks</th>
                <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Conversions</th>
                <th className="text-left p-4 font-medium text-gray-900 dark:text-white">ROI</th>
                <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Q4 Product Launch', impressions: '125K', clicks: '4.2K', conversions: '312', roi: '+245%', status: 'Active' },
                { name: 'Holiday Email Campaign', impressions: '89K', clicks: '2.8K', conversions: '189', roi: '+189%', status: 'Draft' },
                { name: 'Brand Awareness Initiative', impressions: '234K', clicks: '7.1K', conversions: '456', roi: '+324%', status: 'Completed' }
              ].map((campaign, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">{campaign.name}</td>
                  <td className="p-4 text-gray-900 dark:text-white">{campaign.impressions}</td>
                  <td className="p-4 text-gray-900 dark:text-white">{campaign.clicks}</td>
                  <td className="p-4 text-gray-900 dark:text-white">{campaign.conversions}</td>
                  <td className="p-4 text-green-600 font-medium">{campaign.roi}</td>
                  <td className="p-4">
                    <StatusBadge status={campaign.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const FeedbackView = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feedback & Approvals</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and manage feedback requests</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[
            {
              id: 1,
              title: 'Product Demo Video Review',
              campaign: 'Q4 Product Launch',
              status: 'Pending',
              requester: 'Mike R.',
              created: '2 hours ago',
              priority: 'High',
              comments: 3
            },
            {
              id: 2,
              title: 'Email Template Approval',
              campaign: 'Holiday Email Campaign',
              status: 'Approved',
              requester: 'Anna K.',
              created: '1 day ago',
              priority: 'Medium',
              comments: 5
            },
            {
              id: 3,
              title: 'Blog Post Content Review',
              campaign: 'Q4 Product Launch',
              status: 'Needs Changes',
              requester: 'Sarah J.',
              created: '2 days ago',
              priority: 'High',
              comments: 8
            }
          ].map(request => (
            <div key={request.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{request.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{request.campaign}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={request.priority} />
                  <StatusBadge status={request.status} />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>By {request.requester}</span>
                <span>{request.created}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{request.comments} comments</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {request.status === 'Pending' && (
                    <>
                      <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                        Reject
                      </button>
                    </>
                  )}
                  <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Approval Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Pending Review', count: 3, color: 'yellow' },
                { label: 'Approved', count: 12, color: 'green' },
                { label: 'Needs Changes', count: 2, color: 'red' },
                { label: 'In Progress', count: 5, color: 'blue' }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${stat.color}-500`}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'Video approved', user: 'CEO', time: '1h ago' },
                { action: 'Comment added', user: 'Sarah J.', time: '2h ago' },
                { action: 'Review requested', user: 'Mike R.', time: '3h ago' },
                { action: 'Changes requested', user: 'Marketing Lead', time: '5h ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Command Palette Modal - FIXED WITH CLOSE BUTTON AND OUTSIDE CLICK
  const CommandPalette = () => {
    if (!showCommandPalette) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
        <div
          ref={commandPaletteRef}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Search</h3>
              <button
                onClick={() => setShowCommandPalette(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns, tasks, team members..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            <div className="space-y-1">
              {[
                { type: 'Campaign', name: 'Q4 Product Launch', icon: BarChart3 },
                { type: 'Task', name: 'Create product demo video', icon: CheckSquare },
                { type: 'Team', name: 'Sarah Johnson', icon: User },
                { type: 'File', name: 'brand-guidelines.pdf', icon: FolderOpen }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setShowCommandPalette(false)}
                >
                  <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Campaign Detail Modal
  const CampaignModal = () => {
    if (!selectedCampaign) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCampaign.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <StatusBadge status={selectedCampaign.status} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCampaign.startDate} - {selectedCampaign.endDate}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCampaign(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Progress Overview</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedCampaign.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${selectedCampaign.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tasks</h3>
                  <div className="space-y-3">
                    {mockTasks.filter(task => task.campaign === selectedCampaign.name).map(task => (
                      <div key={task.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.assignee}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <PriorityBadge priority={task.priority} />
                            <StatusBadge status={task.status} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Team Members</h3>
                  <div className="space-y-3">
                    {selectedCampaign.team.map((member, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {member.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Channels</h3>
                  <div className="space-y-2">
                    {selectedCampaign.channels.map((channel, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-900 dark:text-white">{channel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Task Detail Modal
  const TaskModal = () => {
    if (!selectedTask) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTask.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedTask.campaign}</p>
            </div>
            <button
              onClick={() => setSelectedTask(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <StatusBadge status={selectedTask.status} />
                <PriorityBadge priority={selectedTask.priority} />
                <span className="text-sm text-gray-600 dark:text-gray-400">Due: {selectedTask.dueDate}</span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Assignee</h3>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {selectedTask.assignee.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-gray-900 dark:text-white">{selectedTask.assignee}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Comments ({selectedTask.comments})</h3>
                <div className="space-y-3">
                  {[
                    { user: 'Sarah J.', message: 'Great progress on this task! The video quality looks excellent.', time: '2 hours ago' },
                    { user: 'Mike R.', message: 'Thanks! I\'ll have the final version ready by tomorrow.', time: '1 hour ago' },
                    { user: 'CEO', message: 'Looking forward to seeing the completed video.', time: '30 minutes ago' }
                  ].map((comment, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{comment.user}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{comment.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{comment.message}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                    rows="3"
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'campaigns':
        return <CampaignsView />;
      case 'tasks':
        return <TasksView />;
      case 'content':
        return <ContentHub />;
      case 'team':
        return <TeamView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'feedback':
        return <FeedbackView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300`}>
      <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto">
            {renderCurrentView()}
          </main>
        </div>
      </div>
      
      <CommandPalette />
      <CampaignModal />
      <TaskModal />
    </div>
  );
}
