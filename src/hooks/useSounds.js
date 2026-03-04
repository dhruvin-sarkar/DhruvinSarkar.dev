import { useState, useEffect, useRef, useCallback } from 'react';

// Import sound files
import startupSound from '../assets/Win95 Absolute masterclass by DS.mp3';
import tadaSound from '../assets/tada.mp3';
import dingSound from '../assets/ding.mp3';
import chordSound from '../assets/chord.mp3';
import chimesSound from '../assets/chimes.mp3';
import maximizeSound from '../assets/windows-95-sfx-maximize.wav';
import minimizeSound from '../assets/windows-95-sfx-minimize.wav';

const SOUND_FILES = {
  startup: startupSound,
  tada: tadaSound,
  ding: dingSound,
  chord: chordSound,
  chimes: chimesSound,
  maximize: maximizeSound,
  minimize: minimizeSound,
};

export const useSounds = () => {
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('win95_volume');
    return saved ? parseFloat(saved) : 1.0;
  });

  const [muted, setMuted] = useState(() => {
    const saved = localStorage.getItem('win95_muted');
    return saved === 'true';
  });

  const [isReady, setIsReady] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRefs = useRef({});
  const currentlyPlaying = useRef(null);

  // Preload all sounds
  useEffect(() => {
    const loadSounds = async () => {
      try {
        Object.entries(SOUND_FILES).forEach(([key, src]) => {
          const audio = new Audio(src);
          audio.preload = 'auto';
          audio.volume = muted ? 0 : volume;
          // Enable looping for the startup sound (background music)
          if (key === 'startup') {
            audio.loop = true;
          }
          audioRefs.current[key] = audio;
        });
        setIsReady(true);
      } catch (error) {
        console.error('Error loading sounds:', error);
      }
    };

    loadSounds();

    // Cleanup
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  // Update volume for all audio elements
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = muted ? 0 : volume;
    });
    localStorage.setItem('win95_volume', volume.toString());
  }, [volume, muted]);

  // Save muted state
  useEffect(() => {
    localStorage.setItem('win95_muted', muted.toString());
  }, [muted]);

  // Enable user interaction flag on first click/touch
  useEffect(() => {
    const enableSound = () => {
      setUserInteracted(true);
      document.removeEventListener('click', enableSound);
      document.removeEventListener('touchstart', enableSound);
    };

    document.addEventListener('click', enableSound);
    document.addEventListener('touchstart', enableSound);

    return () => {
      document.removeEventListener('click', enableSound);
      document.removeEventListener('touchstart', enableSound);
    };
  }, []);

  const playSound = useCallback((soundName, options = {}) => {
    if (!isReady) {
      console.warn('Sound system not ready');
      return Promise.resolve();
    }

    const audio = audioRefs.current[soundName];
    if (!audio) {
      console.warn(`Sound "${soundName}" not found`);
      return Promise.resolve();
    }

    // For startup sound, always try to play even if muted (user can unmute)
    const isStartup = soundName === 'startup';
    
    if (!isStartup && (muted || !userInteracted)) {
      return Promise.resolve();
    }

    const {
      stopCurrent = false,
      fadeIn = false,
      fadeInDuration = 300,
      onComplete = null,
    } = options;

    // Stop currently playing sound if requested
    if (stopCurrent && currentlyPlaying.current) {
      currentlyPlaying.current.pause();
      currentlyPlaying.current.currentTime = 0;
    }

    // Reset audio to start
    audio.currentTime = 0;
    audio.volume = muted ? 0 : (fadeIn ? 0 : volume);

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          currentlyPlaying.current = audio;

          // Fade in effect
          if (fadeIn && !muted) {
            let currentVol = 0;
            const step = volume / (fadeInDuration / 50);
            const fadeInterval = setInterval(() => {
              currentVol += step;
              if (currentVol >= volume) {
                audio.volume = volume;
                clearInterval(fadeInterval);
              } else {
                audio.volume = currentVol;
              }
            }, 50);
          }

          // Handle completion
          audio.onended = () => {
            if (currentlyPlaying.current === audio) {
              currentlyPlaying.current = null;
            }
            if (onComplete) onComplete();
          };
        })
        .catch(error => {
          // Handle autoplay restrictions
          if (error.name !== 'NotAllowedError') {
            console.error('Error playing sound:', error);
          }
        });
    }

    return playPromise || Promise.resolve();
  }, [isReady, userInteracted, muted, volume]);

  // Specific sound functions
  const playStartup = useCallback((onComplete) => {
    return playSound('startup', { fadeIn: true, fadeInDuration: 500, onComplete });
  }, [playSound]);

  const playTada = useCallback(() => {
    return playSound('tada');
  }, [playSound]);

  const playDing = useCallback(() => {
    return playSound('ding');
  }, [playSound]);

  const playChord = useCallback(() => {
    return playSound('chord');
  }, [playSound]);

  const playChimes = useCallback(() => {
    return playSound('chimes');
  }, [playSound]);

  const playNotification = useCallback((type = 'ding') => {
    const soundMap = {
      ding: 'ding',
      chimes: 'chimes',
      alert: 'ding',
      info: 'chimes',
    };
    return playSound(soundMap[type] || 'ding');
  }, [playSound]);

  const playWindowClose = useCallback(() => {
    return playSound('chord');
  }, [playSound]);

  const playWindowMaximize = useCallback(() => {
    return playSound('maximize');
  }, [playSound]);

  const playWindowMinimize = useCallback(() => {
    return playSound('minimize');
  }, [playSound]);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  const setVolumeLevel = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    setVolume(clampedVolume / 100);
  }, []);

  return {
    // Sound functions
    playStartup,
    playTada,
    playDing,
    playChord,
    playChimes,
    playNotification,
    playWindowClose,
    playWindowMaximize,
    playWindowMinimize,
    
    // Controls
    volume: Math.round(volume * 100),
    setVolume: setVolumeLevel,
    muted,
    toggleMute,
    
    // State
    isReady,
    userInteracted,
  };
};
