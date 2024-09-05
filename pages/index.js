import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreatureForm from '../components/CreatureForm';
import InitiativeList from '../components/InitiativeList';
import ImportModal from '../components/ImportModal';
import NotificationModal from '../components/NotificationModal';
import InitiativeHistory from '../components/InitiativeHistory';
import { ChevronDown, ChevronUp, Save, Upload, Moon, Sun } from 'lucide-react';
import { encodeState, decodeState } from '../utils/stateManager';

export default function Home() {
  const [creatures, setCreatures] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, message: '' });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [initiativeHistory, setInitiativeHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    // Apply dark mode class to body
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const addCreatures = (creatureData) => {
    const { name, hp, ac, initiativeBonus, amount, notes } = creatureData;
    const newCreatures = Array.from({ length: amount }, (_, index) => ({
      id: Date.now() + index,
      name: `${name}${amount > 1 ? ` ${index + 1}` : ''}`,
      maxHp: parseInt(hp),
      currentHp: parseInt(hp),
      ac: parseInt(ac),
      initiativeBonus: parseInt(initiativeBonus),
      initiative: 0,
      notes: notes,
      isLocked: false
    }));
    setCreatures(prevCreatures => [...prevCreatures, ...newCreatures]);
  };

  const rollInitiative = () => {
    setIsRolling(true);
    const rolledCreatures = creatures.map(creature => ({
      ...creature,
      initiative: creature.isLocked ? creature.initiative : Math.floor(Math.random() * 20) + 1 + creature.initiativeBonus
    }));
    
    setTimeout(() => {
      const sortedCreatures = rolledCreatures.sort((a, b) => {
        // Locked creatures always stay in place
        if (a.isLocked && !b.isLocked) return -1;
        if (!a.isLocked && b.isLocked) return 1;
        
        // Defeated creatures (0 or less HP) go to the bottom
        if (a.currentHp <= 0 && b.currentHp > 0) return 1;
        if (a.currentHp > 0 && b.currentHp <= 0) return -1;
        
        // Sort by initiative for the rest
        return b.initiative - a.initiative;
      });
      setCreatures(sortedCreatures);
      setIsRolling(false);
      
      // Add to initiative history
      setInitiativeHistory(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          order: sortedCreatures.map(c => ({ name: c.name, initiative: c.initiative }))
        }
      ]);
    }, 1000);
  };

  const updateCreature = (id, field, value) => {
    setCreatures(prevCreatures => {
      const updatedCreatures = prevCreatures.map(creature =>
        creature.id === id ? { ...creature, [field]: value } : creature
      );
      
      // Re-sort the creatures if currentHp was updated
      if (field === 'currentHp') {
        return updatedCreatures.sort((a, b) => {
          if (a.isLocked && !b.isLocked) return -1;
          if (!a.isLocked && b.isLocked) return 1;
          if (a.currentHp <= 0 && b.currentHp > 0) return 1;
          if (a.currentHp > 0 && b.currentHp <= 0) return -1;
          return b.initiative - a.initiative;
        });
      }
      
      return updatedCreatures;
    });
  };

  const removeCreature = (id) => {
    setCreatures(creatures.filter(creature => creature.id !== id));
  };

  const toggleLock = (id) => {
    setCreatures(creatures.map(creature =>
      creature.id === id ? { ...creature, isLocked: !creature.isLocked } : creature
    ));
  };

  const moveCreature = (id, direction) => {
    const index = creatures.findIndex(creature => creature.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === creatures.length - 1)) return;
    
    const newCreatures = [...creatures];
    const [movedCreature] = newCreatures.splice(index, 1);
    newCreatures.splice(direction === 'up' ? index - 1 : index + 1, 0, movedCreature);
    setCreatures(newCreatures);
  };

  const saveState = () => {
    const encodedState = encodeState(creatures);
    navigator.clipboard.writeText(encodedState).then(() => {
      setNotification({ isOpen: true, message: 'State Saved to Clipboard' });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setNotification({ isOpen: true, message: 'Failed to save state. Please try again.' });
    });
  };

  const importState = (encodedState) => {
    try {
      const decodedState = decodeState(encodedState);
      setCreatures(decodedState);
      setIsImportModalOpen(false);
      setNotification({ isOpen: true, message: 'State Imported Successfully' });
    } catch (error) {
      setNotification({ isOpen: true, message: 'Invalid state data. Please try again.' });
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-4 md:p-8`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-4xl font-extrabold">Initiative Tracker</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className="mb-4 flex flex-wrap justify-between items-center">
          <button 
            onClick={() => setIsFormVisible(!isFormVisible)}
            className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} mb-2 md:mb-0`}
          >
            {isFormVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            <span className="ml-2">{isFormVisible ? 'Hide' : 'Show'} Add Creature Form</span>
          </button>
          <div className="flex space-x-2">
            <button onClick={saveState} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              <Save size={16} className="mr-2" />
              Save
            </button>
            <button onClick={() => setIsImportModalOpen(true)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <Upload size={16} className="mr-2" />
              Import
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CreatureForm onAddCreatures={addCreatures} isDarkMode={isDarkMode} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={rollInitiative}
          className={`w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-lg ${isRolling ? 'animate-pulse' : ''}`}
          disabled={isRolling}
        >
          {isRolling ? 'Rolling...' : 'Roll Initiative'}
        </motion.button>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
            className={`flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
          >
            {isHistoryVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            <span className="ml-2">Initiative History</span>
          </button>
        </div>

        <AnimatePresence>
          {isHistoryVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InitiativeHistory history={initiativeHistory} isDarkMode={isDarkMode} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          <InitiativeList 
            creatures={creatures} 
            onUpdateCreature={updateCreature} 
            onRemoveCreature={removeCreature}
            onToggleLock={toggleLock}
            onMoveCreature={moveCreature}
            isRolling={isRolling}
            isDarkMode={isDarkMode}
          />
        </AnimatePresence>

        <ImportModal 
          isOpen={isImportModalOpen} 
          onClose={() => setIsImportModalOpen(false)} 
          onImport={importState}
          isDarkMode={isDarkMode}
        />

        <NotificationModal
          isOpen={notification.isOpen}
          onClose={() => setNotification({ ...notification, isOpen: false })}
          message={notification.message}
          isDarkMode={isDarkMode}
        />
      </motion.div>
    </div>
  );
}

