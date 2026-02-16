import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, Horse, Mountain, Yuanbao, Particle } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, CONFIG, COLORS, YUANBAO_VALUE } from '../constants';
import RedPocketModal from './RedPocketModal';
import { drawHorse, drawMountain, drawYuanbao, drawGround, drawClouds, drawParticle } from '../utils/drawUtils';
import { loadGameAssets, GameImages } from '../assets';

const SpringRunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // Store loaded images
  const imagesRef = useRef<GameImages | null>(null);

  // Constants for Horse Dimensions
  const HORSE_SIZE = 90; // Increased size (Much bigger)
  const HITBOX_PADDING = 20; // More generous padding for the larger irregular shape

  // Mutable game state references for the game loop to avoid closure staleness
  const stateRef = useRef({
    horse: { 
      x: 50, 
      y: 0, 
      w: HORSE_SIZE, 
      h: HORSE_SIZE, 
      vy: 0, 
      isJumping: false, 
      frameCount: 0 
    } as Horse,
    mountains: [] as Mountain[],
    yuanbaos: [] as Yuanbao[],
    particles: [] as Particle[],
    gameSpeed: CONFIG.baseSpeed,
    score: 0,
    frame: 0,
    isRunning: false,
  });

  // Load Assets on Mount
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const loadedImages = await loadGameAssets();
        imagesRef.current = loadedImages;
        setAssetsLoaded(true);
      } catch (e) {
        console.error("Failed to load game assets", e);
      }
    };
    loadAssets();
  }, []);

  // Initialize/Reset Game
  const initGame = useCallback(() => {
    stateRef.current = {
      horse: { 
        x: 60, 
        y: CANVAS_HEIGHT - CONFIG.groundHeight - HORSE_SIZE + 4, // +4 to sink slightly into ground for weight
        w: HORSE_SIZE, 
        h: HORSE_SIZE, 
        vy: 0, 
        isJumping: false,
        frameCount: 0
      },
      mountains: [],
      yuanbaos: [],
      particles: [],
      gameSpeed: CONFIG.baseSpeed,
      score: 0,
      frame: 0,
      isRunning: true,
    };
    setScore(0);
    setGameState(GameState.PLAYING);
  }, []);

  const handleJump = useCallback(() => {
    const { horse, isRunning } = stateRef.current;
    
    // Start game if on start screen and assets are ready
    if (!isRunning && gameState === GameState.START) {
      if (assetsLoaded) {
        initGame();
      }
      return;
    }
    
    // Only jump if on the ground
    // Use a small threshold (5px) to allow jumping even if slightly off due to float rounding
    const groundLevel = CANVAS_HEIGHT - CONFIG.groundHeight - horse.h;
    if (horse.y >= groundLevel - 5) {
      horse.vy = CONFIG.jumpStrength;
      horse.isJumping = true;
    }
  }, [gameState, initGame, assetsLoaded]);

  // Input Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        handleJump();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling/zooming
      handleJump();
    };

    window.addEventListener('keydown', handleKeyDown);
    const canvas = canvasRef.current;
    canvas?.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas?.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleJump]);

  // Main Game Loop
  useEffect(() => {
    // Don't start loop if assets aren't loaded
    if (!assetsLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationFrameId: number;

    const spawnEntities = (frame: number, speed: number) => {
      // Spawn Mountains
      // As speed increases, spawn slightly more frequently but maintain gap
      if (frame % Math.floor(CONFIG.spawnRateMountain / (speed / CONFIG.baseSpeed)) === 0) {
        if (Math.random() > 0.4) { // Random chance
          stateRef.current.mountains.push({
            id: frame,
            x: CANVAS_WIDTH,
            y: CANVAS_HEIGHT - CONFIG.groundHeight - 50, // mountain height
            w: 40,
            h: 50,
          });
        }
      }

      // Spawn Yuanbao
      if (frame % Math.floor(CONFIG.spawnRateYuanbao / (speed / CONFIG.baseSpeed)) === 0) {
        if (Math.random() > 0.3) {
           // Random height: low, mid, high
           const heightLevels = [
             CANVAS_HEIGHT - CONFIG.groundHeight - 50, // Ground level (adjusted for bigger horse)
             CANVAS_HEIGHT - CONFIG.groundHeight - 120, // Jump level
             CANVAS_HEIGHT - CONFIG.groundHeight - 180 // High jump level
           ];
           const y = heightLevels[Math.floor(Math.random() * heightLevels.length)];
           
           stateRef.current.yuanbaos.push({
             id: frame,
             x: CANVAS_WIDTH,
             y: y,
             w: 30,
             h: 20,
             collected: false,
             floatOffset: Math.random() * Math.PI * 2
           });
        }
      }
    };

    const checkCollisions = () => {
      const { horse, mountains, yuanbaos } = stateRef.current;
      
      const horseRect = {
        x: horse.x + HITBOX_PADDING,
        y: horse.y + HITBOX_PADDING,
        w: horse.w - (HITBOX_PADDING * 2),
        h: horse.h - (HITBOX_PADDING * 2),
      };

      // Check Mountains (Game Over)
      for (const m of mountains) {
        const mRect = {
          x: m.x + 4,
          y: m.y + 4,
          w: m.w - 8,
          h: m.h,
        };
        
        if (
          horseRect.x < mRect.x + mRect.w &&
          horseRect.x + horseRect.w > mRect.x &&
          horseRect.y < mRect.y + mRect.h &&
          horseRect.y + horseRect.h > mRect.y
        ) {
          endGame();
          return;
        }
      }

      // Check Yuanbaos (Score)
      for (const yb of yuanbaos) {
        if (yb.collected) continue;
        
        if (
          horseRect.x < yb.x + yb.w &&
          horseRect.x + horseRect.w > yb.x &&
          horseRect.y < yb.y + yb.h &&
          horseRect.y + horseRect.h > yb.y
        ) {
          yb.collected = true;
          stateRef.current.score += YUANBAO_VALUE;
          setScore(stateRef.current.score); // Sync React state for UI
          
          // Add Particle
          stateRef.current.particles.push({
            id: Date.now(),
            x: yb.x,
            y: yb.y,
            life: 30,
            text: `+${YUANBAO_VALUE}¥`,
            color: COLORS.gold
          });
        }
      }
    };

    const endGame = () => {
      stateRef.current.isRunning = false;
      setGameState(GameState.GAME_OVER);
    };

    const render = () => {
      if (!ctx || !canvas) return;

      const { horse, mountains, yuanbaos, particles, gameSpeed, frame, isRunning } = stateRef.current;

      // CLEAR
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // BACKGROUND
      // Draw simple background gradient or solid color
      ctx.fillStyle = COLORS.bgSky;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw clouds/decorations
      drawClouds(ctx, frame, CANVAS_WIDTH);

      // Draw Ground
      drawGround(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, CONFIG.groundHeight, frame, gameSpeed);

      // UPDATE LOGIC
      if (isRunning) {
        // Physics
        horse.vy += CONFIG.gravity;
        horse.y += horse.vy;

        // Ground Collision
        const groundY = CANVAS_HEIGHT - CONFIG.groundHeight - horse.h + 4; // +4 to sink slightly
        if (horse.y > groundY) {
          horse.y = groundY;
          horse.vy = 0;
          horse.isJumping = false;
        }

        // Speed Progression (Very subtle)
        // Increase speed by 0.1 every 500 frames
        stateRef.current.gameSpeed = CONFIG.baseSpeed + Math.floor(frame / 500) * 0.5;

        // Entities Movement & Cleanup
        stateRef.current.mountains = mountains
          .map(m => ({ ...m, x: m.x - gameSpeed }))
          .filter(m => m.x + m.w > -100);

        stateRef.current.yuanbaos = yuanbaos
          .map(yb => ({ 
            ...yb, 
            x: yb.x - gameSpeed,
            // Floating effect
            y: yb.y + Math.sin((frame * 0.1) + yb.floatOffset) * 0.5 
          }))
          .filter(yb => yb.x + yb.w > -100 && !yb.collected);
          
        stateRef.current.particles = particles
          .map(p => ({ ...p, y: p.y - 1, life: p.life - 1 }))
          .filter(p => p.life > 0);

        stateRef.current.frame++;
        horse.frameCount++;

        spawnEntities(frame, gameSpeed);
        checkCollisions();
      }

      // DRAW ENTITIES
      
      // Yuanbaos
      yuanbaos.forEach(yb => {
        if (!yb.collected) drawYuanbao(ctx, yb);
      });

      // Mountains
      mountains.forEach(m => drawMountain(ctx, m));

      // Horse
      // Pass the image if loaded
      drawHorse(ctx, horse, imagesRef.current?.horse);

      // Particles
      particles.forEach(p => drawParticle(ctx, p));

      // LOOP
      if (gameState !== GameState.GAME_OVER) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Start Loop
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, assetsLoaded]); // Re-bind when game state changes (mainly for restart)

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="block bg-[#8F1E1A] w-full max-w-[800px] h-auto cursor-pointer"
        style={{ touchAction: 'none' }}
        onClick={handleJump}
      />
      
      {/* HUD - Score */}
      <div className="absolute top-4 left-4 flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-yellow-500 shadow-md">
        <span className="text-2xl mr-2">💰</span>
        <span className="text-xl font-bold text-red-700 font-mono">¥{score}</span>
      </div>

      {/* Loading Overlay */}
      {!assetsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
          <div className="text-red-600 font-bold animate-pulse">Loading Assets...</div>
        </div>
      )}

      {/* Start Overlay */}
      {gameState === GameState.START && assetsLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="bg-red-600 p-6 rounded-lg shadow-xl text-center border-4 border-yellow-400 animate-bounce-slow">
            <h2 className="text-3xl font-bold text-yellow-300 mb-2">Ready?</h2>
            <p className="text-white text-lg">Press Space or Tap to Jump</p>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === GameState.GAME_OVER && (
        <RedPocketModal score={score} onRestart={initGame} />
      )}
    </div>
  );
};

export default SpringRunnerGame;