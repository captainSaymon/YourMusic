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
            console.log(e);
        }
    }

    async loadPlayList(tracks) {
        const formattedTracks = tracks.map((t, index) => ({
            id: index.toString(),
            url: `file://${t.path}`,
            title: t.title || "Nieznany utwór",
            artist: t.author || "Nieznany artysta",
            artwork: t.cover || null,
        }))

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