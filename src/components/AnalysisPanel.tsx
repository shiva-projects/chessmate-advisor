import { motion } from 'framer-motion';
import { Opening } from '@/data/openings';
import { ArrowRight, BookOpen, TrendingUp, Lightbulb, RotateCcw, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface AnalysisPanelProps {
  opening: Opening;
  bestMove: string | null;
  evaluation: number | null;
  depth: number;
  isThinking: boolean;
  playerColor: 'white' | 'black';
  currentTurn: 'w' | 'b';
  moveHistory: string[];
  onNewGame: () => void;
  analysisDepth: number;
  onDepthChange: (depth: number) => void;
}

export function AnalysisPanel({
  opening,
  bestMove,
  evaluation,
  depth,
  isThinking,
  playerColor,
  currentTurn,
  moveHistory,
  onNewGame,
  analysisDepth,
  onDepthChange,
}: AnalysisPanelProps) {
  const isPlayerTurn = (playerColor === 'white' && currentTurn === 'w') ||
                        (playerColor === 'black' && currentTurn === 'b');

  // Format evaluation
  const formatEval = (eval_: number | null): string => {
    if (eval_ === null) return '—';
    if (eval_ >= 100) return 'M+';
    if (eval_ <= -100) return 'M-';
    const sign = eval_ > 0 ? '+' : '';
    return `${sign}${eval_.toFixed(2)}`;
  };

  // Get evaluation bar percentage (0-100, 50 = equal)
  const getEvalBarPercent = (eval_: number | null): number => {
    if (eval_ === null) return 50;
    // Clamp to reasonable range and convert
    const clamped = Math.max(-5, Math.min(5, eval_));
    return 50 + (clamped * 10);
  };

  // Generate move explanation
  const getMoveExplanation = (move: string | null, opening: Opening, isPlayerTurn: boolean): string => {
    if (!move) return isPlayerTurn ? 'Analyzing position...' : "Waiting for opponent's move";
    
    // Basic explanations based on move patterns
    const piece = move.charAt(0).toUpperCase();
    const explanations: Record<string, string[]> = {
      'N': [
        'Develops the knight to an active square',
        'Knight moves toward the center',
        'Improves piece activity',
      ],
      'B': [
        'Develops the bishop to a strong diagonal',
        'Controls important squares',
        'Prepares for castling',
      ],
      'R': [
        'Activates the rook on an open file',
        'Doubles rooks or improves positioning',
        'Controls the open file',
      ],
      'Q': [
        'Activates the queen strategically',
        'Creates threats while staying safe',
        'Improves queen positioning',
      ],
      'K': [
        'Improves king safety',
        'King moves to a safer square',
        'Activates the king in the endgame',
      ],
      'O': [
        'Castling protects the king and activates the rook',
        'Essential for king safety',
        'Connects the rooks',
      ],
    };

    // Check for castling
    if (move.includes('O') || move === 'e1g1' || move === 'e1c1' || move === 'e8g8' || move === 'e8c8') {
      return explanations['O'][Math.floor(Math.random() * explanations['O'].length)];
    }

    // Check for piece move
    if (explanations[piece]) {
      return explanations[piece][Math.floor(Math.random() * explanations[piece].length)];
    }

    // Pawn moves
    const pawnExplanations = [
      'Controls the center and creates space',
      'Advances pawns for better position',
      'Opens lines for pieces',
      'Gains space in the center',
      'Fights for central control',
    ];
    return pawnExplanations[Math.floor(Math.random() * pawnExplanations.length)];
  };

  const evalBarPercent = getEvalBarPercent(evaluation);

  return (
    <div className="chess-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isPlayerTurn ? 'bg-success animate-pulse' : 'bg-muted'}`} />
          <span className="text-sm font-medium">
            {isPlayerTurn ? 'Your turn' : "Opponent's turn"}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNewGame}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </Button>
      </div>

      {/* Evaluation Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Evaluation</span>
          <motion.span 
            key={evaluation}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-lg font-mono font-bold gold-text"
          >
            {formatEval(evaluation)}
          </motion.span>
        </div>
        <div className="relative h-4 bg-eval-black rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-eval-white rounded-full"
            initial={{ width: '50%' }}
            animate={{ width: `${evalBarPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-primary/50 -translate-x-1/2" />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Black</span>
          <span className="text-xs text-muted-foreground">White</span>
        </div>
      </div>

      {/* Best Move Suggestion */}
      <motion.div 
        className={`rounded-xl p-5 mb-6 border-2 transition-all duration-300 ${
          isPlayerTurn 
            ? 'border-primary bg-primary/10' 
            : 'border-border bg-secondary/30'
        }`}
        animate={isPlayerTurn ? { boxShadow: 'var(--shadow-glow)' } : {}}
      >
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Best Move</span>
          {isThinking && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full ml-auto"
            />
          )}
        </div>
        <motion.div
          key={bestMove}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-mono font-bold text-foreground mb-2"
        >
          {bestMove || '—'}
        </motion.div>
        <p className="text-sm text-muted-foreground">
          {getMoveExplanation(bestMove, opening, isPlayerTurn)}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          <span>Depth: {depth}</span>
        </div>
      </motion.div>

      {/* Opening Info */}
      <div className="rounded-xl bg-secondary/30 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Opening</span>
        </div>
        <motion.h3
          key={opening.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-serif font-semibold text-foreground mb-1"
        >
          {opening.name}
        </motion.h3>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
            {opening.eco}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {opening.description}
        </p>
      </div>

      {/* Move History */}
      <div className="flex-1 overflow-hidden mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Move History</span>
        </div>
        <div className="bg-secondary/30 rounded-xl p-3 max-h-32 overflow-y-auto">
          {moveHistory.length === 0 ? (
            <span className="text-sm text-muted-foreground italic">No moves yet</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {moveHistory.map((move, index) => (
                <span 
                  key={index}
                  className={`text-sm font-mono px-2 py-0.5 rounded ${
                    index % 2 === 0 ? 'bg-background' : 'bg-secondary'
                  }`}
                >
                  {index % 2 === 0 && <span className="text-muted-foreground mr-1">{Math.floor(index / 2) + 1}.</span>}
                  {move}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analysis Depth Control */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Analysis Depth: {analysisDepth}</span>
        </div>
        <Slider
          value={[analysisDepth]}
          onValueChange={([value]) => onDepthChange(value)}
          min={10}
          max={20}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Fast (10)</span>
          <span>Deep (20)</span>
        </div>
      </div>
    </div>
  );
}