import { useState, useCallback, useEffect, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import { motion } from 'framer-motion';
import { useStockfish } from '@/hooks/useStockfish';
import { getOpeningForMoves } from '@/data/openings';
import { AnalysisPanel } from './AnalysisPanel';

interface ChessGameProps {
  playerColor: 'white' | 'black';
  onNewGame: () => void;
}

export function ChessGame({ playerColor, onNewGame }: ChessGameProps) {
  const [game, setGame] = useState(new Chess());
  const [analysisDepth, setAnalysisDepth] = useState(15);
  const { bestMove, evaluation, depth, isThinking, analyze } = useStockfish(analysisDepth);
  const [highlightedSquares, setHighlightedSquares] = useState<Record<string, React.CSSProperties>>({});
  const [displayBestMove, setDisplayBestMove] = useState<string | null>(null);

  // Get move history in SAN format
  const moveHistory = useMemo(() => {
    return game.history();
  }, [game.fen()]);

  // Get current opening
  const opening = useMemo(() => {
    return getOpeningForMoves(moveHistory);
  }, [moveHistory]);

  // Current turn
  const currentTurn = game.turn();

  // Analyze position whenever it changes
  useEffect(() => {
    analyze(game.fen(), analysisDepth);
  }, [game.fen(), analysisDepth, analyze]);

  // Convert UCI move (e.g., "e2e4") to SAN (e.g., "e4")
  const uciToSan = useCallback((uciMove: string): string | null => {
    if (!uciMove) return null;
    
    const tempGame = new Chess(game.fen());
    const from = uciMove.slice(0, 2) as Square;
    const to = uciMove.slice(2, 4) as Square;
    const promotion = uciMove.length > 4 ? uciMove.charAt(4) : undefined;

    try {
      const move = tempGame.move({ from, to, promotion });
      return move ? move.san : null;
    } catch {
      return null;
    }
  }, [game.fen()]);

  // Update display best move when engine returns result
  useEffect(() => {
    if (bestMove) {
      const sanMove = uciToSan(bestMove);
      setDisplayBestMove(sanMove);

      // Highlight the suggested move squares
      if (bestMove.length >= 4) {
        const from = bestMove.slice(0, 2);
        const to = bestMove.slice(2, 4);
        setHighlightedSquares({
          [from]: { background: 'radial-gradient(circle, hsl(38, 92%, 50%, 0.4) 25%, transparent 25%)' },
          [to]: { background: 'radial-gradient(circle, hsl(38, 92%, 50%, 0.6) 60%, transparent 60%)' },
        });
      }
    }
  }, [bestMove, uciToSan]);

  // Handle piece drop
  const onDrop = useCallback((sourceSquare: Square, targetSquare: Square): boolean => {
    try {
      const move = game.move({
        from: sourceSquare as Square,
        to: targetSquare as Square,
        promotion: 'q', // Always promote to queen for simplicity
      });

      if (move) {
        setGame(new Chess(game.fen()));
        setHighlightedSquares({});
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, [game]);

  // Reset game
  const handleNewGame = useCallback(() => {
    setGame(new Chess());
    setHighlightedSquares({});
    setDisplayBestMove(null);
    onNewGame();
  }, [onNewGame]);

  // Board orientation
  const boardOrientation = playerColor === 'white' ? 'white' : 'black';

  // Custom square styles
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = { ...highlightedSquares };
    
    // Add last move highlight
    const history = game.history({ verbose: true });
    if (history.length > 0) {
      const lastMove = history[history.length - 1];
      styles[lastMove.from] = {
        ...styles[lastMove.from],
        background: 'hsl(38, 92%, 50%, 0.15)',
      };
      styles[lastMove.to] = {
        ...styles[lastMove.to],
        background: 'hsl(38, 92%, 50%, 0.25)',
      };
    }

    return styles;
  }, [highlightedSquares, game]);

  // Game status
  const gameStatus = useMemo(() => {
    if (game.isCheckmate()) return 'Checkmate!';
    if (game.isStalemate()) return 'Stalemate';
    if (game.isDraw()) return 'Draw';
    if (game.isCheck()) return 'Check!';
    return null;
  }, [game]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            <span className="text-foreground">Chess</span>
            <span className="gold-text ml-2">Advisor</span>
          </h1>
          <p className="text-muted-foreground">
            Playing as <span className="text-primary font-medium capitalize">{playerColor}</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr,380px] gap-8">
          {/* Chess Board */}
          <div className="flex flex-col items-center">
            {/* Game Status */}
            {gameStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-6 py-2 rounded-full bg-primary/20 border border-primary"
              >
                <span className="font-medium gold-text">{gameStatus}</span>
              </motion.div>
            )}

            {/* Board Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="chess-board-container w-full max-w-[600px]"
            >
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                boardOrientation={boardOrientation}
                customSquareStyles={customSquareStyles}
                customBoardStyle={{
                  borderRadius: '12px',
                  boxShadow: '0 20px 60px -15px hsl(220, 30%, 5%, 0.8)',
                }}
                customDarkSquareStyle={{
                  backgroundColor: 'hsl(28, 25%, 45%)',
                }}
                customLightSquareStyle={{
                  backgroundColor: 'hsl(35, 30%, 75%)',
                }}
                arePiecesDraggable={true}
                animationDuration={200}
              />
            </motion.div>

            {/* Turn Indicator (mobile) */}
            <div className="mt-4 lg:hidden flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${currentTurn === 'w' ? 'bg-eval-white' : 'bg-eval-black'}`} />
              <span>{currentTurn === 'w' ? "White's" : "Black's"} turn</span>
            </div>
          </div>

          {/* Analysis Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:h-[680px]"
          >
            <AnalysisPanel
              opening={opening}
              bestMove={displayBestMove}
              evaluation={evaluation}
              depth={depth}
              isThinking={isThinking}
              playerColor={playerColor}
              currentTurn={currentTurn}
              moveHistory={moveHistory}
              onNewGame={handleNewGame}
              analysisDepth={analysisDepth}
              onDepthChange={setAnalysisDepth}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}