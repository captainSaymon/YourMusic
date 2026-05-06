import * as MediaLibrary from 'expo-media-library'

class MusicManager {
    async requestPermissions() {
        const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync()

        if (status === 'granted') {
            return true
        }

        if (canAskAgain) {
            const { status: retryStatus } = await MediaLibrary.requestPermissionsAsync()
            return retryStatus === 'granted'
        }
        
        return false
    }

    async scanLocalMusic() {
        const hasPermission = await this.requestPermissions()
        if(!hasPermission) {
            console.error("Brak uprawnień")
            return []
        }

        try {
            const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' })

        return media.assets.map(asset => ({
                id: asset.id,
                url: asset.uri, 
                title: asset.filename.replace(/\.[^/.]+$/, ""),
                artist: "Nieznany wykonawca",
                duration: asset.duration,
                filename: asset.filename
            }));
        }
        catch (error) {
            console.error("Błąd skanowania:", error)
            return []
        }
    }
}

export default new MusicManager()