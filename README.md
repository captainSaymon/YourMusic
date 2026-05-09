# YourMusic
To aplikacja mobilna w react neative, która umożliwia odtwarzanie muzyki zapisanej w pamięci urządzenia.
Po uruchomieniu aplikacja po zatwierdzeniu uprawnień ma dostęp do plików i automatycznie wyszukuje folderu **Music**.
W tym folderze powinny sie znajdować pliki **.mp3** lub inne foldery (albumy), które zawierają piosenki.
Następnie aplikacja odczyta listę dostępnych piosenek/albumów i umożliwi ich odtwarzanie.
Piosenki będą mogły działać w tle.

## Interfejs odtwarzania
Aplikacja posiada prosty interfejs użytkownika, który pozwala na przeglądanie i sterowaniem odtawrzania:
- play
- pause
- next
- previus

## Biblioteki

| Nazwa pakietu | Wersja | Zastosowanie |
| :--- | :--- | :--- |
| `expo` | ~54.0.33 | Główny framework i zestaw narzędzi do aplikacji |
| `expo-av` | ~16.0.8 | Obsługa multimediów |
| `expo-media-library` | ~18.2.1 | Zarządzanie zdjęciami w galerii urządzenia |
| `react-native` | 0.81.5 | Framework do kompilacji komponentów JS na natywne widoki mobilne |
| `react-native-blob-util` | ^0.24.7 | Zaawansowane operacje na plikach |
| `react-native-permissions` | ^5.5.1 | Obsługa uprawnień systemowych |
