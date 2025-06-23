import { useState, useEffect } from 'react'
import { Trash2, History } from 'lucide-react'

function HistoryPanel({ darkMode }) {
  const [history, setHistory] = useState([])
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

  // Fetch history on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/history`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error('Error fetching history:', err))
  }, [])

    const clearHistory = async () => {
    try {
      await fetch(`${API_BASE_URL}/history/clear`, { method: 'POST' })
      setHistory([])
    } catch (err) {
      console.error('Error clearing history:', err)
    }
  }


  const getSentimentColor = (prediction) => {
    const base = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'
    switch(prediction?.toLowerCase()) {
      case 'positive': return darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'
      case 'negative': return darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'  
      case 'neutral': return darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'
      default: return base
    }
  }

  const panelBg = darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
  const textPrimary = darkMode ? 'text-white' : 'text-black'
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600'
  const buttonBg = darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600' : 'bg-gray-100 hover:bg-gray-200 text-black border-gray-300'
  const tableBg = darkMode ? 'bg-gray-900' : 'bg-gray-50'
  const tableHeaderBg = darkMode ? 'bg-gray-800' : 'bg-gray-100'
  const tableRowBg = darkMode ? 'bg-gray-850 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'
  const tableBorder = darkMode ? 'border-gray-700' : 'border-gray-200'

  return (
    <div className={`${panelBg} border rounded-lg shadow-lg transition-colors duration-200`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <History className={`w-6 h-6 ${textPrimary}`} />
            <div>
              <h2 className={`text-xl font-bold ${textPrimary}`}>Analysis History</h2>
              <p className={`text-sm ${textSecondary}`}>Your recent sentiment analysis results</p>
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${buttonBg}`}
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <History className={`w-8 h-8 ${textSecondary}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>No analysis history yet</h3>
            <p className={textSecondary}>Start analyzing reviews to see your history here</p>
          </div>
        ) : (
          <div className={`${tableBg} rounded-lg border ${tableBorder} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${tableHeaderBg} border-b ${tableBorder}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${textPrimary}`}>Text</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${textPrimary}`}>Sentiment</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${textPrimary}`}>Confidence</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${textPrimary}`}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index} className={`border-b ${tableBorder} ${tableRowBg} transition-colors duration-150`}>
                      <td className={`px-6 py-4 ${textPrimary}`}>
                        <div className="max-w-xs truncate" title={item.text}>
                          {item.text}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(item.prediction)}`}>
                          {item.prediction}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${textPrimary}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-full bg-gray-300 rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-gray-400' : 'bg-gray-600'}`}
                              style={{ width: `${item.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${textPrimary} min-w-max`}>
                            {(item.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${textSecondary}`}>
                        {new Date(item.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPanel