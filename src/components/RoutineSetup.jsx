import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './RoutineSetup.css'

const DEFAULT_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const RoutineSetup = ({ routine, onSave }) => {
  // Normalise incoming routine – every task must have a days array
  const [tasks, setTasks] = useState(
    routine.length > 0
      ? routine.map(task => ({
          ...task,
          days: Array.isArray(task.days) ? task.days : DEFAULT_DAYS
        }))
      : [
          {
            id: uuidv4(),
            title: '',
            time: '',
            category: 'health',
            days: DEFAULT_DAYS,
            reminder: ''
          }
        ]
  )

  const categories = [
    { id: 'health', name: 'Health', color: '#10b981' },
    { id: 'work', name: 'Work', color: '#38bdf8' },
    { id: 'study', name: 'Study', color: '#f472b6' },
    { id: 'personal', name: 'Personal', color: '#f59e0b' },
    { id: 'other', name: 'Other', color: '#9E7FFF' }
  ]

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        id: uuidv4(),
        title: '',
        time: '',
        category: 'health',
        days: DEFAULT_DAYS,
        reminder: ''
      }
    ])
  }

  const removeTask = id => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== id))
    }
  }

  const updateTask = (id, field, value) => {
    setTasks(
      tasks.map(task => (task.id === id ? { ...task, [field]: value } : task))
    )
  }

  const toggleDay = (id, day) => {
    setTasks(
      tasks.map(task => {
        if (task.id === id) {
          const currentDays = Array.isArray(task.days) ? task.days : []
          const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day]
          return { ...task, days: newDays }
        }
        return task
      })
    )
  }

  const saveRoutine = () => {
    const validTasks = tasks.filter(task => task.title.trim() !== '')
    onSave(validTasks)
    alert('Routine saved successfully!')
  }

  const daysOfWeek = [
    { id: 'mon', name: 'Mon' },
    { id: 'tue', name: 'Tue' },
    { id: 'wed', name: 'Wed' },
    { id: 'thu', name: 'Thu' },
    { id: 'fri', name: 'Fri' },
    { id: 'sat', name: 'Sat' },
    { id: 'sun', name: 'Sun' }
  ]

  return (
    <div className="routine-setup">
      <h2>Set Up Your Daily Routine</h2>
      <p className="setup-description">
        Add your daily tasks and customize when they should appear
      </p>

      <div className="tasks-container">
        {tasks.map((task, index) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h3>Task {index + 1}</h3>
              {tasks.length > 1 && (
                <button
                  className="remove-task"
                  onClick={() => removeTask(task.id)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="task-form">
              <div className="form-group">
                <label>Task Name</label>
                <input
                  type="text"
                  value={task.title}
                  onChange={e => updateTask(task.id, 'title', e.target.value)}
                  placeholder="e.g., Morning workout"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    value={task.time}
                    onChange={e => updateTask(task.id, 'time', e.target.value)}
                    placeholder="e.g., 7:00 AM"
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={task.category}
                    onChange={e => updateTask(task.id, 'category', e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Days</label>
                <div className="days-selector">
                  {daysOfWeek.map(day => (
                    <button
                      key={day.id}
                      type="button"
                      className={`day-button ${
                        Array.isArray(task.days) && task.days.includes(day.id)
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() => toggleDay(task.id, day.id)}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Reminder (optional)</label>
                <input
                  type="time"
                  value={task.reminder}
                  onChange={e => updateTask(task.id, 'reminder', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="setup-actions">
        <button className="add-task-btn" onClick={addTask}>
          + Add Another Task
        </button>
        <button className="save-btn" onClick={saveRoutine}>
          Save Routine
        </button>
      </div>
    </div>
  )
}

export default RoutineSetup
