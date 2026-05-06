import React, { useEffect, useState } from 'react'
import { View, Text, Button, FlatList } from 'react-native'
import MusicManager from './src/managers/MusicManager'
import AudioController from './src/controllers/AudioController'

export default function App() {
  const [songs, setSongs] = useState([])

  useEffect(() => {
      const setup = async () => {
        await AudioController.init()
        const localSongs = await MusicManager.scanLocalMusic()
        setSongs(localSongs)
      };
      setup()
    }, [])

  const handlePlayMusic = async () => {
      if (songs.length > 0) {
        await AudioController.loadPlaylist(songs)
        await AudioController.play()
      }
    }


  return (
      <View style={styles.container}>
        <Text style={styles.title}>Music Folder</Text>
        
        <Button title="Start" onPress={handlePlayMusic} />

        <FlatList
          data={songs}
          keyExtractor={(item) => item.path}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text>{item.title || "Piosenka"}</Text>
            </View>
          )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6600a1',
    alignItems: 'center',
    paddingTop: 50,
    justifyContent: 'center',
  },

  title: {
    color: 'white',
    fontSize: 46,
    marginBottom: 20,
    fontWeight: 'bold'
  }
});
