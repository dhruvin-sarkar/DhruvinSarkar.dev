import UseContext from '../Context'
import React, { useContext, useEffect, useRef, useState } from 'react';
import Draggable from './system/WindowDraggable';
import { imageMapping } from './function/AppFunctions';
import '../css/DoomGame.css'

function DoomGame() {
  const canvasRef = useRef(null);
  const dosInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { 
    setRightClickDefault,
    themeDragBar,
    DoomExpand, setDoomExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
    iconFocusIcon,
  } = useContext(UseContext);

  function handleDragStop(event, data) {
    const positionX = data.x 
    const positionY = data.y
    setDoomExpand(prev => ({
      ...prev,
      x: positionX,
      y: positionY
    }))
  }

  // Initialize DOOM
  useEffect(() => {
    if (!canvasRef.current || dosInstanceRef.current || !DoomExpand.show) return;

    const initDoom = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setLoadingProgress(10);

        // Wait a bit for scripts to load
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoadingProgress(20);

        // Check if js-dos is loaded
        if (!window.Dos) {
          // Try to load js-dos dynamically as fallback
          console.log('Attempting to load js-dos dynamically...');
          const script = document.createElement('script');
          script.src = 'https://v8.js-dos.com/latest/js-dos.js';
          script.onload = () => console.log('js-dos loaded dynamically');
          script.onerror = () => console.error('Failed to load js-dos dynamically');
          document.head.appendChild(script);
          
          // Wait for script to load
          await new Promise(resolve => {
            const checkDos = () => {
              if (window.Dos) resolve();
              else setTimeout(checkDos, 100);
            };
            checkDos();
          });
        }

        if (!window.Dos) {
          throw new Error('js-dos library could not be loaded. Please check your internet connection and refresh the page.');
        }

        console.log('js-dos loaded successfully:', window.Dos);
        setLoadingProgress(30);

        // Use the correct js-dos v7 API with bundle URL in options
        console.log('Starting DOOM with js-dos v7 API...');
        setLoadingProgress(50);

        const dos = window.Dos(canvasRef.current, {
          url: "https://v8.js-dos.com/bundles/doom.jsdos",
          autoStart: true,
          onEvent: (event, ci) => {
            console.log('js-dos event:', event);
            if (event === 'ci-ready') {
              console.log('Command Interface ready:', ci);
              dosInstanceRef.current = ci;
              setLoadingProgress(80);
              
              // Wait a bit for the game to start
              setTimeout(() => {
                setLoadingProgress(100);
                setIsRunning(true);
                setIsLoading(false);
                console.log('DOOM started successfully!');
              }, 2000);
            }
          }
        });

        console.log('DOS instance created:', dos);
        
        // Fallback in case onEvent doesn't fire
        setTimeout(() => {
          if (!isRunning) {
            console.log('Fallback: Assuming DOOM started...');
            setLoadingProgress(100);
            setIsRunning(true);
            setIsLoading(false);
          }
        }, 10000);
        
      } catch (err) {
        console.error('Failed to initialize DOOM:', err);
        setError(`Failed to load DOOM: ${err.message || 'Unknown error'}`);
        setIsLoading(false);
        
        // Cleanup on error
        if (dosInstanceRef.current) {
          try {
            if (typeof dosInstanceRef.current.exit === 'function') {
              await dosInstanceRef.current.exit();
            }
          } catch (cleanupError) {
            console.warn('Error during cleanup:', cleanupError);
          }
          dosInstanceRef.current = null;
        }
      }
    };

    initDoom();

    // Cleanup on unmount
    return () => {
      if (dosInstanceRef.current) {
        try {
          if (typeof dosInstanceRef.current.exit === 'function') {
            dosInstanceRef.current.exit();
          }
        } catch (e) {
          console.warn('Error exiting DOS instance:', e);
        }
        dosInstanceRef.current = null;
      }
    };
  }, [DoomExpand.show]);

  // Handle window focus/blur for emulator pause
  useEffect(() => {
    if (!dosInstanceRef.current) return;

    if (!DoomExpand.focusItem && isRunning) {
      // Optionally pause when window loses focus
      // dosInstanceRef.current.pause();
    } else if (DoomExpand.focusItem && isRunning) {
      // Resume when window gains focus
      // dosInstanceRef.current.resume();
    }
  }, [DoomExpand.focusItem, isRunning]);

  const handleFullscreen = () => {
    const container = document.querySelector('.doom-game-container');
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        container.classList.remove('fullscreen');
      } else {
        container.classList.add('fullscreen');
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        }
      }
    }
  };

  const handleClose = () => {
    if (dosInstanceRef.current) {
      try {
        dosInstanceRef.current.exit();
      } catch (e) {
        console.warn('Error exiting DOS instance:', e);
      }
      dosInstanceRef.current = null;
    }
    deleteTap('DOOM')
  };

  const handleMinimize = () => {
    setDoomExpand(prev => ({...prev, hide: true, focusItem: false}))
    StyleHide('DOOM')
  };

  const handleMaximize = () => {
    handleFullscreen(); // Call fullscreen instead of window expansion
  };

  if (!DoomExpand.show) return null;

  return (
    <>
      <Draggable
        axis="both" 
        handle={'.doom-title-bar'}
        grid={[1, 1]}
        scale={1}
        disabled={DoomExpand.expand}
        bounds={{top: 0}}
        defaultPosition={{ 
          x: window.innerWidth <= 500 ? 20 : 50,
          y: window.innerWidth <= 500 ? 40 : 50,
        }}
        onStop={handleDragStop}
        onStart={() => handleSetFocusItemTrue('DOOM')}
      >
        <div className='doom-game-container' 
            onClick={(e) => {
              e.stopPropagation();
              handleSetFocusItemTrue('DOOM');
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setRightClickDefault(false)}}
            style={ DoomExpand.expand ? inlineStyleExpand('DOOM') : inlineStyle('DOOM')}>
          
          {/* Window Title Bar */}
          <div className="doom-title-bar"
             style={{ background: DoomExpand.focusItem ? themeDragBar : '#757579'}}
          >
            <div className="doom-title-text">
              <img src={imageMapping('DOOM')} alt="DOOM" className="doom-title-icon" />
              <span>DOOM</span>
            </div>
            <div className="doom-title-buttons">
              <button 
                className="doom-title-button" 
                onClick={!isTouchDevice ? handleMinimize : undefined}
                onTouchEnd={handleMinimize}
                title="Minimize"
              >
                <span>_</span>
              </button>
              <button 
                className="doom-title-button" 
                onClick={!isTouchDevice ? handleMaximize : undefined}
                onTouchEnd={handleMaximize}
                title={document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen"}
              >
                <span>⛶</span>
              </button>
              <button 
                className="doom-title-button doom-close-button" 
                onClick={!isTouchDevice ? handleClose : undefined}
                onTouchEnd={handleClose}
                title="Close"
              >
                <span>×</span>
              </button>
            </div>
          </div>

          {/* Game Content Area */}
          <div className="doom-content"
            onClick={() => iconFocusIcon('')}
            ref={(el) => {
              if (el && !canvasRef.current) {
                // Find the canvas that js-dos creates
                setTimeout(() => {
                  const canvas = el.querySelector('canvas');
                  if (canvas) {
                    canvasRef.current = canvas;
                    console.log('Found js-dos canvas:', canvas);
                  }
                }, 1000);
              }
            }}>
            
            {isLoading && (
              <div className="doom-loading">
                <div className="doom-loading-spinner"></div>
                <div className="doom-loading-text">Loading DOOM...</div>
                <div className="doom-loading-hint">
                  Initializing DOS environment and game files
                </div>
                {loadingProgress > 0 && (
                  <div className="doom-loading-progress">
                    <div className="doom-loading-progress-bar" style={{width: `${loadingProgress}%`}}></div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="doom-error">
                <div className="doom-error-icon">⚠</div>
                <div className="doom-error-text">{error}</div>
                <button
                  className="doom-retry-button"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Canvas for js-dos - js-dos will create its own canvas */}
            <div className="doom-canvas-wrapper">
              <div className="doom-canvas-container">
                <div 
                  ref={canvasRef}
                  className="doom-canvas"
                  style={{ display: isLoading || error ? 'none' : 'block' }}
                />
              </div>
            </div>

            {/* Control Instructions */}
            {isRunning && (
              <div className="doom-controls-hint">
                <div className="doom-controls-text">
                  Arrow Keys: Move • Ctrl: Fire • F: Use/Open • Alt+Arrow: Strafe • Esc: Menu
                </div>
              </div>
            )}
          </div>
        </div>
      </Draggable>
    </>
  );
}

export default DoomGame;
