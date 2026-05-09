import React, { useEffect, useState, useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import MusicManager from './src/managers/MusicManager'
import AudioController from './src/controllers/AudioController'

export default function App() {
  const [songs, setSongs] = useState([])
  const [info, setInfo] = useState(null)
  const [currentSong, setCurrentSong] = useState(null)
  const [currentDuration, setCurrentDuration] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setPlaying] = useState(false) 
  const [currentIndex, setCurrentIndex] = useState(0)
  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState(null)

  const allSongs = useMemo(() => {
    return albums.flatMap(album => album.songs)
  }, [albums])

  const convertToTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00'

    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)

    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds
    return `${minutes}:${displaySeconds}`
  }

  useEffect(() => {
    const setup = async () => {
      await AudioController.init()
      const music = await MusicManager.scanLocalMusic()

      if (music == false) {
        setInfo("Brak folderu Music")
      } else {
        setAlbums(music)
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
  }, [])

  useEffect(() => {
    AudioController.onSongFinish = async () => {
      const nextIndex = currentIndex + 1
      if (nextIndex < allSongs.length) {
        const nextSong = allSongs[nextIndex]
        setCurrentIndex(nextIndex)
        setCurrentSong(nextSong.title)
        setCurrentDuration(convertToTime(nextSong.duration))
        await AudioController.loadAndPlay(nextSong.uri)
      }
    }
  }, [allSongs, currentIndex])

  const changePlayingSong = async (direction = 1) => {
    const nextIndex = currentIndex + direction
    if (nextIndex < 0 || nextIndex >= allSongs.length) return

    const nextSong = allSongs[nextIndex]
    setCurrentIndex(nextIndex)
    setCurrentSong(nextSong.title)
    setCurrentDuration(convertToTime(nextSong.duration))
    await AudioController.loadAndPlay(nextSong.uri)
  }

  const handlePress = async (song, index) => {
    setPlaying(true)
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

  const toggleAlbum = (albumName) => {
  if (selectedAlbum === albumName) {
    setSelectedAlbum(null)
  }
  else {
    setSelectedAlbum(albumName)
  }
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
        data={albums}
        keyExtractor={(item) => item.album}
        renderItem={({ item }) => {
          const isExpanded = selectedAlbum === item.album

          return (
            <View style={styles.albumContainer}>
              <TouchableOpacity onPress={() => toggleAlbum(item.album)}>
                <Text style={styles.albumTitle}>{item.album}</Text>
              </TouchableOpacity>

              {isExpanded && item.songs.map((song) => {
                const globalIndex = allSongs.findIndex(s => s.id === song.id)
                return (
                  <TouchableOpacity
                    key={song.id}
                    style={styles.item}
                    onPress={() => handlePress(song, globalIndex)}>
                    <Text style={styles.musicTitles}>{song.title}</Text>
                    <Text style={styles.duration}>{convertToTime(song.duration)}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          )
        }}
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
  albumContainer: {
    marginBottom: 20
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10
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
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10
  },
  nowPlayingTime: {},
  nowPlayingDuration: {},
  containerButtons: {
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