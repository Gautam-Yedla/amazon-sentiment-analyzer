// import { useState } from 'react'
// import Papa from 'papaparse'
// import { Upload, Download } from 'lucide-react'

// function BulkUploader({ darkMode }) {
//   const [file, setFile] = useState(null)
//   const [results, setResults] = useState([])
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

//   const handleFileUpload = (event) => {
//     const uploadedFile = event.target.files[0]
//     if (uploadedFile && uploadedFile.name.endsWith('.csv')) {
//       setFile(uploadedFile)
//       setResults([])
//     }
//   }

//   const processCSV = async () => {
//     if (!file) return
//     setIsProcessing(true)
//     setProgress(0)
//     Papa.parse(file, {
//       header: true,
//       complete: async (results) => {
//         const reviews = results.data.filter(row => row.Review && row.Review.trim())
//         const processedResults = []
//         for (let i = 0; i < reviews.length; i++) {
//           try {
//             const response = await fetch(`${API_BASE_URL}/predict`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ text: reviews[i].Review })
//             })
//             const data = await response.json()
//             processedResults.push({
//               ...reviews[i],
//               Sentiment: data.prediction,
//               Confidence: (data.confidence * 100).toFixed(1) + '%'
//             })
//           } catch (error) {
//             console.error('Error processing review:', error)
//             processedResults.push({
//               ...reviews[i],
//               Sentiment: 'Error',
//               Confidence: '0%'
//             })
//           }
//           setProgress(((i + 1) / reviews.length) * 100)
//         }
//         setResults(processedResults)
//         setIsProcessing(false)
//       }
//     })
//   }

//   const downloadResults = () => {
//     const csv = Papa.unparse(results)
//     const blob = new Blob([csv], { type: 'text/csv' })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = 'sentiment_analysis_results.csv'
//     a.click()
//     window.URL.revokeObjectURL(url)
//   }

//   return (
//     <div className="space-y-8">
//       <div className={`rounded-2xl shadow-xl border p-8 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}> 
//         <div className="text-center mb-8">
//           <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Bulk Review Analysis</h2>
//           <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload a CSV file with a "Review" column to analyze multiple reviews at once</p>
//         </div>
//         <div className="space-y-6">
//           {/* File Upload */}
//           <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${darkMode ? 'border-gray-700 hover:border-gray-500' : 'border-gray-200 hover:border-gray-400'}`}> 
//             <Upload className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
//             <div className="space-y-2">
//               <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Choose CSV file</p>
//               <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>File should contain a "Review" column</p>
//               <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
//               <label htmlFor="csv-upload" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-all duration-200">Select File</label>
//             </div>
//           </div>
//           {/* File Info and Process Button */}
//           {file && (
//             <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}> 
//               <div className="flex items-center space-x-2">
//                 <span className="text-2xl">📄</span>
//                 <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{file.name}</span>
//               </div>
//               <button onClick={processCSV} disabled={isProcessing} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50">{isProcessing ? 'Processing...' : 'Analyze Reviews'}</button>
//             </div>
//           )}
//           {/* Progress Bar */}
//           {isProcessing && (
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Processing reviews...</span>
//                 <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{progress.toFixed(0)}%</span>
//               </div>
//               <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
//                 <div className="h-2 rounded-full bg-gray-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Results Table */}
//       {results.length > 0 && (
//         <div className={`rounded-xl shadow-lg border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}> 
//           <div className="p-6 border-b dark:border-gray-800 flex justify-between items-center">
//             <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Analysis Results</h3>
//             <button onClick={downloadResults} className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200">
//               <Download size={16} />
//               <span>Download CSV</span>
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Review</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sentiment</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Confidence</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y dark:divide-gray-800">
//                 {results.slice(0, 10).map((result, index) => (
//                   <tr key={index} className={darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}>
//                     <td className="px-6 py-4 text-sm max-w-xs truncate">{result.Review}</td>
//                     <td className="px-6 py-4 text-sm">
//                       <span className={`inline-block px-2 py-1 rounded text-white text-xs ${
//                         result.Sentiment === 'Positive' ? 'bg-gray-700' :
//                         result.Sentiment === 'Negative' ? 'bg-gray-700' :
//                         result.Sentiment === 'Neutral' ? 'bg-gray-700' : 'bg-gray-500'
//                       }`}>{result.Sentiment}</span>
//                     </td>
//                     <td className="px-6 py-4 text-sm">{result.Confidence}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {results.length > 10 && (
//             <div className="p-4 text-center text-sm text-gray-500">Showing first 10 results. Download CSV for complete data.</div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default BulkUploader 













