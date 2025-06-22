// import { useState } from 'react'

// function SentimentAnalyzer({ darkMode }) {
//   const [text, setText] = useState('')
//   const [result, setResult] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!text.trim()) return
//     setResult(null)
//     setIsLoading(true)
//     try {
//       const response = await fetch(`${API_BASE_URL}/predict`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text })
//       })
//       const data = await response.json()
//       setResult(data)
//     } catch (err) {
//       console.error('Error:', err)
//       setResult({ error: 'Something went wrong. Please try again.' })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getSentimentColor = (prediction) => {
//     switch(prediction?.toLowerCase()) {
//       case 'positive': return 'bg-gray-800'
//       case 'negative': return 'bg-gray-800'
//       case 'neutral': return 'bg-gray-800'
//       default: return 'bg-gray-600'
//     }
//   }

//   const getSentimentEmoji = (prediction) => {
//     switch(prediction?.toLowerCase()) {
//       case 'positive': return '😊'
//       case 'negative': return '😞'
//       case 'neutral': return '😐'
//       default: return '🤔'
//     }
//   }

//   const getConfidenceLabel = (confidence) => {
//     if (confidence > 0.85) return "Very confident"
//     if (confidence > 0.65) return "Moderately confident"
//     return "Less confident"
//   }

//   return (
//     <div className="space-y-8">
//       {/* Main Form */}
//       <div className={`rounded-2xl shadow-xl border transition-all duration-300 ${
//         darkMode 
//           ? 'bg-gray-900 border-gray-800' 
//           : 'bg-white/70 backdrop-blur-sm border-gray-200'
//       }`}>
//         <div className="p-8">
//           <div className="text-center mb-8">
//             <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Analyze Customer Reviews</h2>
//             <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter an Amazon review or any text to analyze its sentiment</p>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="relative">
//               <textarea
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="✨ Paste an Amazon review here: 'This product exceeded my expectations! Great quality and fast shipping...'"
//                 rows={6}
//                 className={`w-full p-4 rounded-xl border-2 transition-all duration-200 resize-none ${
//                   darkMode
//                     ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-500'
//                     : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-600'
//                 } focus:outline-none focus:ring-2 focus:ring-gray-500/20`}
//               />
//               <div className={`absolute bottom-3 right-3 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{text.length}/5000</div>
//             </div>
//             <button
//               type="submit"
//               disabled={isLoading || !text.trim()}
//               className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gray-900 hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Analyzing Sentiment...</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center space-x-2">
//                   <span>🔮</span>
//                   <span>Analyze Sentiment</span>
//                 </div>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//       {/* Results */}
//       {result && (
//         <div className="space-y-6">
//           {result.error ? (
//             <div className={`p-6 rounded-xl border ${darkMode ? 'bg-red-900/20 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-800'}`}>
//               <div className="flex items-center">
//                 <span className="text-2xl mr-3">⚠️</span>
//                 <p className="font-medium">{result.error}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Sentiment Result */}
//               <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
//                 <div className="text-center">
//                   <div className="text-6xl mb-4 animate-bounce">{getSentimentEmoji(result.prediction)}</div>
//                   <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sentiment Analysis</h3>
//                   <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${getSentimentColor(result.prediction)}`}>{result.prediction}</div>
//                 </div>
//               </div>
//               {/* Confidence Score */}
//               <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Confidence Level</h3>
//                     <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{(result.confidence * 100).toFixed(1)}%</span>
//                   </div>
//                   <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
//                     <div 
//                       className={`h-3 rounded-full ${getSentimentColor(result.prediction)} transition-all duration-1000 ease-out`}
//                       style={{ width: `${result.confidence * 100}%` }}
//                     ></div>
//                   </div>
//                   <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getConfidenceLabel(result.confidence)} in this prediction</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default SentimentAnalyzer 












import { useState } from 'react'

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
      case 'positive': return darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-black border-gray-300'
      case 'negative': return darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-black border-gray-300'
      case 'neutral': return darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-black border-gray-300'
      default: return darkMode ? 'bg-gray-600 text-white' : 'bg-gray-400 text-white'
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

  const mainCardBg = darkMode 
    ? 'bg-black border-gray-800' 
    : 'bg-white border-gray-200'
  
  const textPrimary = darkMode ? 'text-white' : 'text-black'
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600'
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500'
  
  const textareaStyles = darkMode
    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-gray-500'
    : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-gray-600'
  
  const buttonBg = darkMode 
    ? 'bg-white text-black hover:bg-gray-100' 
    : 'bg-black text-white hover:bg-gray-800'
  
  const resultCardBg = darkMode 
    ? 'bg-gray-900 border-gray-800' 
    : 'bg-white border-gray-200'
  
  const progressBarBg = darkMode ? 'bg-gray-800' : 'bg-gray-200'
  const progressBarFill = darkMode ? 'bg-gray-400' : 'bg-gray-600'

  return (
    <div className="space-y-8">
      {/* Main Form */}
      <div className={`rounded-2xl shadow-2xl border-2 transition-all duration-300 ${mainCardBg}`}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${textPrimary}`}>
              Analyze Customer Reviews
            </h2>
            <p className={textMuted}>
              Enter an Amazon review or any text to analyze its sentiment
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="✨ Paste an Amazon review here: 'This product exceeded my expectations! Great quality and fast shipping...'"
                rows={6}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 resize-none ${textareaStyles} focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-gray-500/30' : 'focus:ring-gray-400/30'}`}
              />
              <div className={`absolute bottom-3 right-3 text-sm ${textMuted}`}>
                {text.length}/5000
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isLoading || !text.trim()}
              className={`w-full py-4 px-6 rounded-xl font-semibold transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg border-2 ${buttonBg} ${darkMode ? 'border-gray-300' : 'border-gray-700'}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-5 h-5 border-2 ${darkMode ? 'border-black border-t-transparent' : 'border-white border-t-transparent'} rounded-full animate-spin`}></div>
                  <span>Analyzing Sentiment...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🔮</span>
                  <span>Analyze Sentiment</span>
                </div>
              )}
            </button>
            
          </div>
          
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {result.error ? (
            <div className={`p-6 rounded-xl border-2 ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'}`}>
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <p className="font-medium">{result.error}</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sentiment Result */}
              <div className={`p-6 rounded-xl shadow-lg border-2 transition-all duration-300 ${resultCardBg}`}>
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">
                    {getSentimentEmoji(result.prediction)}
                  </div>
                  <h3 className={`text-lg font-medium mb-4 ${textSecondary}`}>
                    Sentiment Analysis
                  </h3>
                  <div className={`inline-block px-6 py-3 rounded-full font-semibold border-2 ${getSentimentColor(result.prediction)}`}>
                    {result.prediction}
                  </div>
                </div>
              </div>

              {/* Confidence Score */}
              <div className={`p-6 rounded-xl shadow-lg border-2 ${resultCardBg}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-medium ${textSecondary}`}>
                      Confidence Level
                    </h3>
                    <span className={`text-2xl font-bold ${textPrimary}`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className={`w-full rounded-full h-4 ${progressBarBg} border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                    <div 
                      className={`h-full rounded-full ${progressBarFill} transition-all duration-1000 ease-out`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  
                  <p className={`text-sm ${textMuted}`}>
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

export default SentimentAnalyzer