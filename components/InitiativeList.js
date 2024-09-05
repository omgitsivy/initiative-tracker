import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Lock, Unlock, ChevronUp } from 'lucide-react';


const NumberInput = ({ value, onChange, label }) => {
  const increment = (amount) => {
    onChange(value + amount);
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-medium mb-1">{label}</span>
      <div className="flex items-center mb-1">
        <div className="flex flex-col items-center mr-2">
          <button onClick={() => increment(-10)} className="text-gray-400 hover:text-gray-200">
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs text-gray-400">-10</span>
        </div>
        <div className="flex flex-col items-center mr-1">
          <button onClick={() => increment(-1)} className="text-gray-400 hover:text-gray-200">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-gray-400">-1</span>
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-16 text-center bg-transparent border-b border-gray-600 focus:outline-none focus:border-purple-500 text-gray-100"
        />
        <div className="flex flex-col items-center ml-1">
          <button onClick={() => increment(1)} className="text-gray-400 hover:text-gray-200">
            <ChevronRight size={16} />
          </button>
          <span className="text-xs text-gray-400">+1</span>
        </div>
        <div className="flex flex-col items-center ml-2">
          <button onClick={() => increment(10)} className="text-gray-400 hover:text-gray-200">
            <ChevronRight size={20} />
          </button>
          <span className="text-xs text-gray-400">+10</span>
        </div>
      </div>
    </div>
  );
};

export default function InitiativeList({ creatures, onUpdateCreature, onRemoveCreature, onToggleLock, onMoveCreature, isRolling }) {
  const [expandedCreatures, setExpandedCreatures] = useState({});

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
    <ul className="space-y-4 mt-4">
      <AnimatePresence>
        {creatures.map((creature, index) => {
          const { preview, hasMore, remaining } = getNotePreviews(creature.notes);
          return (
            <motion.li
              key={creature.id}
              initial={isRolling ? { opacity: 0, x: Math.random() * 100 - 50 } : false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              layout
              className={`bg-gray-700 p-4 rounded-lg shadow-md ${creature.isLocked ? 'border-2 border-purple-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="flex flex-col mr-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onMoveCreature(creature.id, 'up')}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <ChevronUp size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onMoveCreature(creature.id, 'down')}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <ChevronDown size={20} />
                    </motion.button>
                  </div>
                  <span className="font-bold text-lg mr-2">{creature.name}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggleLock(creature.id)}
                    className={`text-gray-400 hover:text-gray-200 ${creature.isLocked ? 'text-purple-500' : ''}`}
                  >
                    {creature.isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                  </motion.button>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 font-medium">Initiative: {creature.initiative}</span>
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
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <NumberInput
                  value={creature.maxHp}
                  onChange={(value) => onUpdateCreature(creature.id, 'maxHp', value)}
                  label="Max HP"
                />
                <NumberInput
                  value={creature.tempHp}
                  onChange={(value) => onUpdateCreature(creature.id, 'tempHp', value)}
                  label="Temp HP"
                />
                <NumberInput
                  value={creature.currentHp}
                  onChange={(value) => onUpdateCreature(creature.id, 'currentHp', value)}
                  label="Current HP"
                />
                <NumberInput
                  value={creature.ac}
                  onChange={(value) => onUpdateCreature(creature.id, 'ac', value)}
                  label="AC"
                />
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <motion.button
                    initial={false}
                    animate={{ rotate: expandedCreatures[creature.id] ? 180 : 0 }}
                    onClick={() => toggleExpand(creature.id)}
                    className="mr-2 text-gray-400 hover:text-gray-200"
                  >
                    <ChevronDown size={20} />
                  </motion.button>
                  <span className="text-sm font-semibold">Notes</span>
                </div>
                <div className="mt-1 text-sm text-gray-300">
                  {preview || "No notes added yet."}
                </div>
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
                      className="w-full mt-2 px-3 py-2 text-gray-200 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={hasMore ? "5" : "3"}
                      placeholder="Add notes here..."
                    />
                  </motion.div>
                )}
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
