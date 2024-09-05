import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CreatureForm({ onAddCreature }) {
  const [name, setName] = useState('');
  const [hp, setHp] = useState('');
  const [initiativeBonus, setInitiativeBonus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCreature({ name, hp: parseInt(hp), initiativeBonus: parseInt(initiativeBonus) });
    setName('');
    setHp('');
    setInitiativeBonus('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Creature Name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <input
            type="number"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            placeholder="HP"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-2">
          <input
            type="number"
            value={initiativeBonus}
            onChange={(e) => setInitiativeBonus(e.target.value)}
            placeholder="Initiative Bonus"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-lg"
      >
        Add Creature
      </motion.button>
    </form>
  );
}
