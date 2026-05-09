import * as MediaLibrary from 'expo-media-library'

class MusicManager {
  async scanLocalMusic() {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status !== 'granted') return false

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

    const albums = {}

    musicFiles.forEach(asset => {
      const uri = asset.uri
      const parts = uri.split('/')

      const musicIndex = parts.findIndex(part => part.toLowerCase() === 'music')

      let albumName = 'Musics'
      if (musicIndex !== -1 && parts.length > musicIndex + 2) {
        albumName = parts[musicIndex+1]
      }

      if(!albums[albumName]){
        albums[albumName] = []
      }

      albums[albumName].push({
        id: asset.id,
        uri: asset.uri,
        title: asset.filename.replace(".mp3", ""),
        duration: asset.duration
      })
    })

    return Object.keys(albums).map(album => ({album, songs: albums[album]}))
  }
}

export default new MusicManager()