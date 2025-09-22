import React, { useState } from 'react'
import { format, isToday } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import './RoutineTracker.css'

const RoutineTracker = ({ routine, onUpdateTask, streak }) => {
  const [showMotivation, setShowMotivation] = useState(false)
  const [completedToday, setCompletedToday] = useState(0)

  // Check if all tasks are completed
  React.useEffect(() => {
    const completed = routine.filter(task => task.completed).length
    setCompletedToday(completed)
    
    if (completed > 0 && completed === routine.length) {
      setShowMotivation(true)
      const timer = setTimeout(() => setShowMotivation(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [routine])

  const handleTaskUpdate = (id, status) => {
    onUpdateTask(id, status)
  }

  const getTaskCategory = (category) => {
    const categories = {
      health: { name: 'Health', color: '#10b981' },
      work: { name: 'Work', color: '#38bdf8' },
      study: { name: 'Study', color: '#f472b6' },
      personal: { name: 'Personal', color: '#f59e0b' },
      other: { name: 'Other', color: '#9E7FFF' }
    }
    return categories[category] || categories.other
  }

  const getTaskIcon = (category) => {
    const icons = {
      health: '💪',
      work: '💼',
      study: '📚',
      personal: '👤',
      other: '📌'
    }
    return icons[category] || '📌'
  }

  // Guard against missing `days` property
  const isTaskForToday = (task) => {
    const today = format(new Date(), 'eee').toLowerCase().slice(0, 3)
    // If task.days is not an array, treat as not scheduled for today
    if (!Array.isArray(task.days)) return false
    return task.days.includes(today)
  }

  const tasksForToday = routine.filter(isTaskForToday)
  
  const completedTasks = tasksForToday.filter(task => task.completed).length
  const allCompleted = tasksForToday.length > 0 && completedTasks === tasksForToday.length

  return (
    <div className="routine-tracker">
      <div className="tracker-header">
        <h2>Today's Routine</h2>
        <p className="date-display">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        <div className="progress-summary">
          <div className="progress-text">
            {completedTasks} of {tasksForToday.length} tasks completed
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: tasksForToday.length > 0 
                  ? `${(completedTasks / tasksForToday.length) * 100}%` 
                  : '0%' 
              }}
            ></div>
          </div>
        </div>
      </div>

      {tasksForToday.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks scheduled for today</p>
          <button 
            className="setup-btn"
            onClick={() => document.querySelector('nav button:nth-child(2)').click()}
          >
            Set up your routine
          </button>
        </div>
      ) : (
        <div className="tasks-list">
          <AnimatePresence>
            {tasksForToday.map((task) => {
              const category = getTaskCategory(task.category)
              return (
                <motion.div
                  key={task.id}
                  className={`task-item ${task.completed ? 'completed' : ''} ${task.skipped ? 'skipped' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="task-content">
                    <div className="task-icon" style={{ backgroundColor: category.color }}>
                      {getTaskIcon(task.category)}
                    </div>
                    <div className="task-details">
                      <h3>{task.title}</h3>
                      <div className="task-meta">
                        {task.time && <span className="task-time">⏰ {task.time}</span>}
                        <span 
                          className="task-category" 
                          style={{ color: category.color }}
                        >
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="task-actions">
                    <button
                      className={`action-btn skip-btn ${task.skipped ? 'active' : ''}`}
                      onClick={() => handleTaskUpdate(task.id, { 
                        skipped: !task.skipped,
                        completed: task.skipped ? task.completed : false
                      })}
                      title="Skip task"
                    >
                      Skip
                    </button>
                    
                    <button
                      className={`action-btn done-btn ${task.completed ? 'active' : ''}`}
                      onClick={() => handleTaskUpdate(task.id, { 
                        completed: !task.completed,
                        skipped: task.completed ? task.skipped : false
                      })}
                      title="Mark as done"
                    >
                      {task.completed ? '✓ Done' : 'Done'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showMotivation && (
          <motion.div
            className="motivation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="motivation-card"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <div className="celebration-emoji">🎉</div>
              <h3>Great Job!</h3>
              <p>You've completed all your tasks for today!</p>
              <div className="streak-celebration">
                🔥 {streak} day streak
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RoutineTracker
