import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function InitiativeList({ creatures, onUpdateCreature, onRemoveCreature }) {
  const [expandedCreatures, setExpandedCreatures] = useState({});

  const sortedCreatures = [...creatures].sort((a, b) => b.initiative - a.initiative);

  const toggleExpand = (id) => {
    setExpandedCreatures(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getNotePreviews = (notes) => {
    const lines = notes.split('\n');
    return {
      preview: lines.slice(0, 2).join('\n'),
      hasMore: lines.length > 2,
      remaining: lines.slice(2).join('\n')
    };
  };

  return (
    <ul className="mt-8 space-y-4">
      <AnimatePresence>
        {sortedCreatures.map((creature) => {
          const { preview, hasMore, remaining } = getNotePreviews(creature.notes);
          return (
            <motion.li
              key={creature.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-100 p-4 rounded-lg shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="font-bold text-lg">{creature.name}</span>
                  <div className="text-sm text-gray-600">Initiative: {creature.initiative}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="mr-2">HP:</span>
                    <input
                      type="number"
                      value={creature.hp}
                      onChange={(e) => onUpdateCreature(creature.id, 'hp', parseInt(e.target.value))}
                      className="w-16 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">AC:</span>
                    <input
                      type="number"
                      value={creature.ac}
                      onChange={(e) => onUpdateCreature(creature.id, 'ac', parseInt(e.target.value))}
                      className="w-16 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemoveCreature(creature.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <motion.button
                    initial={false}
                    animate={{ rotate: expandedCreatures[creature.id] ? 180 : 0 }}
                    onClick={() => toggleExpand(creature.id)}
                    className="mr-2 text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDown size={20} />
                  </motion.button>
                  <span className="text-sm font-semibold">Notes</span>
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  {preview || "No notes added yet."}
                </div>
                <AnimatePresence>
                  {expandedCreatures[creature.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <textarea
                        value={creature.notes}
                        onChange={(e) => onUpdateCreature(creature.id, 'notes', e.target.value)}
                        className="w-full mt-2 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={hasMore ? "5" : "3"}
                        placeholder="Add notes here..."
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}