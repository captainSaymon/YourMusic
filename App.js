import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import MusicManager from './src/managers/MusicManager'
import AudioController from './src/controllers/AudioController'

export default function App() {
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)

  useEffect(() => {
    const setup = async () => {
      await AudioController.init()
      const music = await MusicManager.scanLocalMusic()
      setSongs(music)
    };
    setup()
  }, [])

  const handlePress = async (song) => {
    setCurrentSong(song.title)
    await AudioController.loadAndPlay(song.uri)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Twoja Muzyka</Text>
      
      {currentSong && (
        <View style={styles.nowPlaying}>
          <Text style={styles.nowPlayingText}>Gram: {currentSong}</Text>
          <TouchableOpacity onPress={() => AudioController.togglePlay()}>
            <Text style={styles.playBtn}>⏯ Pauza / Graj</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
            <Text>{item.title}</Text>
            <Text style={styles.duration}>{(item.duration / 60).toFixed(2)} min</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#f5f5f5'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  item: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  duration: {
    color: '#888'
  },
  nowPlaying: {
    padding: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center'
  },
  nowPlayingText: {
    fontWeight: 'bold',
    marginBottom: 10
  },
  playBtn: {
    color: 'blue',
    fontSize: 18
  }
});