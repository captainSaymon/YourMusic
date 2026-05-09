import { Audio } from 'expo-av'

class AudioController {
  constructor() {
    this.sound = null
    this.isPlaying = false
    this.currentTime = 0
    this.onTimeUpdate = null
    this.onPlayStateChange = null
    this.onSongFinish = null
    this.loading = false
    this.sessionId = 0
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
  const session = ++this.sessionId
  this.loading = true

  if (this.sound) {
    try {
      await this.sound.stopAsync()
      await this.sound.unloadAsync()
    } catch (e) {}
    this.sound = null
  }

  const { sound } = await Audio.Sound.createAsync(
    { uri },
    { shouldPlay: true }
  )

  if (session !== this.sessionId) {
    try {
      await sound.unloadAsync()
    } catch (e) {}
    return
  }

  this.sound = sound
  this.isPlaying = true
  this.loading = false

  this.sound.setOnPlaybackStatusUpdate((status) => {
    if (!status.isLoaded) return

    this.isPlaying = status.isPlaying
    this.currentTime = status.positionMillis / 1000

    this.onTimeUpdate?.(this.currentTime)
    this.onPlayStateChange?.(status.isPlaying)

    if (status.didJustFinish) {
      this.onSongFinish?.()
    }
  })
}

  async togglePlay() {
    if (!this.sound) return

    const status = await this.sound.getStatusAsync()

    if (!status.isLoaded) return

    if (status.isPlaying) {
      await this.sound.pauseAsync()
    }
    else {
      await this.sound.playAsync()
    }
  }

  async getCurrentTime() {
    return this.currentTime || 0;
  }

  setTimeListener(callback) {
    this.onTimeUpdate = callback;
  }
}

export default new AudioController()