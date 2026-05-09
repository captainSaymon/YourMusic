import * as MediaLibrary from 'expo-media-library'

class MusicManager {
  async scanLocalMusic() {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status !== 'granted') return []

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 1000
    })

    const musicFiles = media.assets.filter(asset => 
      asset.uri.toLowerCase().includes('/music/')
    )

    if(musicFiles.length === 0) {
      return false
    }


    return musicFiles.map(asset => ({
      id: asset.id,
      uri: asset.uri,
      title: asset.filename.replace(".mp3", ""),
      duration: asset.duration
    }))
  }
}

export default new MusicManager()