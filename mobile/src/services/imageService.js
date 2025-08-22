import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert, Platform } from 'react-native';
import api from './api';
import { showToast } from '../utils/toast';

class ImageService {
  constructor() {
    this.requestPermissions();
  }

  // Richiedi permissions per camera e gallery
  async requestPermissions() {
    try {
      // Permissions per la gallery
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryPermission.status !== 'granted') {
        console.warn('Permission per gallery non garantita');
      }

      // Permissions per la camera
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        console.warn('Permission per camera non garantita');
      }
    } catch (error) {
      console.error('Errore richiesta permissions:', error);
    }
  }

  // Mostra dialog per scegliere sorgente immagine
  async pickImage() {
    return new Promise((resolve) => {
      Alert.alert(
        'Seleziona Immagine',
        'Da dove vuoi scegliere l\'immagine?',
        [
          {
            text: 'Annulla',
            style: 'cancel',
            onPress: () => resolve(null),
          },
          {
            text: 'Galleria',
            onPress: () => this.pickFromGallery().then(resolve),
          },
          {
            text: 'Camera',
            onPress: () => this.pickFromCamera().then(resolve),
          },
        ],
        { cancelable: true, onDismiss: () => resolve(null) }
      );
    });
  }

  // Seleziona dalla galleria
  async pickFromGallery() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        return await this.processImage(result.assets[0]);
      }
      return null;
    } catch (error) {
      console.error('Errore selezione da galleria:', error);
      showToast('Errore nell\'apertura della galleria');
      return null;
    }
  }

  // Scatta foto con camera
  async pickFromCamera() {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        return await this.processImage(result.assets[0]);
      }
      return null;
    } catch (error) {
      console.error('Errore apertura camera:', error);
      showToast('Errore nell\'apertura della camera');
      return null;
    }
  }

  // Processa e ottimizza l'immagine
  async processImage(imageAsset) {
    try {
      let processedImage = imageAsset;

      // Comprimi immagine se troppo grande
      if (imageAsset.fileSize > 2 * 1024 * 1024) { // > 2MB
        console.log('Compressione immagine...');
        
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          imageAsset.uri,
          [
            // Ridimensiona se troppo grande
            { resize: { width: 1200 } }
          ],
          {
            compress: 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

        processedImage = {
          ...imageAsset,
          uri: manipulatedImage.uri,
          fileSize: await this.getFileSize(manipulatedImage.uri),
        };
      }

      return {
        uri: processedImage.uri,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
        size: processedImage.fileSize || 0,
      };
    } catch (error) {
      console.error('Errore elaborazione immagine:', error);
      showToast('Errore nell\'elaborazione dell\'immagine');
      return null;
    }
  }

  // Ottieni dimensione file (utility)
  async getFileSize(uri) {
    try {
      const response = await fetch(uri, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength) : 0;
    } catch (error) {
      return 0;
    }
  }

  // Upload immagine al server
  async uploadImage(imageData, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageData.uri,
        type: imageData.type,
        name: imageData.name,
      });

      console.log('Upload immagine al server...');

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      console.log('✅ Upload completato:', response.data);
      return {
        success: true,
        imageUrl: response.data.imageUrl,
        publicId: response.data.publicId,
      };
    } catch (error) {
      console.error('❌ Errore upload immagine:', error);
      const message = error.response?.data?.message || 'Errore nell\'upload dell\'immagine';
      showToast(message);
      return {
        success: false,
        error: message,
      };
    }
  }

  // Crea anteprima locale per UI immediata
  createImagePreview(imageData) {
    return {
      id: Date.now().toString(),
      uri: imageData.uri,
      type: 'image',
      uploading: true,
      progress: 0,
    };
  }

  // Comprimi immagine per dimensioni specifiche
  async compressImage(uri, options = {}) {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.8,
    } = options;

    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [
          { resize: { width: maxWidth, height: maxHeight } }
        ],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return manipulatedImage.uri;
    } catch (error) {
      console.error('Errore compressione:', error);
      return uri; // Ritorna URI originale se compressione fallisce
    }
  }

  // Verifica se il file è un'immagine valida
  isValidImageType(type) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(type?.toLowerCase());
  }

  // Verifica dimensione file
  isValidFileSize(size, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  }

  // Ottieni info immagine
  async getImageInfo(uri) {
    try {
      const response = await fetch(uri, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');
      
      return {
        size: contentLength ? parseInt(contentLength) : 0,
        type: contentType || 'image/jpeg',
      };
    } catch (error) {
      console.error('Errore info immagine:', error);
      return { size: 0, type: 'image/jpeg' };
    }
  }
}

// Istanza singleton
const imageService = new ImageService();

export default imageService;
