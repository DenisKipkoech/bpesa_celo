import React, { useRef, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Dimensions, 
  TouchableOpacity, 
  Text 
} from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingSlide } from '@/components/OnboardingSlide';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Private and Secure Payments',
    description: 'Send and receive money with complete privacy and security.',
    illustration: 'security',
  },
  {
    id: '2',
    title: 'Low Fees, Fast Transfers',
    description: 'Enjoy near zero transaction fees and lightning-fast transfers in any currency.',
    illustration: 'speed',
  },
  // {
  //   id: '3',
  //   title: 'Your M-Pesa on Web3',
  //   description: 'Experience the familiar mobile money service with the added benefits of blockchain technology.',
  //   illustration: 'blockchain',
  // },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/get-started');
    }
  };

  const handleSkip = () => {
    router.replace('/get-started');
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <OnboardingSlide
      title={item.title}
      description={item.description}
      illustration={item.illustration}
    />
  );

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          {currentIndex < slides.length - 1 ? (
            <>
              <TouchableOpacity onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <Button title="Next" onPress={handleNext} />
            </>
          ) : (
            <Button 
              title="Get Started" 
              onPress={handleNext} 
              fullWidth 
              size="large"
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 20,
    backgroundColor: Colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});