import ReactNativeBlobUtil from "react-native-blob-util"
import MusicFiles from 'react-native-get-music-files'
import { PermissionsAndroid, Platform } from "react-native"

class MusicManager {
    constructor() {
        this.musicPath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/Music`
    }

    async requestPermissions() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
            ])

            return granted['android.permission.READ_MEDIA_AUDIO'] === 'granted' || granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
        }
        return true
    }

    async scanLocalMusic() {
        const hasPermission = await this.requestPermissions()
        if(!hasPermission) {
            console.error("Brak uprawnień")
            return []
        }

        try {
            const tracks = await MusicFiles.getAll({
                cover: true,
                batchSize: 20,
                batchNumber: 1,
                minimumSongDuration: 10000,
            })
            return tracks.filter(track => track.path.includes('/Download/Music'))
        }
        catch (error) {
            console.error("Błąd skanowania:", error)
            return []
        }
    }
}

export default new MusicManager();