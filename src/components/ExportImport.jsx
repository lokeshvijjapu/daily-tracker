import React, { useState } from 'react'
import './ExportImport.css'

const ExportImport = ({ exportData, importData }) => {
  const [importText, setImportText] = useState('')
  const [message, setMessage] = useState('')

  const handleExport = () => {
    const data = exportData()
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `routine-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setMessage('Backup file downloaded successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleImport = () => {
    try {
      const data = JSON.parse(importText)
      importData(data)
      setMessage('Data imported successfully!')
      setImportText('')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error importing data. Please check the format.')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleFileImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        importData(data)
        setMessage('Data imported successfully from file!')
        setTimeout(() => setMessage(''), 3000)
      } catch (error) {
        setMessage('Error importing data from file. Please check the format.')
        setTimeout(() => setMessage(''), 3000)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="export-import">
      <h2>Backup & Restore</h2>
      <p className="section-description">
        Export your routine and progress to keep a backup or transfer to another device
      </p>
      
      <div className="export-section">
        <h3>Export Data</h3>
        <p>Download a backup of your routine, streak, and statistics</p>
        <button className="export-btn" onClick={handleExport}>
          Download Backup
        </button>
      </div>
      
      <div className="import-section">
        <h3>Import Data</h3>
        <p>Paste your backup data below or upload a backup file</p>
        
        <div className="import-options">
          <div className="import-text-area">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste your backup data here..."
              rows={6}
            />
            <button 
              className="import-btn"
              onClick={handleImport}
              disabled={!importText.trim()}
            >
              Import Data
            </button>
          </div>
          
          <div className="import-file-upload">
            <label className="file-upload-label">
              Upload Backup File
              <input 
                type="file" 
                accept=".json"
                onChange={handleFileImport}
                className="file-input"
              />
            </label>
          </div>
        </div>
      </div>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <div className="instructions">
        <h3>How to Use</h3>
        <ul>
          <li>Click "Download Backup" to save your current data</li>
          <li>To restore, paste your backup data and click "Import Data"</li>
          <li>You can also upload a .json backup file directly</li>
          <li>After importing, refresh the page to see your restored data</li>
        </ul>
      </div>
    </div>
  )
}

export default ExportImport
