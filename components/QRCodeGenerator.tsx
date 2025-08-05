import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  backgroundColor = '#FFFFFF',
  color = '#000000',
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <QRCode
        value={value}
        size={size}
        backgroundColor={backgroundColor}
        color={color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
  },
});
