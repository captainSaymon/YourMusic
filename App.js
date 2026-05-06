import React, { useEffect, useState } from 'react'
import { View, Text, Button, FlatList } from 'react-native'
import MusicManager from './src/managers/MusicManager'
import AudioController from './src/controllers/AudioController'

export default function App() {
  const [songs, setSongs] = useState([])

  useEffect(() => {
      setupApp()
    }, [])

  const setupApp = async () => {
      await AudioController.init();
      const allAudio = await MusicManager.scanLocalMusic()
      setSongs(allAudio)
    }

  const handlePlay = async (song) => {
      await AudioController.loadPlaylist([song])
      await AudioController.play()
    }


  return (
      <View style={styles.container}>
        <Text style={styles.title}>Music Folder</Text>
        
        <Button title="Start" onPress={handlePlayMusic} />

        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePlay(item)} style={{ padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}>
                <Text style={{ fontWeight: '500' }}>{item.filename}</Text>
                <Text style={{ color: 'gray', fontSize: 12 }}>
                  {(item.duration / 60).toFixed(2)} min
                </Text>
              </TouchableOpacity>
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
