import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';
import { OnboardingIllustration } from '@/components/OnboardingIllustration';

const { width } = Dimensions.get('window');

interface OnboardingSlideProps {
  title: string;
  description: string;
  illustration: string;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  illustration,
}) => {
  return (
    <View style={styles.container}>
      <OnboardingIllustration type={illustration} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});