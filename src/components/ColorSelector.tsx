import { motion } from 'framer-motion';

interface ColorSelectorProps {
  onSelectColor: (color: 'white' | 'black') => void;
}

export function ColorSelector({ onSelectColor }: ColorSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            <span className="text-foreground">Chess</span>
            <span className="gold-text ml-2">Advisor</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Your real-time chess analysis companion
          </p>
        </motion.div>

        {/* Color Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl text-secondary-foreground mb-8">
            Which color are you playing?
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* White Piece Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectColor('white')}
              className="group relative w-48 h-48 rounded-2xl chess-card border-2 border-border hover:border-primary transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col items-center justify-center h-full relative z-10">
                {/* White King Icon */}
                <div className="text-7xl mb-3 filter drop-shadow-lg transition-transform group-hover:scale-110">
                  ♔
                </div>
                <span className="text-lg font-medium text-foreground">
                  Play as White
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  You move first
                </span>
              </div>

              <motion.div
                className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 group-hover:opacity-100"
                style={{ boxShadow: 'var(--shadow-glow)' }}
              />
            </motion.button>

            {/* Black Piece Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectColor('black')}
              className="group relative w-48 h-48 rounded-2xl chess-card border-2 border-border hover:border-primary transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col items-center justify-center h-full relative z-10">
                {/* Black King Icon */}
                <div className="text-7xl mb-3 filter drop-shadow-lg transition-transform group-hover:scale-110">
                  ♚
                </div>
                <span className="text-lg font-medium text-foreground">
                  Play as Black
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  Opponent moves first
                </span>
              </div>

              <motion.div
                className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 group-hover:opacity-100"
                style={{ boxShadow: 'var(--shadow-glow)' }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-muted-foreground text-sm max-w-md mx-auto"
        >
          Make your moves on the board, and I'll suggest the best response with opening analysis and explanations.
        </motion.p>
      </motion.div>
    </div>
  );
}