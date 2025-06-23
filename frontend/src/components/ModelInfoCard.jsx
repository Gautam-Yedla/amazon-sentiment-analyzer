import { useState } from 'react'
import { Info } from 'lucide-react'

function ModelInfoCard({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false)

  const buttonColors = darkMode 
    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
    : 'text-gray-600 hover:text-black hover:bg-gray-100'
  
  const cardColors = darkMode 
    ? 'bg-black border-gray-700 text-gray-200 shadow-2xl' 
    : 'bg-white border-gray-300 text-gray-800 shadow-xl'
  
  const headingColor = darkMode ? 'text-white' : 'text-black'
  const textColor = darkMode ? 'text-gray-300' : 'text-gray-700'
  const strongColor = darkMode ? 'text-gray-100' : 'text-gray-900'

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-lg transition-all duration-200 ${buttonColors}`}
      >
        <Info size={14} />
        <span className="font-medium">Model Info</span>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Info card */}
          <div className={`absolute bottom-full right-0 mb-3 p-5 rounded-xl border z-20 max-w-sm transform transition-all duration-200 ${cardColors}`}>
            {/* Arrow pointer */}
            <div className={`absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent ${darkMode ? 'border-t-black' : 'border-t-white'}`} />
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className={`w-5 h-5 ${headingColor}`} />
                <h4 className={`font-bold text-base ${headingColor}`}>Sentiment Analysis Model</h4>
              </div>
              
              <p className={`text-sm leading-relaxed ${textColor}`}>
                Uses a machine learning model trained on Amazon product reviews to classify sentiment as Positive, Negative, or Neutral.
              </p>
              
              <div className={`space-y-2 text-sm ${textColor}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${strongColor}`}>Accuracy:</span>
                  <span className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                    ~85%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${strongColor}`}>Training Data:</span>
                  <span className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                    50K+ reviews
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${strongColor}`}>Model Type:</span>
                  <span className={`px-2 py-1 rounded-md font-mono ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                    FastText
                  </span>
                </div>
              </div>
              
              {/* Divider */}
              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
              
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Click anywhere outside to close
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ModelInfoCard