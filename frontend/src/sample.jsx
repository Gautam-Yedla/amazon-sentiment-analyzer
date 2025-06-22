import { useState, useEffect } from 'react'
import { Upload, Download, Moon, Sun, BarChart3, History, Info, Globe, Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Papa from 'papaparse'

// Main App Component
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [activeTab, setActiveTab] = useState('analyze')

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Navbar */}
      <nav className={`border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white/80 backdrop-blur-sm border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">📊</div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                Amazon Sentiment Analyzer
              </h1>
            </div>
            
            {/* Navigation Tabs */}
            <div className="hidden md:flex space-x-4">
              {[
                { id: 'analyze', label: 'Analyze', icon: '🔮' },
                { id: 'bulk', label: 'Bulk Upload', icon: '📁' },
                { id: 'stats', label: 'Dashboard', icon: '📊' },
                { id: 'history', label: 'History', icon: '📝' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? darkMode ? 'bg-gray-700 text-white shadow-lg' : 'bg-gray-900 text-white shadow-lg'
                      : darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`md:hidden border-b ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex overflow-x-auto px-4 py-2 space-x-2">
          {[
            { id: 'analyze', label: 'Analyze', icon: '🔮' },
            { id: 'bulk', label: 'Bulk', icon: '📁' },
            { id: 'stats', label: 'Stats', icon: '📊' },
            { id: 'history', label: 'History', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                  : darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analyze' && <SentimentAnalyzer darkMode={darkMode} />}
        {activeTab === 'bulk' && <BulkUploader darkMode={darkMode} />}
        {activeTab === 'stats' && <StatsPanel darkMode={darkMode} />}
        {activeTab === 'history' && <HistoryPanel darkMode={darkMode} />}
      </main>

      {/* Footer */}
      <footer className={`border-t mt-16 ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Powered by AI • Styled with ✨ • v1.0
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className={`text-sm hover:underline ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                GitHub
              </a>
              <ModelInfoCard darkMode={darkMode} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Sentiment Analyzer Component
function SentimentAnalyzer({ darkMode }) {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setResult(null)
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error('Error:', err)
      setResult({ error: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const getSentimentColor = (prediction) => {
    switch(prediction?.toLowerCase()) {
      case 'positive': return 'bg-gray-800'
      case 'negative': return 'bg-gray-800'
      case 'neutral': return 'bg-gray-800'
      default: return 'bg-gray-600'
    }
  }

  const getSentimentEmoji = (prediction) => {
    switch(prediction?.toLowerCase()) {
      case 'positive': return '😊'
      case 'negative': return '😞'
      case 'neutral': return '😐'
      default: return '🤔'
    }
  }

  const getConfidenceLabel = (confidence) => {
    if (confidence > 0.85) return "Very confident"
    if (confidence > 0.65) return "Moderately confident"
    return "Less confident"
  }

  return (
    <div className="space-y-8">
      {/* Main Form */}
      <div className={`rounded-2xl shadow-xl border transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white/70 backdrop-blur-sm border-gray-200'
      }`}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
              Analyze Customer Reviews
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter an Amazon review or any text to analyze its sentiment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="✨ Paste an Amazon review here: 'This product exceeded my expectations! Great quality and fast shipping...'"
                rows={6}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 resize-none ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-gray-500/20`}
              />
              <div className={`absolute bottom-3 right-3 text-sm ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {text.length}/5000
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gray-900 hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Sentiment...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🔮</span>
                  <span>Analyze Sentiment</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {result.error ? (
            <div className={`p-6 rounded-xl border ${
              darkMode ? 'bg-red-900/20 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <p className="font-medium">{result.error}</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sentiment Result */}
              <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
                darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">
                    {getSentimentEmoji(result.prediction)}
                  </div>
                  <h3 className={`text-lg font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Sentiment Analysis
                  </h3>
                  <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${getSentimentColor(result.prediction)}`}>
                    {result.prediction}
                  </div>
                </div>
              </div>

              {/* Confidence Score */}
              <div className={`p-6 rounded-xl shadow-lg ${
                darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Confidence Level
                    </h3>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className={`w-full rounded-full h-3 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}>
                    <div 
                      className={`h-3 rounded-full ${getSentimentColor(result.prediction)} transition-all duration-1000 ease-out`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getConfidenceLabel(result.confidence)} in this prediction
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Bulk Uploader Component
function BulkUploader({ darkMode }) {
  const [file, setFile] = useState(null)
  const [results, setResults] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile && uploadedFile.name.endsWith('.csv')) {
      setFile(uploadedFile)
      setResults([])
    }
  }

  const processCSV = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const reviews = results.data.filter(row => row.Review && row.Review.trim())
        const processedResults = []

        for (let i = 0; i < reviews.length; i++) {
          try {
            const response = await fetch(`${API_BASE_URL}/predict`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: reviews[i].Review })
            })
            const data = await response.json()
            
            processedResults.push({
              ...reviews[i],
              Sentiment: data.prediction,
              Confidence: (data.confidence * 100).toFixed(1) + '%'
            })
          } catch (error) {
            console.error('Error processing review:', error)
            processedResults.push({
              ...reviews[i],
              Sentiment: 'Error',
              Confidence: '0%'
            })
          }
          
          setProgress(((i + 1) / reviews.length) * 100)
        }

        setResults(processedResults)
        setIsProcessing(false)
      }
    })
  }

  const downloadResults = () => {
    const csv = Papa.unparse(results)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sentiment_analysis_results.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div className={`rounded-2xl shadow-xl border p-8 ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
            Bulk Review Analysis
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Upload a CSV file with a "Review" column to analyze multiple reviews at once
          </p>
        </div>

        <div className="space-y-6">
          {/* File Upload */}
          <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            darkMode ? 'border-gray-700 hover:border-gray-500' : 'border-gray-200 hover:border-gray-400'
          }`}>
            <Upload className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
            <div className="space-y-2">
              <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Choose CSV file
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                File should contain a "Review" column
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-all duration-200"
              >
                Select File
              </label>
            </div>
          </div>

          {/* File Info and Process Button */}
          {file && (
            <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📄</span>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {file.name}
                </span>
              </div>
              <button
                onClick={processCSV}
                disabled={isProcessing}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Analyze Reviews'}
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Processing reviews...
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {progress.toFixed(0)}%
                </span>
              </div>
              <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                <div 
                  className="h-2 rounded-full bg-gray-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className={`rounded-xl shadow-lg border ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center">
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Analysis Results</h3>
            <button
              onClick={downloadResults}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              <Download size={16} />
              <span>Download CSV</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Review</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sentiment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {results.slice(0, 10).map((result, index) => (
                  <tr key={index} className={darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {result.Review}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-2 py-1 rounded text-white text-xs ${
                        result.Sentiment === 'Positive' ? 'bg-gray-700' :
                        result.Sentiment === 'Negative' ? 'bg-gray-700' :
                        result.Sentiment === 'Neutral' ? 'bg-gray-700' : 'bg-gray-500'
                      }`}>
                        {result.Sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {result.Confidence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {results.length > 10 && (
            <div className="p-4 text-center text-sm text-gray-500">
              Showing first 10 results. Download CSV for complete data.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Stats Panel Component
function StatsPanel({ darkMode }) {
  const [stats, setStats] = useState({
    totalReviews: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    averageConfidence: 0
  })

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('sentimentHistory') || '[]')
    if (history.length > 0) {
      const positive = history.filter(h => h.prediction === 'Positive').length
      const negative = history.filter(h => h.prediction === 'Negative').length
      const neutral = history.filter(h => h.prediction === 'Neutral').length
      const totalConfidence = history.reduce((sum, h) => sum + h.confidence, 0)
      
      setStats({
        totalReviews: history.length,
        positive,
        negative,
        neutral,
        averageConfidence: history.length > 0 ? totalConfidence / history.length : 0
      })
    }
  }, [])

  const pieData = [
    { name: 'Positive', value: stats.positive, color: '#4b5563' },
    { name: 'Negative', value: stats.negative, color: '#1f2937' },
    { name: 'Neutral', value: stats.neutral, color: '#9ca3af' }
  ]

  const barData = [
    { name: 'Avg Confidence', value: (stats.averageConfidence * 100).toFixed(1) }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
          Analytics Dashboard
        </h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Insights from your sentiment analysis history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Reviews', value: stats.totalReviews, icon: '📊' },
          { label: 'Positive', value: stats.positive, icon: '😊' },
          { label: 'Negative', value: stats.negative, icon: '😞' },
          { label: 'Neutral', value: stats.neutral, icon: '😐' }
        ].map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl shadow-lg ${
            darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  {stat.value}
                </p>
              </div>
              <div className="text-3xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className={`p-6 rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Sentiment Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                className={darkMode ? 'fill-white' : 'fill-black'}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff', 
                  borderColor: darkMode ? '#374151' : '#e5e7eb',
                  color: darkMode ? '#ffffff' : '#000000'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className={`p-6 rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Average Confidence
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" className={darkMode ? 'stroke-gray-800' : 'stroke-gray-200'} />
              <XAxis dataKey="name" className={darkMode ? 'fill-gray-400' : 'fill-gray-600'} />
              <YAxis className={darkMode ? 'fill-gray-400' : 'fill-gray-600'} />
              <Tooltip 
                 contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff', 
                  borderColor: darkMode ? '#374151' : '#e5e7eb',
                  color: darkMode ? '#ffffff' : '#000000'
                }} 
              />
              <Bar dataKey="value" fill={darkMode ? '#fafafa' : '#1f2937'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// History Panel Component
function HistoryPanel({ darkMode }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('sentimentHistory') || '[]')
    setHistory(savedHistory)
  }, [])

  const clearHistory = () => {
    localStorage.removeItem('sentimentHistory')
    setHistory([])
  }

  const getSentimentColor = (prediction) => {
    switch(prediction?.toLowerCase()) {
      case 'positive': return 'bg-gray-700'
      case 'negative': return 'bg-gray-700'
      case 'neutral': return 'bg-gray-700'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
            Analysis History
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Your recent sentiment analysis results
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={`text-center py-12 rounded-xl ${
          darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <History className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
          <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            No analysis history yet
          </p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Start analyzing reviews to see your history here
          </p>
        </div>
      ) : (
        <div className={`rounded-xl shadow-lg border ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Text</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sentiment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {history.map((item) => (
                  <tr key={item.id} className={darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {item.text}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-2 py-1 rounded text-white text-xs ${getSentimentColor(item.prediction)}`}>
                        {item.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-sm">
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
  )
}

// Model Info Card Component
function ModelInfoCard({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 text-sm hover:underline ${
          darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Info size={14} />
        <span>Model Info</span>
      </button>
      
      {isOpen && (
        <div className={`absolute bottom-full right-0 mb-2 p-4 rounded-lg shadow-lg border max-w-xs ${
          darkMode ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-700'
        }`}>
          <div className="space-y-2">
            <h4 className="font-medium">Sentiment Analysis Model</h4>
            <p className="text-sm">
              Uses a machine learning model trained on Amazon product reviews to classify sentiment as Positive, Negative, or Neutral.
            </p>
            <p className="text-sm">
              <strong>Accuracy:</strong> ~85%<br />
              <strong>Training Data:</strong> 50K+ reviews<br />
              <strong>Model Type:</strong> FastText
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App


