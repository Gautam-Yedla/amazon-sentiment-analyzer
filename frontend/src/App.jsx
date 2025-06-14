import { useState } from 'react'

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // --- BACKEND LOGIC (UNCHANGED) ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setResult(null)
    setIsLoading(true)

    try {
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock sentiment analysis based on keywords
      const lowerText = text.toLowerCase()
      let prediction = 'neutral'
      let confidence = 0.75
      
      if (lowerText.includes('love') || lowerText.includes('great') || lowerText.includes('excellent') || lowerText.includes('amazing') || lowerText.includes('perfect')) {
        prediction = 'positive'
        confidence = 0.92
      } else if (lowerText.includes('hate') || lowerText.includes('terrible') || lowerText.includes('awful') || lowerText.includes('bad') || lowerText.includes('worst')) {
        prediction = 'negative'
        confidence = 0.87
      } else if (lowerText.includes('okay') || lowerText.includes('average') || lowerText.includes('decent')) {
        prediction = 'neutral'
        confidence = 0.68
      }
      
      setResult({ prediction, confidence })
    } catch (err) {
      console.error('Error:', err)
      setResult({ error: 'Something went wrong.' })
    } finally {
      setIsLoading(false)
    }
  }

  // --- HELPER FUNCTIONS FOR STYLING ---
  const getSentimentColor = (prediction) => {
    switch(prediction?.toLowerCase()) {
      case 'positive': return 'from-green-400 to-emerald-600'
      case 'negative': return 'from-red-400 to-rose-600'
      case 'neutral': return 'from-yellow-400 to-amber-600'
      default: return 'from-gray-400 to-gray-600'
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

  return (
    <>
      {/* Custom CSS for animations and complex styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-pulse-custom {
          animation: pulse 4s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }

        .mix-blend-multiply {
          mix-blend-mode: multiply;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-custom"></div>
          <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-custom animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-custom animation-delay-4000"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          {/* Main container with glassmorphism effect */}
          <div className="backdrop-blur-xl bg-white bg-opacity-10 rounded-3xl shadow-2xl border border-white border-opacity-20 p-8 space-y-8 transform transition-all duration-500 hover:scale-[1.02]">
            
            {/* Header with gradient text */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-lg">
                  Sentiment Analyzer
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 -z-10"></div>
              </div>
              <p className="text-white text-opacity-80 text-lg font-medium">
                Discover the emotional tone of any text with AI precision
              </p>
            </div>

            {/* Form with enhanced styling */}
            <div className="space-y-6">
              <div className="relative group">
                <textarea
                  className="w-full p-4 bg-white bg-opacity-10 backdrop-blur-sm border-2 border-white border-opacity-20 rounded-2xl text-white placeholder-white placeholder-opacity-60 resize-none focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400 focus:ring-opacity-20 transition-all duration-300 hover:bg-white hover:bg-opacity-15 text-lg leading-relaxed"
                  rows="5"
                  placeholder="✨ Enter some text and watch the magic happen..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 from-opacity-0 via-pink-400 via-opacity-0 to-purple-400 to-opacity-0 group-hover:from-purple-400 group-hover:from-opacity-10 group-hover:via-pink-400 group-hover:via-opacity-5 group-hover:to-purple-400 group-hover:to-opacity-10 transition-all duration-500 pointer-events-none"></div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !text.trim()}
                onClick={handleSubmit}
                className="relative w-full group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden rounded-2xl"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></span>
                <span className="relative text-white font-bold py-4 px-8 flex items-center justify-center transform transition-all duration-200 group-hover:scale-105 group-active:scale-95 text-lg">
                  {isLoading ? (
                    <span className="flex items-center justify-center space-x-3">
                      <span className="w-6 h-6 border-4 border-white border-opacity-30 border-t-white rounded-full animate-spin"></span>
                      <span>Analyzing...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>🔮</span>
                      <span>Analyze Sentiment</span>
                    </span>
                  )}
                </span>
              </button>
            </div>

            {/* Results with enhanced animations and styling */}
            {result && (
              <div className="animate-fadeInUp pt-4">
                {result.error ? (
                  <div className="backdrop-blur-sm bg-red-500 bg-opacity-20 border-2 border-red-400 border-opacity-50 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-red-200 text-lg font-semibold">{result.error}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Sentiment Result Card */}
                    <div className="backdrop-blur-sm bg-white bg-opacity-10 border-2 border-white border-opacity-20 rounded-2xl p-6 transform transition-all duration-500 hover:scale-105">
                      <div className="text-center space-y-4">
                        <div className="text-6xl animate-bounce">
                          {getSentimentEmoji(result.prediction)}
                        </div>
                        <div>
                          <p className="text-white text-opacity-80 text-sm font-medium uppercase tracking-wider mb-2">
                            Sentiment Analysis
                          </p>
                          <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getSentimentColor(result.prediction)} text-white font-bold text-2xl shadow-lg transform transition-all duration-300 hover:shadow-2xl capitalize`}>
                            {result.prediction}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Meter */}
                    <div className="backdrop-blur-sm bg-white bg-opacity-10 border-2 border-white border-opacity-20 rounded-2xl p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-opacity-80 font-medium">Confidence Level</span>
                          <span className="text-white font-bold text-xl">
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        {/* Animated progress bar */}
                        <div className="relative h-4 bg-white bg-opacity-10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getSentimentColor(result.prediction)} rounded-full transition-all duration-1000 ease-out relative`}
                            style={{ width: `${result.confidence * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-30 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                        
                        {/* Confidence description */}
                        <p className="text-white text-opacity-60 text-sm text-center">
                          {result.confidence > 0.85 ? "Very confident" : 
                           result.confidence > 0.65 ? "Moderately confident" : 
                           "Less confident"} in this prediction
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white text-opacity-50 text-sm">
              Powered by AI • Styled with ✨
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App