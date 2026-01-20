import { useState } from 'react';
import { ColorSelector } from '@/components/ColorSelector';
import { ChessGame } from '@/components/ChessGame';
import { AnimatePresence, motion } from 'framer-motion';

type GameState = 'selection' | 'playing';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('selection');
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');

  const handleColorSelect = (color: 'white' | 'black') => {
    setPlayerColor(color);
    setGameState('playing');
  };

  const handleNewGame = () => {
    setGameState('selection');
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {gameState === 'selection' ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ColorSelector onSelectColor={handleColorSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChessGame playerColor={playerColor} onNewGame={handleNewGame} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;