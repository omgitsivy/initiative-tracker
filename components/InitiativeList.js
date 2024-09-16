import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, Lock, Unlock, ChevronUp, Skull } from 'lucide-react';

const NumberInput = ({ value, onChange, label, isDarkMode, isMobile }) => {
  const increment = (amount) => {
    onChange(value + amount);
  };

  const buttonClass = `flex flex-col items-center justify-center ${
    isMobile ? 'py-4 px-2' : 'p-2'
  } ${
    isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
  }`;

  return (
    <div className={`flex flex-col items-center ${isMobile ? 'w-full' : ''}`}>
      <span className="text-sm font-medium mb-2">{label}</span>
      <div className={`flex items-center mb-2 ${isMobile ? 'w-full justify-between' : ''}`}>
        <div className={`flex items-center ${isMobile ? 'w-1/4 justify-start' : ''}`}>
          <button onClick={() => increment(-10)} className={buttonClass}>
            <ChevronLeft size={isMobile ? 36 : 24} />
            <span className={`${isMobile ? 'text-sm' : 'text-xs'} mt-1`}>10</span>
          </button>
        </div>
        <div className={`flex items-center ${isMobile ? 'w-1/4 justify-center' : ''}`}>
          <button onClick={() => increment(-1)} className={buttonClass}>
            <ChevronLeft size={isMobile ? 30 : 20} />
            <span className={`${isMobile ? 'text-sm' : 'text-xs'} mt-1`}>1</span>
          </button>
        </div>
        <div className={`flex items-center justify-center ${isMobile ? 'w-1/4' : ''}`}>
          {isMobile ? (
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{value}</span>
          ) : (
            <input
              type="number"
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className={`w-16 text-center bg-transparent border-b ${isDarkMode ? 'border-gray-600 text-gray-100' : 'border-gray-400 text-gray-800'} focus:outline-none focus:border-purple-500`}
            />
          )}
        </div>
        <div className={`flex items-center ${isMobile ? 'w-1/4 justify-center' : ''}`}>
          <button onClick={() => increment(1)} className={buttonClass}>
            <ChevronRight size={isMobile ? 30 : 20} />
            <span className={`${isMobile ? 'text-sm' : 'text-xs'} mt-1`}>1</span>
          </button>
        </div>
        <div className={`flex items-center ${isMobile ? 'w-1/4 justify-end' : ''}`}>
          <button onClick={() => increment(10)} className={buttonClass}>
            <ChevronRight size={isMobile ? 36 : 24} />
            <span className={`${isMobile ? 'text-sm' : 'text-xs'} mt-1`}>10</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function InitiativeList({ creatures, onUpdateCreature, onRemoveCreature, onToggleLock, onMoveCreature, isRolling, isDarkMode }) {
  const [expandedCreatures, setExpandedCreatures] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const getHealthColor = (currentHp, maxHp) => {
    if (currentHp <= 0) return isDarkMode ? 'rgb(0, 0, 0)' : 'rgb(0, 0, 0)';
    const healthPercentage = (currentHp / maxHp) * 100;
    if (healthPercentage > 66) return isDarkMode ? 'rgba(72, 187, 120, 0.2)' : 'rgba(72, 187, 120, 0.1)';
    if (healthPercentage > 33) return isDarkMode ? 'rgba(236, 201, 75, 0.2)' : 'rgba(236, 201, 75, 0.1)';
    return isDarkMode ? 'rgba(245, 101, 101, 0.2)' : 'rgba(245, 101, 101, 0.1)';
  };

  return (
    <ul className="space-y-4 mt-4">
      <AnimatePresence>
        {creatures.map((creature, index) => {
          const { preview, hasMore, remaining } = getNotePreviews(creature.notes);
          const healthColor = getHealthColor(creature.currentHp, creature.maxHp);
          const isDefeated = creature.currentHp <= 0;
          return (
            <motion.li
              key={creature.id}
              initial={isRolling ? { opacity: 0, x: Math.random() * 100 - 50 } : false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              layout
              className={`p-4 rounded-lg shadow-md ${creature.isLocked ? 'border-2 border-purple-500' : ''} ${isDefeated && !creature.isLocked ? 'opacity-60' : ''}`}
              style={{ 
                backgroundColor: healthColor,
                color: isDefeated ? 'white' : (isDarkMode ? 'white' : 'black')
              }}
            >
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-wrap'} items-center justify-between mb-2`}>
                <div className={`flex items-center ${isMobile ? 'w-full justify-between mb-2' : ''}`}>
                  <div className="flex items-center">
                    {!isMobile && (
                      <div className="flex flex-col mr-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onMoveCreature(creature.id, 'up')}
                          className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}
                          disabled={index === 0 || creature.isLocked}
                        >
                          <ChevronUp size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onMoveCreature(creature.id, 'down')}
                          className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}
                          disabled={index === creatures.length - 1 || creature.isLocked}
                        >
                          <ChevronDown size={20} />
                        </motion.button>
                      </div>
                    )}
                    <span className="font-bold text-lg mr-2">{creature.name}</span>
                    {isDefeated && <Skull size={20} className="text-red-500 mr-2" />}
                  </div>
                  <div className="flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onToggleLock(creature.id)}
                      className={`mr-2 ${creature.isLocked ? 'text-purple-500' : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}
                    >
                      {creature.isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                    </motion.button>
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
                <div className={`flex items-center ${isMobile ? 'w-full justify-center' : 'mt-2 sm:mt-0'}`}>
                  <span className="font-medium">Initiative: {creature.initiative}</span>
                </div>
              </div>
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-wrap'} items-center gap-4 mb-2`}>
                <NumberInput
                  value={creature.maxHp}
                  onChange={(value) => onUpdateCreature(creature.id, 'maxHp', value)}
                  label="Max HP"
                  isDarkMode={isDarkMode || isDefeated}
                  isMobile={isMobile}
                />
                <NumberInput
                  value={creature.currentHp}
                  onChange={(value) => onUpdateCreature(creature.id, 'currentHp', value)}
                  label="Current HP"
                  isDarkMode={isDarkMode || isDefeated}
                  isMobile={isMobile}
                />
                <NumberInput
                  value={creature.tempHp}
                  onChange={(value) => onUpdateCreature(creature.id, 'tempHp', value)}
                  label="Temp HP"
                  isDarkMode={isDarkMode || isDefeated}
                  isMobile={isMobile}
                />
                <NumberInput
                  value={creature.ac}
                  onChange={(value) => onUpdateCreature(creature.id, 'ac', value)}
                  label="AC"
                  isDarkMode={isDarkMode || isDefeated}
                  isMobile={isMobile}
                />
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <motion.button
                    initial={false}
                    animate={{ rotate: expandedCreatures[creature.id] ? 180 : 0 }}
                    onClick={() => toggleExpand(creature.id)}
                    className={isDarkMode ? 'text-gray-300 hover:text-white mr-2' : 'text-gray-700 hover:text-black mr-2'}
                  >
                    <ChevronDown size={20} />
                  </motion.button>
                  <span className="text-sm font-semibold">Notes</span>
                </div>
                <div className="mt-1 text-sm">
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
                      className={`w-full mt-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDarkMode || isDefeated
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-white text-gray-800 border-gray-300'
                      }`}
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