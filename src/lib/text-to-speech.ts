/**
 * Text-to-Speech utility functions
 * Provides functionality to read text aloud using the Web Speech API
 */

export interface TTSOptions {
  rate?: number; // Speech rate (0.1 to 10)
  pitch?: number; // Voice pitch (0 to 2)
  volume?: number; // Voice volume (0 to 1)
  lang?: string; // Language code (e.g., 'en-US', 'en-GB')
  voice?: SpeechSynthesisVoice; // Specific voice to use
}

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentText: string;
  currentId: string;
  currentUtterance: SpeechSynthesisUtterance | null;
  isPreparing: boolean; // NEW: Indicates audio is about to start
}

class TextToSpeechService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;
  private isPaused = false;
  private currentText = "";
  private currentId = ""; // Track which component is currently playing
  private isPreparing = false; // NEW: Track if audio is being prepared
  private listeners: Array<(state: TTSState) => void> = [];

  constructor() {
    this.checkSupport();
  }

  /**
   * Check if the browser supports speech synthesis
   */
  private checkSupport(): boolean {
    return "speechSynthesis" in window;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.checkSupport()) return [];
    return speechSynthesis.getVoices();
  }

  /**
   * Get English voices
   */
  getEnglishVoices(): SpeechSynthesisVoice[] {
    return this.getVoices().filter((voice) => voice.lang.startsWith("en"));
  }

  /**
   * Get the best English voice (prefer US English)
   */
  getBestEnglishVoice(): SpeechSynthesisVoice | null {
    const englishVoices = this.getEnglishVoices();

    // Prefer US English voices
    const usVoices = englishVoices.filter((voice) => voice.lang === "en-US");

    if (usVoices.length > 0) {
      // Prefer female voices for better listening experience
      const femaleVoice = usVoices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("woman") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("susan")
      );

      return femaleVoice || usVoices[0];
    }

    return englishVoices[0] || null;
  }

  /**
   * Speak text with given options
   */
  speak(
    text: string,
    options: TTSOptions = {},
    id: string = ""
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.checkSupport()) {
        reject(new Error("Speech synthesis not supported"));
        return;
      }

      // Set new ID immediately to prevent UI flicker
      this.currentId = id;
      this.currentText = text;
      this.isPreparing = true; // NEW: Indicate we're preparing to play
      this.notifyListeners(); // Notify so UI shows preparing state

      // Stop current speech if playing (internal - doesn't reset currentId)
      this.stopInternal();

      // Re-set preparing state after stopInternal (which resets it)
      this.isPreparing = true;
      this.notifyListeners(); // Notify again to maintain preparing state

      this.utterance = new SpeechSynthesisUtterance(text);

      // Set voice
      if (options.voice) {
        this.utterance.voice = options.voice;
      } else {
        const bestVoice = this.getBestEnglishVoice();
        if (bestVoice) {
          this.utterance.voice = bestVoice;
        }
      }

      // Set options
      this.utterance.rate = options.rate || 0.9; // Slightly slower for better comprehension
      this.utterance.pitch = options.pitch || 1.0;
      this.utterance.volume = options.volume || 1.0;
      this.utterance.lang = options.lang || "en-US";

      // Event handlers
      this.utterance.onstart = () => {
        this.isPlaying = true;
        this.isPaused = false;
        this.isPreparing = false; // NEW: No longer preparing
        this.notifyListeners();
      };

      this.utterance.onend = () => {
        this.isPlaying = false;
        this.isPaused = false;
        this.isPreparing = false; // NEW: Reset preparing state
        this.currentId = "";
        this.utterance = null;
        this.notifyListeners();
        resolve();
      };

      this.utterance.onerror = (event) => {
        // Don't reset currentId if we're in the middle of switching to a new audio
        // Only reset if this is a genuine error (not an interruption from switching)
        if (event.error === "interrupted") {
          // Don't reset currentId for interruptions - this is expected when switching
          this.isPlaying = false;
          this.isPaused = false;
          this.isPreparing = false;
          this.utterance = null;
          // Don't notify listeners - let the new audio handle the state
          return;
        }

        // For genuine errors, reset everything
        this.isPlaying = false;
        this.isPaused = false;
        this.isPreparing = false;
        this.currentId = "";
        this.utterance = null;
        this.notifyListeners();
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.utterance.onpause = () => {
        this.isPaused = true;
        this.notifyListeners();
      };

      this.utterance.onresume = () => {
        this.isPaused = false;
        this.notifyListeners();
      };

      // Start speaking
      speechSynthesis.speak(this.utterance);
    });
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.isPlaying && !this.isPaused && speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.isPaused && speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }

  /**
   * Stop current speech (internal use - doesn't reset currentId)
   */
  private stopInternal(): void {
    if (speechSynthesis.speaking || speechSynthesis.paused) {
      speechSynthesis.cancel();
    }

    this.isPlaying = false;
    this.isPaused = false;
    this.isPreparing = false; // NEW: Reset preparing state
    this.utterance = null;

    // Don't reset currentId here - it will be set by the new speak call
  }

  /**
   * Stop current speech (public use - resets currentId)
   */
  stop(): void {
    this.stopInternal();
    this.currentId = "";
    this.notifyListeners();
  }

  /**
   * Toggle play/pause
   */
  toggle(): void {
    if (this.isPlaying) {
      if (this.isPaused) {
        this.resume();
      } else {
        this.pause();
      }
    }
  }

  /**
   * Get current state
   */
  getState(): TTSState {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      isSupported: this.checkSupport(),
      currentText: this.currentText,
      currentId: this.currentId,
      currentUtterance: this.utterance,
      isPreparing: this.isPreparing, // NEW: Include preparing state
    };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: TTSState) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  /**
   * Check if currently playing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying && !this.isPaused;
  }

  /**
   * Check if currently paused
   */
  isCurrentlyPaused(): boolean {
    return this.isPlaying && this.isPaused;
  }

  /**
   * Get current text being spoken
   */
  getCurrentText(): string {
    return this.currentText;
  }

  /**
   * Check if a specific component is currently playing
   */
  isComponentPlaying(id: string): boolean {
    return this.isPlaying && this.currentId === id;
  }

  /**
   * Get current playing component ID
   */
  getCurrentId(): string {
    return this.currentId;
  }
}

// Create singleton instance
export const ttsService = new TextToSpeechService();

// Export convenience functions
export const speakText = (text: string, options?: TTSOptions, id?: string) =>
  ttsService.speak(text, options, id || "");

export const pauseSpeech = () => ttsService.pause();
export const resumeSpeech = () => ttsService.resume();
export const stopSpeech = () => ttsService.stop();
export const toggleSpeech = () => ttsService.toggle();

export const getTTSState = () => ttsService.getState();
export const subscribeToTTS = (listener: (state: TTSState) => void) =>
  ttsService.subscribe(listener);

export const isTTSSupported = () => ttsService.getState().isSupported;
export const getEnglishVoices = () => ttsService.getEnglishVoices();
export const getBestEnglishVoice = () => ttsService.getBestEnglishVoice();
export const isComponentPlaying = (id: string) =>
  ttsService.isComponentPlaying(id);
export const getCurrentId = () => ttsService.getCurrentId();
