import React, { useState, useEffect } from 'react'
import { format, isToday, parseISO, startOfDay, isBefore } from 'date-fns'
import RoutineSetup from './components/RoutineSetup'
import RoutineTracker from './components/RoutineTracker'
import StatsDashboard from './components/StatsDashboard'
import ExportImport from './components/ExportImport'
import './App.css'

const App = () => {
  const [routine, setRoutine] = useState([])
  const [streak, setStreak] = useState(0)
  const [stats, setStats] = useState([])
  const [view, setView] = useState('tracker') // tracker, setup, stats, export
  const [lastResetDate, setLastResetDate] = useState(null)

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedRoutine = localStorage.getItem('dailyRoutine')
    const savedStreak = localStorage.getItem('dailyStreak')
    const savedStats = localStorage.getItem('routineStats')
    const savedLastReset = localStorage.getItem('lastResetDate')
    
    if (savedRoutine) {
      setRoutine(JSON.parse(savedRoutine))
    }
    
    if (savedStreak) {
      setStreak(parseInt(savedStreak))
    }
    
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
    
    if (savedLastReset) {
      setLastResetDate(savedLastReset)
    }
  }, [])

  // Check if we need to reset for a new day
  useEffect(() => {
    const checkReset = () => {
      const now = new Date()
      const today = startOfDay(now)
      
      if (lastResetDate) {
        const lastReset = parseISO(lastResetDate)
        if (isBefore(lastReset, today)) {
          resetForNewDay()
        }
      } else {
        // First time setup
        setLastResetDate(today.toISOString())
        localStorage.setItem('lastResetDate', today.toISOString())
      }
    }
    
    checkReset()
    const interval = setInterval(checkReset, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [lastResetDate, routine])

  const resetForNewDay = () => {
    const today = startOfDay(new Date())
    const completedTasks = routine.filter(task => task.completed).length
    const totalTasks = routine.length
    const allCompleted = totalTasks > 0 && completedTasks === totalTasks
    
    // Update streak
    const newStreak = allCompleted ? streak + 1 : 0
    setStreak(newStreak)
    localStorage.setItem('dailyStreak', newStreak.toString())
    
    // Save stats
    const newStats = [...stats, {
      date: format(today, 'yyyy-MM-dd'),
      completed: completedTasks,
      total: totalTasks,
      streak: newStreak
    }].slice(-30) // Keep last 30 days
    
    setStats(newStats)
    localStorage.setItem('routineStats', JSON.stringify(newStats))
    
    // Reset routine
    const resetRoutine = routine.map(task => ({
      ...task,
      completed: false,
      skipped: false
    }))
    
    setRoutine(resetRoutine)
    localStorage.setItem('dailyRoutine', JSON.stringify(resetRoutine))
    setLastResetDate(today.toISOString())
    localStorage.setItem('lastResetDate', today.toISOString())
  }

  const saveRoutine = (newRoutine) => {
    setRoutine(newRoutine)
    localStorage.setItem('dailyRoutine', JSON.stringify(newRoutine))
  }

  const updateTaskStatus = (id, status) => {
    const updatedRoutine = routine.map(task => 
      task.id === id ? { ...task, ...status } : task
    )
    setRoutine(updatedRoutine)
    localStorage.setItem('dailyRoutine', JSON.stringify(updatedRoutine))
  }

  const exportData = () => {
    return {
      routine,
      streak,
      stats,
      lastResetDate
    }
  }

  const importData = (data) => {
    if (data.routine) {
      setRoutine(data.routine)
      localStorage.setItem('dailyRoutine', JSON.stringify(data.routine))
    }
    if (data.streak !== undefined) {
      setStreak(data.streak)
      localStorage.setItem('dailyStreak', data.streak.toString())
    }
    if (data.stats) {
      setStats(data.stats)
      localStorage.setItem('routineStats', JSON.stringify(data.stats))
    }
    if (data.lastResetDate) {
      setLastResetDate(data.lastResetDate)
      localStorage.setItem('lastResetDate', data.lastResetDate)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Daily Routine Tracker</h1>
        <div className="streak-display">
          🔥 {streak} day streak
        </div>
        <nav className="app-nav">
          <button 
            className={view === 'tracker' ? 'active' : ''}
            onClick={() => setView('tracker')}
          >
            Tracker
          </button>
          <button 
            className={view === 'setup' ? 'active' : ''}
            onClick={() => setView('setup')}
          >
            Edit Routine
          </button>
          <button 
            className={view === 'stats' ? 'active' : ''}
            onClick={() => setView('stats')}
          >
            Stats
          </button>
          <button 
            className={view === 'export' ? 'active' : ''}
            onClick={() => setView('export')}
          >
            Export/Import
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'setup' && (
          <RoutineSetup 
            routine={routine} 
            onSave={saveRoutine} 
          />
        )}
        
        {view === 'tracker' && (
          <RoutineTracker 
            routine={routine} 
            onUpdateTask={updateTaskStatus}
            streak={streak}
          />
        )}
        
        {view === 'stats' && (
          <StatsDashboard 
            stats={stats} 
            routine={routine}
          />
        )}
        
        {view === 'export' && (
          <ExportImport 
            exportData={exportData}
            importData={importData}
          />
        )}
      </main>
    </div>
  )
}

export default App
