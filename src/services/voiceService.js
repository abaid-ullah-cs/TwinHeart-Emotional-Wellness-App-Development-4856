// Advanced Voice Service for TwinHeart (Web Compatible)
export class VoiceService {
  constructor() {
    this.isSupported = 'speechSynthesis' in window && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    this.synthesis = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.audioContext = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    
    this.initializeRecognition();
    this.initializeAudioContext();
  }

  initializeRecognition() {
    if (!this.isSupported) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.error('Audio context initialization failed:', error);
    }
  }

  // Text-to-Speech with natural voice
  async speak(text, options = {}) {
    if (!text || !this.synthesis) return;

    // Stop any current speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Voice configuration
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Samantha') || 
      voice.name.includes('Karen') || 
      voice.name.includes('Zira') ||
      voice.lang.includes('en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1.1;
    utterance.volume = options.volume || 0.8;

    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      
      this.synthesis.speak(utterance);
    });
  }

  // Speech Recognition
  async startListening(onResult, onError) {
    if (!this.recognition || this.isListening) return;

    this.isListening = true;

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        onResult(result[0].transcript);
      }
    };

    this.recognition.onerror = (error) => {
      this.isListening = false;
      onError(error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (error) {
      this.isListening = false;
      onError(error);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Voice Recording for voice notes
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      return true;
    } catch (error) {
      console.error('Recording failed:', error);
      return false;
    }
  }

  async stopRecording() {
    if (!this.mediaRecorder) return null;

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        
        // Stop all tracks
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        resolve({ blob, url: audioUrl });
      };

      this.mediaRecorder.stop();
    });
  }

  // Voice Analysis for emotional tone (simplified for web)
  async analyzeVoiceTone(audioBlob) {
    try {
      // For demo purposes, return mock analysis
      // In production, this would use Web Audio API or external service
      return { 
        emotion: 'neutral', 
        confidence: 0.7, 
        energy_level: 0.6 
      };
    } catch (error) {
      console.error('Voice analysis failed:', error);
      return { emotion: 'neutral', confidence: 0.5, energy_level: 0.5 };
    }
  }

  // Get available voices
  getAvailableVoices() {
    if (!this.synthesis) return [];
    
    return this.synthesis.getVoices().map(voice => ({
      id: voice.name,
      name: voice.name,
      lang: voice.lang,
      gender: voice.name.toLowerCase().includes('female') || 
              voice.name.toLowerCase().includes('karen') ||
              voice.name.toLowerCase().includes('samantha') ? 'female' : 'male'
    }));
  }

  // Auto voice message system
  async sendAutoVoiceMessage(message, personality = 'caring') {
    const personalityVoices = {
      caring: { rate: 0.8, pitch: 1.1, volume: 0.9 },
      playful: { rate: 1.1, pitch: 1.3, volume: 1.0 },
      wise: { rate: 0.7, pitch: 0.9, volume: 0.8 },
      energetic: { rate: 1.2, pitch: 1.2, volume: 1.0 },
      calm: { rate: 0.6, pitch: 0.8, volume: 0.7 }
    };

    const voiceOptions = personalityVoices[personality] || personalityVoices.caring;
    
    try {
      await this.speak(message, voiceOptions);
    } catch (error) {
      console.error('Auto voice message failed:', error);
    }
  }
}

export const voiceService = new VoiceService();