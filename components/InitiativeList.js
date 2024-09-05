import { motion, AnimatePresence } from 'framer-motion';

export default function InitiativeList({ creatures, onUpdateHP, onRemoveCreature }) {
  const sortedCreatures = [...creatures].sort((a, b) => b.initiative - a.initiative);

  return (
    <ul className="mt-8 space-y-4">
      <AnimatePresence>
        {sortedCreatures.map((creature) => (
          <motion.li
            key={creature.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-100 p-4 rounded-lg shadow flex items-center justify-between"
          >
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
                  onChange={(e) => onUpdateHP(creature.id, parseInt(e.target.value))}
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
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
