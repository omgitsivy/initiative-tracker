import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function InitiativeHistory({ history, isDarkMode, onClearHistory }) {
  return (
    <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Initiative History</h2>
        <button
          onClick={onClearHistory}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}
          title="Clear History"
        >
          <Trash2 size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
        </button>
      </div>
      {history.length === 0 ? (
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No initiative rolls yet.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((entry, index) => (
            <motion.li
              key={entry.timestamp}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-2 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}
            >
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {new Date(entry.timestamp).toLocaleString()}
              </p>
              <ul className="mt-1 space-y-1">
                {entry.order.map((creature, i) => (
                  <li key={i} className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {creature.name}: {creature.initiative}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}