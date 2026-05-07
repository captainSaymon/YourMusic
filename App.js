import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import MusicManager from './src/managers/MusicManager'
import AudioController from './src/controllers/AudioController'

export default function App() {
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [currentDuration, setCurrentDuration] = useState(null)
  const [currentTime, setCurrentTime] = useState(null)
  const [isPlaying, setPlaying] = useState(null)

  useEffect(() => {
    const setup = async () => {
      await AudioController.init()
      const music = await MusicManager.scanLocalMusic()
      setSongs(music)
    };
    setup()

    AudioController.setTimeListener((time) => {
      setCurrentTime(time);
    });

  }, [])

  const convertToTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00'
    
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds
    
    return `${minutes}:${displaySeconds}`
  };

  const handlePress = async (song) => {
    setPlaying(false)
    setCurrentSong(song.title)
    setCurrentDuration(convertToTime(song.duration))
    await AudioController.loadAndPlay(song.uri)
  };

  function handlePlayingPress() {
    AudioController.togglePlay()
    setPlaying(prev => !prev)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>YourMusic</Text>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
            <Text style={styles.musicTitles}>{item.title}</Text>
            <Text style={styles.duration}>{convertToTime(item.duration)}</Text>
          </TouchableOpacity>
        )}
      />

      {currentSong && (
        <View style={styles.nowPlaying}>
          <Text style={styles.nowPlayingText}>{currentSong}</Text>
          <View style={styles.nowPlayingTimeContainer}>
            <Text style={styles.nowPlayingTime}>{convertToTime(currentTime)}</Text>
            <Text style={styles.nowPlayingDuration}>{currentDuration}</Text>
          </View>
          <TouchableOpacity onPress={handlePlayingPress}>
            <Text style={styles.playBtn}>{isPlaying ? 'PLAY' : 'STOP'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 60,
    paddingBottom: 50,
    backgroundColor: '#f5f5f5'
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  item: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 40,
    minHeight: 70,
    marginBottom: 3
  },
  musicTitles: {
    flex: 1
  },
  duration: {
    color: '#888'
  },


  nowPlaying: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    maxHeight: 130,
    borderRadius: 20
  },
  nowPlayingText: {
    fontWeight: 'bold',
    width: '100%',
    marginBottom: 10
  },
  nowPlayingTimeContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  nowPlayingTime: {
  },
  nowPlayingDuration: {
  },
  playBtn: {
    color: 'blue',
    fontSize: 18
  }
});