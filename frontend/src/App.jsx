// import { useState, useEffect } from 'react'
// import { Upload, Download, Moon, Sun, BarChart3, History, Info, Globe, Trash2 } from 'lucide-react'
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// import Papa from 'papaparse'
// import SentimentAnalyzer from './components/SentimentAnalyzer'
// import BulkUploader from './components/BulkUploader'
// import StatsPanel from './components/StatsPanel'
// import HistoryPanel from './components/HistoryPanel'
// import ModelInfoCard from './components/ModelInfoCard'

// // Main App Component
// function App() {
//   const [darkMode, setDarkMode] = useState(() => {
//     const saved = localStorage.getItem('darkMode')
//     return saved ? JSON.parse(saved) : false
//   })
//   const [activeTab, setActiveTab] = useState('analyze')

//   useEffect(() => {
//     localStorage.setItem('darkMode', JSON.stringify(darkMode))
//     if (darkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }, [darkMode])

//   return (
//     <div className={`min-h-screen transition-colors duration-300 ${
//       darkMode ? 'bg-black' : 'bg-gray-50'
//     }`}>
//       {/* Navbar */}
//       <nav className={`border-b transition-colors duration-300 ${
//         darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white/80 backdrop-blur-sm border-gray-200'
//       }`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <div className="text-2xl">📊</div>
//               <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
//                 Amazon Sentiment Analyzer
//               </h1>
//             </div>
            
//             {/* Navigation Tabs */}
//             <div className="hidden md:flex space-x-4">
//               {[
//                 { id: 'analyze', label: 'Analyze', icon: '🔮' },
//                 { id: 'bulk', label: 'Bulk Upload', icon: '📁' },
//                 { id: 'stats', label: 'Dashboard', icon: '📊' },
//                 { id: 'history', label: 'History', icon: '📝' }
//               ].map(tab => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                     activeTab === tab.id
//                       ? darkMode ? 'bg-gray-700 text-white shadow-lg' : 'bg-gray-900 text-white shadow-lg'
//                       : darkMode 
//                         ? 'text-gray-300 hover:text-white hover:bg-gray-800'
//                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                   }`}
//                 >
//                   <span className="mr-2">{tab.icon}</span>
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Dark Mode Toggle */}
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className={`p-2 rounded-lg transition-all duration-200 ${
//                 darkMode 
//                   ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
//                   : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//               }`}
//             >
//               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Navigation */}
//       <div className={`md:hidden border-b ${
//         darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
//       }`}>
//         <div className="flex overflow-x-auto px-4 py-2 space-x-2">
//           {[
//             { id: 'analyze', label: 'Analyze', icon: '🔮' },
//             { id: 'bulk', label: 'Bulk', icon: '📁' },
//             { id: 'stats', label: 'Stats', icon: '📊' },
//             { id: 'history', label: 'History', icon: '📝' }
//           ].map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex-shrink-0 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
//                 activeTab === tab.id
//                   ? darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
//                   : darkMode 
//                     ? 'text-gray-300 hover:text-white hover:bg-gray-800'
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//               }`}
//             >
//               <span className="mr-1">{tab.icon}</span>
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {activeTab === 'analyze' && <SentimentAnalyzer darkMode={darkMode} />}
//         {activeTab === 'bulk' && <BulkUploader darkMode={darkMode} />}
//         {activeTab === 'stats' && <StatsPanel darkMode={darkMode} />}
//         {activeTab === 'history' && <HistoryPanel darkMode={darkMode} />}
//       </main>

//       {/* Footer */}
//       <footer className={`border-t mt-16 ${
//         darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
//       }`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
//             <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//               Powered by AI • Styled with ✨ • v1.0
//             </p>
//             <div className="flex items-center space-x-4">
//               <a href="#" className={`text-sm hover:underline ${
//                 darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
//               }`}>
//                 GitHub
//               </a>
//               <ModelInfoCard darkMode={darkMode} />
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// export default App







import { useState, useEffect } from 'react'
import { Upload, Download, Moon, Sun, BarChart3, History, Info, Globe, Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Papa from 'papaparse'
import SentimentAnalyzer from './components/SentimentAnalyzer'
import BulkUploader from './components/BulkUploader'
import StatsPanel from './components/StatsPanel'
import HistoryPanel from './components/HistoryPanel'
import ModelInfoCard from './components/ModelInfoCard'

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
      darkMode ? 'bg-black' : 'bg-white'
    }`}>
      {/* Navbar */}
      <nav className={`border-b transition-colors duration-300 ${
        darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className={`text-2xl p-2 rounded-lg ${
                darkMode ? 'bg-white text-black' : 'bg-black text-white'
              }`}>📊</div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                Amazon Sentiment Analyzer
              </h1>
            </div>
            
            {/* Navigation Tabs */}
            <div className="hidden md:flex space-x-2">
              {[
                { id: 'analyze', label: 'Analyze', icon: '🔮' },
                { id: 'bulk', label: 'Bulk Upload', icon: '📁' },
                { id: 'stats', label: 'Dashboard', icon: '📊' },
                { id: 'history', label: 'History', icon: '📝' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
                    activeTab === tab.id
                      ? darkMode 
                        ? 'bg-white text-black border-white shadow-lg' 
                        : 'bg-black text-white border-black shadow-lg'
                      : darkMode 
                        ? 'text-gray-300 border-gray-700 hover:text-white hover:border-gray-500 hover:bg-gray-900'
                        : 'text-gray-700 border-gray-300 hover:text-black hover:border-gray-500 hover:bg-gray-100'
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
              className={`p-3 rounded-lg transition-all duration-200 border ${
                darkMode 
                  ? 'bg-gray-900 text-white border-gray-700 hover:bg-gray-800 hover:border-gray-600' 
                  : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200 hover:border-gray-400'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`md:hidden border-b ${
        darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex overflow-x-auto px-4 py-3 space-x-2">
          {[
            { id: 'analyze', label: 'Analyze', icon: '🔮' },
            { id: 'bulk', label: 'Bulk', icon: '📁' },
            { id: 'stats', label: 'Stats', icon: '📊' },
            { id: 'history', label: 'History', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
                activeTab === tab.id
                  ? darkMode 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black text-white border-black'
                  : darkMode 
                    ? 'text-gray-300 border-gray-700 hover:text-white hover:border-gray-500'
                    : 'text-gray-700 border-gray-300 hover:text-black hover:border-gray-500'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-xl border transition-colors duration-300 ${
          darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="p-6">
            {activeTab === 'analyze' && <SentimentAnalyzer darkMode={darkMode} />}
            {activeTab === 'bulk' && <BulkUploader darkMode={darkMode} />}
            {activeTab === 'stats' && <StatsPanel darkMode={darkMode} />}
            {activeTab === 'history' && <HistoryPanel darkMode={darkMode} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t mt-16 ${
        darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className={`text-center md:text-left ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-sm font-medium">Powered by AI • Styled with ✨ • v1.0</p>
              <p className="text-xs mt-1">Professional sentiment analysis for Amazon reviews</p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className={`text-sm font-medium transition-colors duration-200 ${
                darkMode 
                  ? 'text-gray-400 hover:text-white border-b border-transparent hover:border-white' 
                  : 'text-gray-600 hover:text-black border-b border-transparent hover:border-black'
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

export default App