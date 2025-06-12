// Complete Voice Service Implementation
import { v4 as uuidv4 } from 'uuid';

export class AdvancedVoiceService {
  constructor() {
    this.isSupported = 'speechSynthesis' in window;
    this.synthesis = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.currentUtterance = null;
    
    this.initializeRecognition();
    this.loadVoices();
  }

  initializeRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;
  }

  loadVoices() {
    // Load voices when they become available
    this.synthesis.onvoiceschanged = () => {
      this.voices = this.synthesis.getVoices();
    };
    this.voices = this.synthesis.getVoices();
  }

  // Enhanced Text-to-Speech with personality
  async speakMessage(text, personality = 'caring', options = {}) {
    if (!text || !this.synthesis) return false;

    // Stop any current speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply personality-based voice settings
    const personalitySettings = this.getPersonalityVoiceSettings(personality);
    
    utterance.rate = options.rate || personalitySettings.rate;
    utterance.pitch = options.pitch || personalitySettings.pitch;
    utterance.volume = options.volume || personalitySettings.volume;

    // Select appropriate voice
    const selectedVoice = this.selectVoiceByPersonality(personality);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    this.currentUtterance = utterance;

    return new Promise((resolve, reject) => {
      utterance.onstart = () => {
        console.log('🎵 AI started speaking:', text.substring(0, 50) + '...');
      };

      utterance.onend = () => {
        console.log('✅ AI finished speaking');
        this.currentUtterance = null;
        resolve(true);
      };

      utterance.onerror = (error) => {
        console.error('❌ Speech error:', error);
        this.currentUtterance = null;
        reject(error);
      };

      try {
        this.synthesis.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  }

  getPersonalityVoiceSettings(personality) {
    const settings = {
      caring: { rate: 0.85, pitch: 1.1, volume: 0.9 },
      playful: { rate: 1.15, pitch: 1.3, volume: 1.0 },
      wise: { rate: 0.75, pitch: 0.9, volume: 0.8 },
      energetic: { rate: 1.25, pitch: 1.2, volume: 1.0 },
      calm: { rate: 0.7, pitch: 0.85, volume: 0.75 }
    };
    return settings[personality] || settings.caring;
  }

  selectVoiceByPersonality(personality) {
    if (!this.voices || this.voices.length === 0) return null;

    // Prefer female voices for caring/calm personalities
    const femaleVoices = this.voices.filter(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('zira')
    );

    // Prefer male voices for wise/energetic personalities
    const maleVoices = this.voices.filter(voice => 
      voice.name.toLowerCase().includes('male') ||
      voice.name.toLowerCase().includes('david') ||
      voice.name.toLowerCase().includes('mark')
    );

    const englishVoices = this.voices.filter(voice => 
      voice.lang.startsWith('en')
    );

    switch (personality) {
      case 'caring':
      case 'calm':
        return femaleVoices[0] || englishVoices[0] || this.voices[0];
      case 'wise':
      case 'energetic':
        return maleVoices[0] || englishVoices[0] || this.voices[0];
      default:
        return englishVoices[0] || this.voices[0];
    }
  }

  // Enhanced Speech Recognition
  async startListening() {
    if (!this.recognition || this.isListening) {
      throw new Error('Speech recognition not available or already listening');
    }

    return new Promise((resolve, reject) => {
      this.isListening = true;
      let finalTranscript = '';
      let timeoutId;

      // Auto-stop after 10 seconds of silence
      const resetTimeout = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          this.stopListening();
        }, 10000);
      };

      this.recognition.onstart = () => {
        console.log('🎤 Started listening...');
        resetTimeout();
      };

      this.recognition.onresult = (event) => {
        resetTimeout();
        
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Emit interim results for real-time feedback
        if (interimTranscript) {
          this.onInterimResult?.(interimTranscript);
        }
      };

      this.recognition.onend = () => {
        clearTimeout(timeoutId);
        this.isListening = false;
        console.log('🎤 Stopped listening. Final transcript:', finalTranscript);
        
        if (finalTranscript.trim()) {
          resolve(finalTranscript.trim());
        } else {
          reject(new Error('No speech detected'));
        }
      };

      this.recognition.onerror = (error) => {
        clearTimeout(timeoutId);
        this.isListening = false;
        console.error('🎤 Speech recognition error:', error);
        reject(error);
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Voice Message Recording
  async startRecording() {
    if (this.isRecording) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      console.log('🎙️ Started recording voice message');
      return true;

    } catch (error) {
      console.error('❌ Recording failed:', error);
      return false;
    }
  }

  async stopRecording() {
    if (!this.isRecording || !this.mediaRecorder) return null;

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Stop all tracks
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        this.isRecording = false;
        console.log('🎙️ Stopped recording, created voice message');
        
        resolve({
          id: uuidv4(),
          blob: audioBlob,
          url: audioUrl,
          duration: this.audioChunks.length * 0.1, // Approximate duration
          timestamp: new Date().toISOString()
        });
      };

      this.mediaRecorder.stop();
    });
  }

  // Stop all audio activities
  stopAll() {
    this.synthesis.cancel();
    this.stopListening();
    if (this.isRecording) {
      this.stopRecording();
    }
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synthesis.speaking;
  }

  // Get available voices for user selection
  getAvailableVoices() {
    return this.voices.map(voice => ({
      id: voice.name,
      name: voice.name,
      lang: voice.lang,
      gender: this.detectGender(voice.name)
    }));
  }

  detectGender(voiceName) {
    const name = voiceName.toLowerCase();
    if (name.includes('female') || name.includes('woman') || 
        name.includes('samantha') || name.includes('karen') || 
        name.includes('zira') || name.includes('susan')) {
      return 'female';
    }
    if (name.includes('male') || name.includes('man') || 
        name.includes('david') || name.includes('mark') || 
        name.includes('daniel')) {
      return 'male';
    }
    return 'unknown';
  }
}

export const advancedVoiceService = new AdvancedVoiceService();