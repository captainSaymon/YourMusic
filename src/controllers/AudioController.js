import { Audio } from 'expo-av'

class AudioController {
  constructor() {
    this.sound = null
    this.isPlaying = false
    this.currentTime = 0
    this.onTimeUpdate = null
  }

  async init() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: 1,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1,
      playThroughEarpieceAndroid: false,
    });
  }

  async loadAndPlay(uri) {
    if (this.sound) {
      await this.sound.unloadAsync()
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: uri },
      { shouldPlay: true }
    );
    
    this.sound = sound
    this.isPlaying = true

    
    this.sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return

      this.isPlaying = status.isPlaying
      this.currentTime = status.positionMillis / 1000

      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.currentTime);
      }
    })
  }

  async togglePlay() {
    if (!this.sound) return

    if (this.isPlaying) {
      await this.sound.pauseAsync()
    }
    else {
      await this.sound.playAsync()
    }
    this.isPlaying = !this.isPlaying
  }

  async getCurrentTime() {
    return this.currentTime || 0;
  }

  setTimeListener(callback) {
    this.onTimeUpdate = callback;
  }
}

export default new AudioController()