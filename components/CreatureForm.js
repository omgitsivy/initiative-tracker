import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CreatureForm({ onAddCreatures }) {
  const [name, setName] = useState('');
  const [hp, setHp] = useState('');
  const [ac, setAc] = useState('');
  const [initiativeBonus, setInitiativeBonus] = useState('');
  const [amount, setAmount] = useState(1);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCreatures({ name, hp, ac, initiativeBonus, amount, notes });
    setName('');
    setHp('');
    setAc('');
    setInitiativeBonus('');
    setAmount(1);
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/5 px-2 mb-4 md:mb-0">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Creature Name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="w-full md:w-1/5 px-2 mb-4 md:mb-0">
          <input
            type="number"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            placeholder="HP"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="w-full md:w-1/5 px-2 mb-4 md:mb-0">
          <input
            type="number"
            value={ac}
            onChange={(e) => setAc(e.target.value)}
            placeholder="AC"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="w-full md:w-1/5 px-2 mb-4 md:mb-0">
          <input
            type="number"
            value={initiativeBonus}
            onChange={(e) => setInitiativeBonus(e.target.value)}
            placeholder="Initiative Bonus"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="w-full md:w-1/5 px-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value)))}
            placeholder="Amount"
            min="1"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-lg"
      >
        Add Creature{amount > 1 ? 's' : ''}
      </motion.button>
    </form>
  );
}