import { useState } from 'react'
import Papa from 'papaparse'
import { Upload, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react'

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
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h2 className={`text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
          Bulk Review Analysis
        </h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Upload a CSV file with a "Review" column to analyze multiple reviews simultaneously
        </p>
      </div>

      {/* Upload Section */}
      <div className={`rounded-xl border p-8 ${
        darkMode 
          ? 'bg-black border-white/20' 
          : 'bg-white border-black/20'
      }`}>
        
        {/* File Upload Area */}
        <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          darkMode 
            ? 'border-white/30 hover:border-white/50 hover:bg-white/5' 
            : 'border-black/30 hover:border-black/50 hover:bg-black/5'
        }`}>
          <div className={`inline-flex p-4 rounded-full mb-6 ${
            darkMode ? 'bg-white/10' : 'bg-black/10'
          }`}>
            <Upload className={`${darkMode ? 'text-white' : 'text-black'}`} size={32} />
          </div>
          
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              Choose CSV File
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              File should contain a "Review" column with text data to analyze
            </p>
            
            <div className="space-y-3">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="hidden" 
                id="csv-upload" 
              />
              <label 
                htmlFor="csv-upload" 
                className={`inline-block px-8 py-3 font-medium rounded-lg cursor-pointer transition-all duration-200 border ${
                  darkMode 
                    ? 'bg-white text-black border-white hover:bg-gray-100' 
                    : 'bg-black text-white border-black hover:bg-gray-800'
                }`}
              >
                Select File
              </label>
              
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Supported format: .csv files only
              </div>
            </div>
          </div>
        </div>

        {/* File Info */}
        {file && (
          <div className={`mt-6 p-6 rounded-lg border ${
            darkMode 
              ? 'bg-white/5 border-white/20' 
              : 'bg-black/5 border-black/20'
          }`}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  darkMode ? 'bg-white/10' : 'bg-black/10'
                }`}>
                  <FileText className={`${darkMode ? 'text-white' : 'text-black'}`} size={20} />
                </div>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                    {file.name}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              
              <button 
                onClick={processCSV} 
                disabled={isProcessing} 
                className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode 
                    ? 'bg-white text-black border-white hover:bg-gray-100 disabled:hover:bg-white' 
                    : 'bg-black text-white border-black hover:bg-gray-800 disabled:hover:bg-black'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Analyze Reviews'}
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isProcessing && (
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Processing reviews...
              </span>
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className={`w-full rounded-full h-3 ${
              darkMode ? 'bg-white/20' : 'bg-black/20'
            }`}>
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  darkMode ? 'bg-white' : 'bg-black'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className={`rounded-xl border ${
          darkMode 
            ? 'bg-black border-white/20' 
            : 'bg-white border-black/20'
        }`}>
          {/* Results Header */}
          <div className={`p-6 border-b flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ${
            darkMode ? 'border-white/20' : 'border-black/20'
          }`}>
            <div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                Analysis Results
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {results.length} reviews processed successfully
              </p>
            </div>
            
            <button 
              onClick={downloadResults} 
              className={`flex items-center space-x-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 border ${
                darkMode 
                  ? 'bg-white text-black border-white hover:bg-gray-100' 
                  : 'bg-black text-white border-black hover:bg-gray-800'
              }`}
            >
              <Download size={16} />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                darkMode ? 'bg-white/5' : 'bg-black/5'
              }`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Review Text
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Sentiment
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                darkMode ? 'divide-white/20' : 'divide-black/20'
              }`}>
                {results.slice(0, 10).map((result, index) => (
                  <tr 
                    key={index} 
                    className={`transition-colors duration-200 ${
                      darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'
                    }`}
                  >
                    <td className={`px-6 py-4 text-sm max-w-xs ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="truncate" title={result.Review}>
                        {result.Review}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        result.Sentiment === 'Positive' 
                          ? darkMode 
                            ? 'bg-white/10 text-white border-white/30' 
                            : 'bg-black/10 text-black border-black/30'
                          : result.Sentiment === 'Negative' 
                            ? darkMode 
                              ? 'bg-white/10 text-white border-white/30' 
                              : 'bg-black/10 text-black border-black/30'
                            : result.Sentiment === 'Neutral'
                              ? darkMode 
                                ? 'bg-white/10 text-white border-white/30' 
                                : 'bg-black/10 text-black border-black/30'
                              : darkMode 
                                ? 'bg-red-900/20 text-red-300 border-red-700/30' 
                                : 'bg-red-100 text-red-700 border-red-300'
                      }`}>
                        {result.Sentiment === 'Error' ? (
                          <AlertCircle size={12} className="mr-1" />
                        ) : (
                          <CheckCircle size={12} className="mr-1" />
                        )}
                        {result.Sentiment}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-black'
                    }`}>
                      {result.Confidence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {results.length > 10 && (
            <div className={`p-4 text-center border-t ${
              darkMode ? 'border-white/20 text-gray-400' : 'border-black/20 text-gray-600'
            }`}>
              <p className="text-sm">
                Showing first 10 of {results.length} results. 
                <span className="font-medium"> Download CSV for complete data.</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!file && (
        <div className={`p-6 rounded-xl border ${
          darkMode 
            ? 'bg-white/5 border-white/20' 
            : 'bg-black/5 border-black/20'
        }`}>
          <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
            CSV Format Requirements:
          </h4>
          <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <li>• File must contain a column named "Review" with text data</li>
            <li>• Each row should represent one review to analyze</li>
            <li>• Maximum recommended file size: 10MB</li>
            <li>• Results will include sentiment classification and confidence scores</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default BulkUploader