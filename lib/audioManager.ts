// 🔊 DEBUGZONE: AUDIO MANAGER
// Manages all game audio (BGM and SFX)

class AudioManager {
  private bgmExplore: HTMLAudioElement | null = null;
  private bgmQuiz: HTMLAudioElement | null = null;
  private sfxBattle: HTMLAudioElement | null = null;
  private sfxJump: HTMLAudioElement | null = null;
  private sfxVictory: HTMLAudioElement | null = null;
  private sfxLost: HTMLAudioElement | null = null;
  
  private currentBGM: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private initialized: boolean = false;
  private battleSfxPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    try {
      // Background Music (looping)
      this.bgmExplore = new Audio('/audio/Cyber Dragon.mp3');
      this.bgmQuiz = new Audio('/audio/Cyberpunk Gaming.mp3');
      
      // Sound Effects (one-time)
      this.sfxBattle = new Audio('/audio/StartBatle.mp3');
      this.sfxJump = new Audio('/audio/Cartoon Jump Sound Effect.mp3');
      this.sfxVictory = new Audio('/audio/Victory.mp3');
      this.sfxLost = new Audio('/audio/Lost.mp3');

      // Setup BGM properties (looping)
      [this.bgmExplore, this.bgmQuiz].forEach(audio => {
        if (audio) {
          audio.loop = true;
          audio.volume = this.volume;
        }
      });

      // Setup SFX properties (one-time sounds)
      if (this.sfxBattle) {
        this.sfxBattle.volume = this.volume * 0.9;
        this.sfxBattle.loop = false;
      }
      if (this.sfxJump) {
        this.sfxJump.volume = this.volume * 0.7;
        this.sfxJump.loop = false;
      }
      if (this.sfxVictory) {
        this.sfxVictory.volume = this.volume;
        this.sfxVictory.loop = false;
      }
      if (this.sfxLost) {
        this.sfxLost.volume = this.volume * 0.8;
        this.sfxLost.loop = false;
      }

      this.initialized = true;
      console.log('🔊 Audio Manager Initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  // Play exploration music
  playExplore() {
    if (!this.initialized) return;
    this.switchBGM(this.bgmExplore);
  }

  // Play quiz music
  playQuiz() {
    if (!this.initialized) return;
    this.switchBGM(this.bgmQuiz);
  }

  // Play battle start sound (one-time)
  playBattle() {
    if (!this.initialized || this.battleSfxPlaying) return;
    
    // Stop current BGM
    if (this.currentBGM) {
      this.currentBGM.pause();
      this.currentBGM.currentTime = 0;
      this.currentBGM = null;
    }
    
    // Play battle start sound (one-time, not looping)
    if (this.sfxBattle && !this.isMuted) {
      this.sfxBattle.currentTime = 0;
      this.sfxBattle.volume = this.volume * 0.9;
      this.sfxBattle.play().catch(err => console.log('Battle sound prevented:', err));
      this.battleSfxPlaying = true;
      
      // Reset flag when sound ends
      this.sfxBattle.onended = () => {
        this.battleSfxPlaying = false;
      };
    }
  }

  // Switch between BGM tracks with crossfade
  private switchBGM(newBGM: HTMLAudioElement | null) {
    if (!newBGM || newBGM === this.currentBGM) return;

    // Stop current BGM immediately (no fade to prevent overlap issues)
    if (this.currentBGM) {
      this.currentBGM.pause();
      this.currentBGM.currentTime = 0;
      this.currentBGM.volume = this.volume;
    }

    // Start new BGM
    this.currentBGM = newBGM;
    if (!this.isMuted) {
      this.currentBGM.volume = this.volume;
      this.currentBGM.currentTime = 0;
      this.currentBGM.play().catch(err => {
        console.log('Audio play prevented by browser:', err);
      });
    }
  }

  // Play jump sound effect
  playJump() {
    if (!this.initialized || this.isMuted || !this.sfxJump) return;
    
    // Clone and play to allow overlapping sounds
    const jumpClone = this.sfxJump.cloneNode() as HTMLAudioElement;
    jumpClone.volume = this.volume * 0.8;
    jumpClone.play().catch(err => console.log('Jump sound prevented:', err));
  }

  // Play victory sound
  playVictory() {
    if (!this.initialized) return;
    
    // Stop all music first
    this.stopAll();
    
    // Play victory sound
    if (this.sfxVictory && !this.isMuted) {
      this.sfxVictory.currentTime = 0;
      this.sfxVictory.volume = this.volume;
      this.sfxVictory.play().catch(err => console.log('Victory sound prevented:', err));
    }
  }

  // Play lost/defeat sound
  playLost() {
    if (!this.initialized) return;
    
    // Stop all music first
    this.stopAll();
    
    // Play lost sound
    if (this.sfxLost && !this.isMuted) {
      this.sfxLost.currentTime = 0;
      this.sfxLost.volume = this.volume * 0.8;
      this.sfxLost.play().catch(err => console.log('Lost sound prevented:', err));
    }
  }

  // Stop all audio
  stopAll() {
    [this.bgmExplore, this.bgmQuiz].forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    if (this.sfxBattle) {
      this.sfxBattle.pause();
      this.sfxBattle.currentTime = 0;
    }
    
    this.currentBGM = null;
    this.battleSfxPlaying = false;
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      if (this.currentBGM) {
        this.currentBGM.volume = 0;
      }
    } else {
      if (this.currentBGM) {
        this.currentBGM.volume = this.volume;
      }
    }
    
    return this.isMuted;
  }

  // Set volume (0-1)
  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    
    if (!this.isMuted) {
      [this.bgmExplore, this.bgmQuiz].forEach(audio => {
        if (audio) audio.volume = this.volume;
      });
      
      if (this.sfxBattle) {
        this.sfxBattle.volume = this.volume * 0.9;
      }
      
      if (this.sfxJump) {
        this.sfxJump.volume = this.volume * 0.7;
      }
      
      if (this.sfxVictory) {
        this.sfxVictory.volume = this.volume;
      }
      
      if (this.sfxLost) {
        this.sfxLost.volume = this.volume * 0.8;
      }
    }
  }

  // Get current state
  getState() {
    return {
      isMuted: this.isMuted,
      volume: this.volume,
      initialized: this.initialized,
    };
  }

  // Initialize audio (call on user interaction to bypass browser restrictions)
  async initializeAudio() {
    if (!this.initialized) {
      this.init();
    }
    
    // Try to play and immediately pause to unlock audio
    if (this.bgmExplore) {
      try {
        await this.bgmExplore.play();
        this.bgmExplore.pause();
        this.bgmExplore.currentTime = 0;
      } catch (err) {
        console.log('Audio initialization pending user interaction');
      }
    }
  }
}

// Export singleton instance
export const audioManager = new AudioManager();
