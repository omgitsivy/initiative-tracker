import { useState, useEffect } from 'react';
import CreatureForm from '../components/CreatureForm';
import InitiativeList from '../components/InitiativeList';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [creatures, setCreatures] = useState([]);
  const [isRolling, setIsRolling] = useState(false);

  const addCreature = (creature) => {
    setCreatures([...creatures, { ...creature, id: Date.now(), initiative: 0 }]);
  };

  const rollInitiative = () => {
    setIsRolling(true);
    setTimeout(() => {
      setCreatures(creatures.map(creature => ({
        ...creature,
        initiative: Math.floor(Math.random() * 20) + 1 + creature.initiativeBonus
      })));
      setIsRolling(false);
    }, 1000);
  };

  const updateHP = (id, newHP) => {
    setCreatures(creatures.map(creature =>
      creature.id === id ? { ...creature, hp: newHP } : creature
    ));
  };

  const removeCreature = (id) => {
    setCreatures(creatures.filter(creature => creature.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Initiative Tracker</h1>
        <CreatureForm onAddCreature={addCreature} />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={rollInitiative}
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-lg ${isRolling ? 'animate-pulse' : ''}`}
          disabled={isRolling}
        >
          {isRolling ? 'Rolling...' : 'Roll Initiative'}
        </motion.button>
        <InitiativeList creatures={creatures} onUpdateHP={updateHP} onRemoveCreature={removeCreature} />
      </motion.div>
    </div>
  );
}
