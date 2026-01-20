import { useState, useEffect, useCallback, useRef } from 'react';

interface EngineResult {
  bestMove: string | null;
  evaluation: number | null;
  depth: number;
  isThinking: boolean;
  ponderMove: string | null;
}

// Use stockfish.js (older, more compatible version)
const STOCKFISH_URL = 'https://unpkg.com/stockfish.js@10.0.2/stockfish.js';

export function useStockfish(targetDepth: number = 15) {
  const [result, setResult] = useState<EngineResult>({
    bestMove: null,
    evaluation: null,
    depth: 0,
    isThinking: false,
    ponderMove: null,
  });
  
  const engineRef = useRef<Worker | null>(null);
  const isReadyRef = useRef(false);
  const pendingAnalysisRef = useRef<{ fen: string; depth: number } | null>(null);

  useEffect(() => {
    let worker: Worker;
    
    try {
      // Create worker from CDN URL
      worker = new Worker(STOCKFISH_URL);
      engineRef.current = worker;

      worker.onmessage = (event: MessageEvent) => {
        const message = event.data;
        
        if (typeof message !== 'string') return;

        // Check if engine is ready
        if (message === 'uciok') {
          worker.postMessage('isready');
        }

        if (message === 'readyok') {
          isReadyRef.current = true;
          // Process any pending analysis
          if (pendingAnalysisRef.current) {
            const { fen, depth } = pendingAnalysisRef.current;
            pendingAnalysisRef.current = null;
            worker.postMessage(`position fen ${fen}`);
            worker.postMessage(`go depth ${depth}`);
          }
        }

        // Parse info lines for evaluation
        if (message.startsWith('info') && message.includes('depth') && message.includes('score')) {
          const depthMatch = message.match(/depth (\d+)/);
          const scoreMatch = message.match(/score (cp|mate) (-?\d+)/);
          
          if (depthMatch && scoreMatch) {
            const currentDepth = parseInt(depthMatch[1], 10);
            const scoreType = scoreMatch[1];
            const scoreValue = parseInt(scoreMatch[2], 10);
            
            let evaluation: number;
            if (scoreType === 'mate') {
              evaluation = scoreValue > 0 ? 100 : -100;
            } else {
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
            bestMove: bestMove === '(none)' ? null : bestMove,
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

    } catch (error) {
      console.error('Failed to initialize Stockfish:', error);
    }

    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, []);

  const analyze = useCallback((fen: string, searchDepth?: number) => {
    const depth = searchDepth ?? targetDepth;
    
    if (!engineRef.current) {
      return;
    }

    setResult(prev => {
      if (prev.isThinking) return prev; // Prevent unnecessary re-renders
      return { ...prev, isThinking: true };
    });

    if (!isReadyRef.current) {
      // Queue the analysis for when engine is ready
      pendingAnalysisRef.current = { fen, depth };
      return;
    }

    const worker = engineRef.current;
    worker.postMessage('stop');
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);
  }, []);

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