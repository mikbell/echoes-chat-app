import { Alert } from 'react-native';

// Simple toast implementation using React Native Alert
// You can replace this with a more sophisticated toast library like react-native-toast-message
export const showToast = (message, type = 'info') => {
  const title = {
    success: '✅ Success',
    error: '❌ Error',
    warning: '⚠️ Warning',
    info: 'ℹ️ Info',
  }[type] || 'Info';

  Alert.alert(title, message, [
    {
      text: 'OK',
      style: type === 'error' ? 'destructive' : 'default',
    },
  ]);
};

export const showConfirmDialog = (title, message, onConfirm) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: onConfirm,
        style: 'destructive',
      },
    ]
  );
};
