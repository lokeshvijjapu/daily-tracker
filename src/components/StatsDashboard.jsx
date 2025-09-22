import React from 'react'
import { format, parseISO, isSameWeek, isSameMonth, startOfWeek, startOfMonth } from 'date-fns'
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import './StatsDashboard.css'

const StatsDashboard = ({ stats, routine }) => {
  // Calculate completion rates
  const calculateCompletionRate = (periodStats) => {
    if (periodStats.length === 0) return 0
    const totalTasks = periodStats.reduce((sum, stat) => sum + stat.total, 0)
    const completedTasks = periodStats.reduce((sum, stat) => sum + stat.completed, 0)
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  }

  // Get stats for this week
  const thisWeekStats = stats.filter(stat => 
    isSameWeek(parseISO(stat.date), new Date(), { weekStartsOn: 1 })
  )
  
  // Get stats for this month
  const thisMonthStats = stats.filter(stat => 
    isSameMonth(parseISO(stat.date), new Date())
  )
  
  // Weekly completion rate
  const weeklyRate = calculateCompletionRate(thisWeekStats)
  
  // Monthly completion rate
  const monthlyRate = calculateCompletionRate(thisMonthStats)
  
  // Format stats for charts
  const chartData = stats.map(stat => ({
    date: format(parseISO(stat.date), 'MMM d'),
    completion: stat.total > 0 ? (stat.completed / stat.total) * 100 : 0,
    streak: stat.streak
  }))

  // Get streak data for chart
  const streakData = stats.map(stat => ({
    date: format(parseISO(stat.date), 'MMM d'),
    streak: stat.streak
  }))

  // Category distribution
  const categoryStats = routine.reduce((acc, task) => {
    const category = task.category
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const categoryChartData = Object.entries(categoryStats).map(([name, count]) => ({
    name,
    count
  }))

  return (
    <div className="stats-dashboard">
      <h2>Your Progress Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{weeklyRate}%</div>
          <div className="stat-label">This Week</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{monthlyRate}%</div>
          <div className="stat-label">This Month</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.length > 0 ? stats[stats.length - 1].streak : 0}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.filter(s => s.total > 0 && s.completed === s.total).length}</div>
          <div className="stat-label">Perfect Days</div>
        </div>
      </div>
      
      <div className="chart-section">
        <h3>Completion Trend</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2F2F2F" />
              <XAxis dataKey="date" stroke="#A3A3A3" />
              <YAxis stroke="#A3A3A3" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#262626', 
                  borderColor: '#2F2F2F',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#FFFFFF' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completion" 
                name="Completion %" 
                stroke="#9E7FFF" 
                strokeWidth={2}
                dot={{ stroke: '#9E7FFF', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="chart-section">
        <h3>Streak History</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={streakData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2F2F2F" />
              <XAxis dataKey="date" stroke="#A3A3A3" />
              <YAxis stroke="#A3A3A3" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#262626', 
                  borderColor: '#2F2F2F',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#FFFFFF' }}
              />
              <Legend />
              <Bar 
                dataKey="streak" 
                name="Streak" 
                fill="#38bdf8" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="chart-section">
        <h3>Task Categories</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2F2F2F" />
              <XAxis dataKey="name" stroke="#A3A3A3" />
              <YAxis stroke="#A3A3A3" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#262626', 
                  borderColor: '#2F2F2F',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#FFFFFF' }}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Tasks" 
                fill="#f472b6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default StatsDashboard
