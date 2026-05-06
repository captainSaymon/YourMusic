import TrackPlayer, { Capability } from "react-native-track-player"

class AudioContoller {
    async init() {
        try {
            await TrackPlayer.setupPlayer()
            await TrackPlayer.updateOptions({
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.Stop,
                ],
                compactCapabilities: [Capability.Play, Capability.Pause],   
            })
        }
        catch (e) {
            console.log(e)
        }
    }

    async loadPlaylist(songs) {
        const formattedTracks = songs.map(song => ({
            id: song.id,
            url: song.url,
            title: song.title,
            artist: song.artist,
            duration: song.duration
        }));

        await TrackPlayer.reset()
        await TrackPlayer.add(formattedTracks)
    }

    async play() {
        await TrackPlayer.play()
    }

    async pause() {
        await TrackPlayer.pause()
    }
}

export default new AudioContoller()