import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../firebase/admin';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  HeartIcon, 
  ChatBubbleLeftEllipsisIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, colorClass, gradientClass }) => (
  <div className={`glass-card p-6 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden group`}>
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${gradientClass} transition-opacity group-hover:opacity-40`}></div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-smoke text-[10px] sm:text-xs font-bold uppercase tracking-widest">{title}</p>
        <p className="text-3xl sm:text-4xl font-black text-white mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-black/40 border border-white/5`}>
        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${colorClass}`} />
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/10 shadow-xl bg-obsidian-light/90">
        <p className="text-white font-bold text-sm mb-2 uppercase tracking-wide border-b border-white/10 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <p className="text-xs text-smoke font-medium">
              <span className="uppercase text-[9px] mr-1">{entry.name}:</span>
              <span className="text-white font-bold">{entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('area'); // 'area' or 'bar'

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      toast.error("Failed to load admin statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 glass-card border-white/10 animate-fade-in">
        <div className="w-12 h-12 border-4 border-dbd-red/20 rounded-full border-t-dbd-red animate-spin"></div>
        <p className="text-dbd-red font-black uppercase tracking-[0.2em] animate-pulse">Loading Matrix...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 glass-card">
        <p className="text-smoke italic">Could not reach the archives...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white drop-shadow-md">
            The Entity's Network
            <span className="text-dbd-red">.</span>
          </h2>
          <p className="text-xs text-smoke uppercase tracking-widest mt-1">Platform Statistics</p>
        </div>
        <button 
          onClick={fetchStats}
          className="p-2 border border-white/10 bg-black/40 hover:bg-white/5 rounded-xl transition-colors group tooltip-trigger"
        >
          <ArrowPathIcon className="w-5 h-5 text-smoke group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={UsersIcon} 
          colorClass="text-blue-400"
          gradientClass="bg-blue-600"
        />
        <StatCard 
          title="Total Posts" 
          value={stats.totalPosts} 
          icon={DocumentTextIcon} 
          colorClass="text-green-400"
          gradientClass="bg-green-600"
        />
        <StatCard 
          title="Total Likes" 
          value={stats.totalLikes} 
          icon={HeartIcon} 
          colorClass="text-dbd-red"
          gradientClass="bg-red-600"
        />
        <StatCard 
          title="Total Comments" 
          value={stats.totalComments} 
          icon={ChatBubbleLeftEllipsisIcon} 
          colorClass="text-purple-400"
          gradientClass="bg-purple-600"
        />
      </div>

      {/* Chart Section */}
      <div className="glass-card p-4 sm:p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-dbd-red rounded-full"></div>
            <h3 className="text-lg font-black uppercase tracking-wider text-white">Activity Timeline</h3>
          </div>
          
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            <button 
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${chartType === 'area' ? 'bg-white/10 text-white' : 'text-smoke hover:text-white'}`}
            >
              Area
            </button>
            <button 
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${chartType === 'bar' ? 'bg-white/10 text-white' : 'text-smoke hover:text-white'}`}
            >
              Bar
            </button>
          </div>
        </div>

        <div className="h-[300px] sm:h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#a1a1a1" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#a1a1a1" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="likes" name="Likes" stroke="#ef4444" fillOpacity={1} fill="url(#colorLikes)" strokeWidth={2} />
                <Area type="monotone" dataKey="comments" name="Comments" stroke="#a855f7" fillOpacity={1} fill="url(#colorComments)" strokeWidth={2} />
                <Area type="monotone" dataKey="posts" name="Posts" stroke="#4ade80" fillOpacity={1} fill="url(#colorPosts)" strokeWidth={2} />
              </AreaChart>
            ) : (
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#a1a1a1" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#a1a1a1" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                <Bar dataKey="posts" name="Posts" fill="#4ade80" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="comments" name="Comments" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="likes" name="Likes" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
