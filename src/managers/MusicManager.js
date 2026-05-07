import * as MediaLibrary from 'expo-media-library'

class MusicManager {
  async scanLocalMusic() {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status !== 'granted') return []

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
    })

    return media.assets.map(asset => ({
      id: asset.id,
      uri: asset.uri,
      title: asset.filename.replace(".mp3", ""),
      duration: asset.duration
    }))
  }
}

export default new MusicManager()