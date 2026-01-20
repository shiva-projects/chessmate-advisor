import { useState, useEffect, useCallback, useRef } from 'react';

interface EngineResult {
  bestMove: string | null;
  evaluation: number | null;
  depth: number;
  isThinking: boolean;
  ponderMove: string | null;
  isReady: boolean;
}

// Use lichess stockfish which is battle-tested for browser environments
const STOCKFISH_CDN = 'https://lichess1.org/assets/stockfish/stockfish-nnue-16-single.js';

export function useStockfish(targetDepth: number = 15) {
  const [result, setResult] = useState<EngineResult>({
    bestMove: null,
    evaluation: null,
    depth: 0,
    isThinking: false,
    ponderMove: null,
    isReady: false,
  });
  
  const engineRef = useRef<Worker | null>(null);
  const isReadyRef = useRef(false);
  const currentFenRef = useRef<string | null>(null);

  useEffect(() => {
    let worker: Worker | null = null;
    let mounted = true;
    
    const initEngine = async () => {
      try {
        console.log('[Stockfish] Initializing worker...');
        
        // Create worker from CDN
        worker = new Worker(STOCKFISH_CDN);
        engineRef.current = worker;

        worker.onmessage = (event: MessageEvent) => {
          if (!mounted) return;
          
          const message = event.data;
          if (typeof message !== 'string') return;

          console.log('[Stockfish]', message);

          // Engine initialized
          if (message === 'uciok') {
            console.log('[Stockfish] UCI OK - sending isready');
            worker?.postMessage('setoption name MultiPV value 1');
            worker?.postMessage('isready');
          }

          // Engine ready to accept commands
          if (message === 'readyok') {
            console.log('[Stockfish] Ready OK - engine is ready');
            isReadyRef.current = true;
            setResult(prev => ({ ...prev, isReady: true }));
            
            // If there's a pending position to analyze
            if (currentFenRef.current) {
              const fen = currentFenRef.current;
              console.log('[Stockfish] Analyzing pending position:', fen);
              worker?.postMessage(`position fen ${fen}`);
              worker?.postMessage(`go depth ${targetDepth}`);
            }
          }

          // Parse info lines for evaluation and depth
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

            console.log('[Stockfish] Best move:', bestMove);

            setResult(prev => ({
              ...prev,
              bestMove: bestMove === '(none)' ? null : bestMove,
              ponderMove,
              isThinking: false,
            }));
          }
        };

        worker.onerror = (error) => {
          console.error('[Stockfish] Worker error:', error);
        };

        // Start UCI protocol
        console.log('[Stockfish] Sending uci command');
        worker.postMessage('uci');

      } catch (error) {
        console.error('[Stockfish] Failed to initialize:', error);
      }
    };

    initEngine();

    return () => {
      mounted = false;
      if (worker) {
        console.log('[Stockfish] Terminating worker');
        worker.terminate();
      }
    };
  }, [targetDepth]);

  const analyze = useCallback((fen: string, searchDepth?: number) => {
    const depth = searchDepth ?? targetDepth;
    currentFenRef.current = fen;
    
    console.log('[Stockfish] analyze() called', { fen, depth, isReady: isReadyRef.current });

    if (!engineRef.current) {
      console.log('[Stockfish] No engine ref');
      return;
    }

    setResult(prev => {
      if (prev.isThinking) return prev;
      return { ...prev, isThinking: true, bestMove: null, depth: 0 };
    });

    if (!isReadyRef.current) {
      console.log('[Stockfish] Engine not ready yet, will analyze when ready');
      return;
    }

    const worker = engineRef.current;
    console.log('[Stockfish] Sending position and go commands');
    worker.postMessage('stop');
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);
  }, [targetDepth]);

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
