import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // --- BACKEND LOGIC (WITH API CALL) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setIsLoading(true);

    try {
      // Call your Flask backend API
      const response = await fetch(
        'http://localhost:5000/predict',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        }
      );
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setResult({ error: 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  }

  // --- HELPER FUNCTIONS FOR STYLING ---
  const getSentimentColor = (prediction) => {
    switch(prediction?.toLowerCase()) {
      case 'positive': return 'sentiment-positive'
      case 'negative': return 'sentiment-negative'
      case 'neutral': return 'sentiment-neutral'
      default: return 'sentiment-default'
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
    <div className="app-container">
      {/* Animated background elements */}
      <div className="background-decoration">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="main-content">
        {/* Main container with glassmorphism effect */}
        <div className="glass-container">
          
          {/* Header with gradient text */}
          <div className="header-section">
            <div className="title-container">
              <h1 className="main-title">
                Sentiment Analyzer
              </h1>
              <div className="title-glow"></div>
            </div>
            <p className="subtitle">
              Discover the emotional tone of any text with AI precision
            </p>
          </div>

          {/* Form with enhanced styling */}
          <div className="form-section">
            <div className="input-container">
              <textarea
                className="text-input"
                rows="5"
                placeholder="✨ Enter some text and watch the magic happen..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="input-glow"></div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              onClick={handleSubmit}
              className="analyze-button"
            >
              <span className="button-bg"></span>
              <span className="button-glow"></span>
              <span className="button-content">
                {isLoading ? (
                  <span className="loading-content">
                    <span className="spinner"></span>
                    <span>Analyzing...</span>
                  </span>
                ) : (
                  <span className="default-content">
                    <span>🔮</span>
                    <span>Analyze Sentiment</span>
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Results with enhanced animations and styling */}
          {result && (
            <div className="results-section">
              {result.error ? (
                <div className="error-card">
                  <div className="error-icon">⚠️</div>
                  <p className="error-message">{result.error}</p>
                </div>
              ) : (
                <div className="results-container">
                  {/* Sentiment Result Card */}
                  <div className="sentiment-card">
                    <div className="sentiment-content">
                      <div className="sentiment-emoji">
                        {getSentimentEmoji(result.prediction)}
                      </div>
                      <div className="sentiment-info">
                        <p className="sentiment-label">
                          Sentiment Analysis
                        </p>
                        <div className={`sentiment-badge ${getSentimentColor(result.prediction)}`}>
                          {result.prediction}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Meter */}
                  <div className="confidence-card">
                    <div className="confidence-content">
                      <div className="confidence-header">
                        <span className="confidence-label">Confidence Level</span>
                        <span className="confidence-value">
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      {/* Animated progress bar */}
                      <div className="progress-container">
                        <div 
                          className={`progress-bar ${getSentimentColor(result.prediction)}`}
                          style={{ width: `${result.confidence * 100}%` }}
                        >
                          <div className="progress-shimmer"></div>
                        </div>
                      </div>
                      
                      {/* Confidence description */}
                      <p className="confidence-description">
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
        <div className="footer">
          <p className="footer-text">
            Powered by AI • Styled with ✨
          </p>
        </div>
      </div>
    </div>
  )
}

export default App