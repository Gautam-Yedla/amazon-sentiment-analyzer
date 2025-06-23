import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function StatsPanel({ darkMode }) {
  const [stats, setStats] = useState({
    totalReviews: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    averageConfidence: 0
  })

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || '/api'}/stats`)
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error('Failed to fetch stats:', err))
  }, [])


  // Black and white color scheme for charts
  const pieData = [
    { 
      name: 'Positive', 
      value: stats.positive, 
      color: darkMode ? '#ffffff' : '#000000' 
    },
    { 
      name: 'Negative', 
      value: stats.negative, 
      color: darkMode ? '#6b7280' : '#374151' 
    },
    { 
      name: 'Neutral', 
      value: stats.neutral, 
      color: darkMode ? '#374151' : '#9ca3af' 
    }
  ]

  const barData = [
    { name: 'Confidence %', value: (stats.averageConfidence * 100).toFixed(1) }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h2 className={`text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>
          Analytics Dashboard
        </h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Comprehensive insights from your sentiment analysis history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Reviews', 
            value: stats.totalReviews, 
            icon: '📊',
            description: 'Reviews analyzed'
          },
          { 
            label: 'Positive Reviews', 
            value: stats.positive, 
            icon: '😊',
            description: `${stats.totalReviews > 0 ? ((stats.positive / stats.totalReviews) * 100).toFixed(1) : 0}% of total`
          },
          { 
            label: 'Negative Reviews', 
            value: stats.negative, 
            icon: '😞',
            description: `${stats.totalReviews > 0 ? ((stats.negative / stats.totalReviews) * 100).toFixed(1) : 0}% of total`
          },
          { 
            label: 'Neutral Reviews', 
            value: stats.neutral, 
            icon: '😐',
            description: `${stats.totalReviews > 0 ? ((stats.neutral / stats.totalReviews) * 100).toFixed(1) : 0}% of total`
          }
        ].map((stat, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
              darkMode 
                ? 'bg-black border-white/20 hover:border-white/40' 
                : 'bg-white border-black/20 hover:border-black/40'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className={`text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`text-3xl p-2 rounded-lg ${
                darkMode ? 'bg-white/10' : 'bg-black/10'
              }`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className={`p-8 rounded-xl border ${
          darkMode 
            ? 'bg-black border-white/20' 
            : 'bg-white border-black/20'
        }`}>
          <div className="mb-6">
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
              Sentiment Distribution
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Breakdown of sentiment categories
            </p>
          </div>
          
          {stats.totalReviews > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={12}
                  fill={darkMode ? '#ffffff' : '#000000'}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={darkMode ? '#000000' : '#ffffff'} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#000000' : '#ffffff', 
                    borderColor: darkMode ? '#ffffff' : '#000000',
                    color: darkMode ? '#ffffff' : '#000000',
                    border: `2px solid ${darkMode ? '#ffffff' : '#000000'}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={`flex items-center justify-center h-80 ${
              darkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <p>No data available</p>
                <p className="text-sm mt-2">Analyze some reviews to see the distribution</p>
              </div>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className={`p-8 rounded-xl border ${
          darkMode 
            ? 'bg-black border-white/20' 
            : 'bg-white border-black/20'
        }`}>
          <div className="mb-6">
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
              Confidence Level
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Average prediction confidence score
            </p>
          </div>

          {stats.totalReviews > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? '#374151' : '#e5e7eb'} 
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: darkMode ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: darkMode ? '#9ca3af' : '#6b7280' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#000000' : '#ffffff', 
                    borderColor: darkMode ? '#ffffff' : '#000000',
                    color: darkMode ? '#ffffff' : '#000000',
                    border: `2px solid ${darkMode ? '#ffffff' : '#000000'}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  formatter={(value) => [`${value}%`, 'Confidence']}
                />
                <Bar 
                  dataKey="value" 
                  fill={darkMode ? '#ffffff' : '#000000'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={`flex items-center justify-center h-80 ${
              darkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <p>No confidence data available</p>
                <p className="text-sm mt-2">Analyze some reviews to see confidence metrics</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {stats.totalReviews > 0 && (
        <div className={`p-6 rounded-xl border ${
          darkMode 
            ? 'bg-black border-white/20' 
            : 'bg-white border-black/20'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Summary Insights
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Most Common Sentiment
              </p>
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                {stats.positive >= stats.negative && stats.positive >= stats.neutral ? 'Positive' :
                 stats.negative >= stats.neutral ? 'Negative' : 'Neutral'}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Confidence Level
              </p>
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                {stats.averageConfidence >= 0.8 ? 'High' : 
                 stats.averageConfidence >= 0.6 ? 'Medium' : 'Low'}
                {' '}({(stats.averageConfidence * 100).toFixed(1)}%)
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Analysis Quality
              </p>
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                {stats.totalReviews >= 50 ? 'Comprehensive' :
                 stats.totalReviews >= 20 ? 'Good' : 
                 stats.totalReviews >= 5 ? 'Moderate' : 'Limited'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsPanel