import { useState, useEffect, useCallback, useRef } from 'react';

interface EngineResult {
  bestMove: string | null;
  evaluation: number | null;
  depth: number;
  isThinking: boolean;
  ponderMove: string | null;
}

export function useStockfish(depth: number = 15) {
  const [result, setResult] = useState<EngineResult>({
    bestMove: null,
    evaluation: null,
    depth: 0,
    isThinking: false,
    ponderMove: null,
  });
  
  const engineRef = useRef<Worker | null>(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    // Initialize Stockfish worker
    const worker = new Worker('/stockfish.js');
    engineRef.current = worker;

    worker.onmessage = (event: MessageEvent) => {
      const message = event.data;
      
      if (typeof message !== 'string') return;

      // Check if engine is ready
      if (message === 'uciok') {
        isReadyRef.current = true;
        worker.postMessage('isready');
      }

      if (message === 'readyok') {
        isReadyRef.current = true;
      }

      // Parse info lines for evaluation
      if (message.startsWith('info depth')) {
        const depthMatch = message.match(/depth (\d+)/);
        const scoreMatch = message.match(/score (cp|mate) (-?\d+)/);
        
        if (depthMatch && scoreMatch) {
          const currentDepth = parseInt(depthMatch[1], 10);
          const scoreType = scoreMatch[1];
          const scoreValue = parseInt(scoreMatch[2], 10);
          
          let evaluation: number;
          if (scoreType === 'mate') {
            // Mate score: positive means white mates, negative means black mates
            evaluation = scoreValue > 0 ? 100 : -100;
          } else {
            // Centipawn score converted to pawns
            evaluation = scoreValue / 100;
          }

          setResult(prev => ({
            ...prev,
            evaluation,
            depth: currentDepth,
          }));
        }
      }

      // Parse bestmove
      if (message.startsWith('bestmove')) {
        const parts = message.split(' ');
        const bestMove = parts[1] || null;
        const ponderMove = parts[3] || null;

        setResult(prev => ({
          ...prev,
          bestMove,
          ponderMove,
          isThinking: false,
        }));
      }
    };

    worker.onerror = (error) => {
      console.error('Stockfish worker error:', error);
    };

    // Initialize UCI protocol
    worker.postMessage('uci');

    return () => {
      worker.terminate();
    };
  }, []);

  const analyze = useCallback((fen: string, searchDepth?: number) => {
    if (!engineRef.current || !isReadyRef.current) {
      // If not ready, wait a bit and retry
      setTimeout(() => analyze(fen, searchDepth), 100);
      return;
    }

    setResult(prev => ({
      ...prev,
      isThinking: true,
      bestMove: null,
    }));

    const worker = engineRef.current;
    worker.postMessage('stop');
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${searchDepth || depth}`);
  }, [depth]);

  const stop = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.postMessage('stop');
      setResult(prev => ({ ...prev, isThinking: false }));
    }
  }, []);

  return {
    ...result,
    analyze,
    stop,
  };
}