import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import MusicManager from './src/managers/MusicManager'
import AudioController from './src/controllers/AudioController'

export default function App() {
  const [songs, setSongs] = useState([])
  const [info, setInfo] = useState([null])
  const [currentSong, setCurrentSong] = useState(null)
  const [currentDuration, setCurrentDuration] = useState(null)
  const [currentTime, setCurrentTime] = useState(null)
  const [isPlaying, setPlaying] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const setup = async () => {
      await AudioController.init()
      const music = await MusicManager.scanLocalMusic()
      if(music == false) {
        setInfo("Brak folderu Music")
      }
      else {
        setSongs(music)
      }
    }

    setup()

    AudioController.onPlayStateChange = (state) => {
      setPlaying(state)
    }

    AudioController.setTimeListener((time) => {
      setCurrentTime(time)
    })

    AudioController.onSongFinish = () => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1

        if (nextIndex >= songs.length) return prev

        const nextSong = songs[nextIndex]

        AudioController.loadAndPlay(nextSong.uri)

        setCurrentSong(nextSong.title)
        setCurrentDuration(convertToTime(nextSong.duration))

        return nextIndex
      })
    }

  }, [songs])

  const changePlayingSong = async (direction = 1) => {
    const nextIndex = currentIndex + direction

    if (nextIndex < 0 || nextIndex >= songs.length) return

    const nextSong = songs[nextIndex]

    setCurrentIndex(nextIndex)
    setCurrentSong(nextSong.title)
    setCurrentDuration(convertToTime(nextSong.duration))

    await AudioController.loadAndPlay(nextSong.uri)
  }

  const convertToTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00'

    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds

    return `${minutes}:${displaySeconds}`
  }

  const handlePress = async (song, index) => {
    setPlaying(false)
    setCurrentIndex(index)
    setCurrentSong(song.title)
    setCurrentDuration(convertToTime(song.duration))

    await AudioController.loadAndPlay(song.uri)
  }

  function handlePlayingPress() {
    AudioController.togglePlay()
  }

  function handleNextPress() {
    changePlayingSong(1)
  }

  function handlePrevPress() {
    changePlayingSong(-1)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>YourMusic</Text>
      {info && (
        <View>
          <Text style={styles.infoText}>{info}</Text>
        </View>
      )}

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item, index)}>
            <Text style={styles.musicTitles}>{item.title}</Text>
            <Text style={styles.duration}>{convertToTime(item.duration)}</Text>
          </TouchableOpacity>
        )}
      />

      {currentSong && (
        <View style={styles.nowPlaying}>
          <View style={styles.nowPlayingContainer}>
            <Text style={styles.nowPlayingText}>{currentSong}</Text>
          </View>

          <View style={styles.nowPlayingTimeContainer}>
            <Text style={styles.nowPlayingTime}>{convertToTime(currentTime)}</Text>
            <Text style={styles.nowPlayingDuration}>{currentDuration}</Text>
          </View>

          <View style={styles.containerButtons}>
            <TouchableOpacity onPress={handlePrevPress}>
              <Text style={styles.prevBtn}>PREV</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePlayingPress}>
              <Text style={styles.playBtn}>{isPlaying ? 'STOP' : 'PLAY'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNextPress}>
              <Text style={styles.nextBtn}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
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
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
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
  nowPlayingContainer: {
    width: '100%',
    height: 40, 
    justifyContent: 'center', 
  },
  nowPlayingText: {
    fontWeight: 'bold',
    fontSize: 15
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


  containerButtons: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  playBtn: {
    color: 'blue',
    fontSize: 18
  },
  nextBtn: {
    color: 'blue',
    fontSize: 15
  },
  prevBtn: {
    color: 'blue',
    fontSize: 15
  }
})