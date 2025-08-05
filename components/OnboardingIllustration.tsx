import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Circle, Rect, Path, G, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const illustrationSize = width * 0.8;

interface OnboardingIllustrationProps {
  type: string;
}

export const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({ type }) => {
  const renderSecurityIllustration = () => (
    <Svg width={illustrationSize} height={illustrationSize} viewBox="0 0 300 300">
      {/* Shield background */}
      <Path
        d="M150 50 L200 80 L200 160 Q200 200 150 230 Q100 200 100 160 L100 80 Z"
        fill={Colors.primaryLight}
        opacity={0.3}
      />
      {/* Shield outline */}
      <Path
        d="M150 50 L200 80 L200 160 Q200 200 150 230 Q100 200 100 160 L100 80 Z"
        fill="none"
        stroke={Colors.primary}
        strokeWidth={3}
      />
      {/* Lock icon */}
      <Rect x="135" y="130" width="30" height="25" rx="3" fill={Colors.primary} />
      <Path
        d="M140 130 L140 120 Q140 110 150 110 Q160 110 160 120 L160 130"
        fill="none"
        stroke={Colors.primary}
        strokeWidth={3}
      />
      {/* Checkmark */}
      <Path
        d="M135 145 L145 155 L165 135"
        fill="none"
        stroke={Colors.background}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Floating security elements */}
      <Circle cx="80" cy="100" r="8" fill={Colors.success} opacity={0.7} />
      <Circle cx="220" cy="120" r="6" fill={Colors.info} opacity={0.7} />
      <Circle cx="70" cy="180" r="5" fill={Colors.secondary} opacity={0.7} />
      <Circle cx="230" cy="180" r="7" fill={Colors.warning} opacity={0.7} />
    </Svg>
  );

  const renderSpeedIllustration = () => (
    <Svg width={illustrationSize} height={illustrationSize} viewBox="0 0 300 300">
      {/* Phone 1 */}
      <Rect x="60" y="100" width="50" height="80" rx="8" fill={Colors.card} stroke={Colors.border} strokeWidth={2} />
      <Circle cx="85" cy="130" r="15" fill={Colors.primary} />
      <Rect x="70" y="150" width="30" height="4" rx="2" fill={Colors.border} />
      <Rect x="70" y="160" width="20" height="4" rx="2" fill={Colors.border} />
      
      {/* Phone 2 */}
      <Rect x="190" y="100" width="50" height="80" rx="8" fill={Colors.card} stroke={Colors.border} strokeWidth={2} />
      <Circle cx="215" cy="130" r="15" fill={Colors.success} />
      <Rect x="200" y="150" width="30" height="4" rx="2" fill={Colors.border} />
      <Rect x="200" y="160" width="20" height="4" rx="2" fill={Colors.border} />
      
      {/* Transfer arrow */}
      <Path
        d="M120 140 L180 140"
        stroke={Colors.primary}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Path
        d="M170 130 L180 140 L170 150"
        stroke={Colors.primary}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Speed lines */}
      <Path d="M130 120 L160 120" stroke={Colors.primary} strokeWidth={2} opacity={0.6} />
      <Path d="M135 130 L155 130" stroke={Colors.primary} strokeWidth={2} opacity={0.4} />
      <Path d="M130 160 L160 160" stroke={Colors.primary} strokeWidth={2} opacity={0.6} />
      
      {/* Money symbols */}
      <Circle cx="150" cy="90" r="12" fill={Colors.success} opacity={0.8} />
      <SvgText x="150" y="95" textAnchor="middle" fontSize="12" fill={Colors.background} fontWeight="bold"></SvgText>
    </Svg>
  );

  const renderBlockchainIllustration = () => (
    <Svg width={illustrationSize} height={illustrationSize} viewBox="0 0 300 300">
      {/* Blockchain blocks */}
      <G>
        {/* Block 1 */}
        <Rect x="50" y="120" width="40" height="40" rx="4" fill={Colors.primary} opacity={0.8} />
        <Circle cx="70" cy="140" r="8" fill={Colors.background} />
        
        {/* Block 2 */}
        <Rect x="110" y="120" width="40" height="40" rx="4" fill={Colors.secondary} opacity={0.8} />
        <Circle cx="130" cy="140" r="8" fill={Colors.background} />
        
        {/* Block 3 */}
        <Rect x="170" y="120" width="40" height="40" rx="4" fill={Colors.info} opacity={0.8} />
        <Circle cx="190" cy="140" r="8" fill={Colors.background} />
        
        {/* Block 4 */}
        <Rect x="230" y="120" width="40" height="40" rx="4" fill={Colors.warning} opacity={0.8} />
        <Circle cx="250" cy="140" r="8" fill={Colors.background} />
      </G>
      
      {/* Connection lines */}
      <Path d="M90 140 L110 140" stroke={Colors.text} strokeWidth={3} opacity={0.6} />
      <Path d="M150 140 L170 140" stroke={Colors.text} strokeWidth={3} opacity={0.6} />
      <Path d="M210 140 L230 140" stroke={Colors.text} strokeWidth={3} opacity={0.6} />
      
      {/* M-Pesa logo representation */}
      <Circle cx="150" cy="80" r="25" fill={Colors.success} />
      <SvgText x="150" y="88" textAnchor="middle" fontSize="16" fill={Colors.background} fontWeight="bold">M</SvgText>
      
      {/* Web3 elements */}
      <Circle cx="100" cy="200" r="20" fill={Colors.primaryLight} opacity={0.7} />
      <SvgText x="100" y="207" textAnchor="middle" fontSize="12" fill={Colors.primary} fontWeight="bold">3.0</SvgText>
      
      <Circle cx="200" cy="200" r="20" fill={Colors.primaryLight} opacity={0.7} />
      <Path
        d="M190 195 L200 185 L210 195 L205 200 L195 200 Z"
        fill={Colors.primary}
      />
      
      {/* Connecting lines to main chain */}
      <Path d="M150 105 L150 120" stroke={Colors.text} strokeWidth={2} strokeDasharray="5,5" opacity={0.5} />
      <Path d="M120 180 L130 160" stroke={Colors.text} strokeWidth={2} strokeDasharray="5,5" opacity={0.5} />
      <Path d="M180 180 L170 160" stroke={Colors.text} strokeWidth={2} strokeDasharray="5,5" opacity={0.5} />
    </Svg>
  );

  const renderIllustration = () => {
    switch (type) {
      case 'security':
        return renderSecurityIllustration();
      case 'speed':
        return renderSpeedIllustration();
      case 'blockchain':
        return renderBlockchainIllustration();
      default:
        return renderSecurityIllustration();
    }
  };

  return (
    <View style={styles.container}>
      {renderIllustration()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: illustrationSize,
    height: illustrationSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
});