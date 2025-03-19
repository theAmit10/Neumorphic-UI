import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BackdropBlur,
  Canvas,
  Circle,
  Fill,
  Group,
  interpolateColors,
  LinearGradient,
  Path,
  Shadow,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import Animated, {
  FadeInDown,
  FadeOutDown,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const startColors = [
  'rgba(0, 255, 255, 0.8)',
  'rgba(34,193,195,0.8)',
  'rgba(63,94,251,0.8)',
  'rgba(0,128,255,0.8)',
];
const endColors = [
  'rgba(0,212,255,1)',
  'rgba(72,61,139,1)',
  'rgba(0,191,255,1)',
  'rgba(25,25,112,1)',
];

const {height, width} = Dimensions.get('window');
const songs = [
  {id: '1', title: 'Blinding Lights', artist: 'The Weeknd'},
  {id: '2', title: 'Night Drive', artist: 'Kavinsky'},
  {id: '3', title: 'Strobe', artist: 'Deadmau5'},
  {id: '4', title: 'Midnight City', artist: 'M83'},
  {id: '5', title: 'Sunset Lover', artist: 'Petit Biscuit'},
  {id: '6', title: 'Ghosts n Stuff', artist: 'Deadmau5'},
  {id: '7', title: 'Turbo Killer', artist: 'Carpenter Brut'},
  {id: '8', title: 'The Island – Pt. 1 (Dawn)', artist: 'Pendulum'},
  {id: '9', title: 'Starboy', artist: 'The Weeknd ft. Daft Punk'},
  {id: '10', title: 'Bad Guy', artist: 'Billie Eilish'},
];

const NeumorphicButton = ({onPress, children, style}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.neumorphicButton, style]}>
      {children}
    </TouchableOpacity>
  );
};

const App = () => {
  // FOR CIRCLE ANIMATION
  const size = 200;
  const rc = useSharedValue(0);
  const cc = useDerivedValue(() => size - rc.value);
  useEffect(() => {
    rc.value = withRepeat(withTiming(size * 0.33, {duration: 5000}), -1);
  }, [rc, size]);

  const [currentSong, setCurrentSong] = useState(songs[0]);

  const waveFormPath = Skia.Path.Make();
  waveFormPath.moveTo(50, 150);
  waveFormPath.quadTo(100, 50, 150, 150);
  waveFormPath.quadTo(200, 250, 250, 150);
  waveFormPath.quadTo(300, 50, 350, 150);

  // FOR SLIDER ANIMATION
  const colorIndex = useSharedValue(0);

  useEffect(() => {
    colorIndex.value = withRepeat(
      withTiming(startColors.length - 1, {duration: 3000}),
      -1,
      true,
    );
  }, []);

  const gradientColor = useDerivedValue(() => {
    return [
      interpolateColors(colorIndex.value, [0, 1, 2, 3], startColors),
      interpolateColors(colorIndex.value, [0, 1, 2, 3], endColors),
    ];
  });

  // State for play and pause

  const [isPlaying, setIsPlaying] = useState(false);

  const tooglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const [isSliderVisible, setIsSliderVisible] = useState(false);

  // animation for song list
  const sliderTranslateY = useSharedValue(100);
  const sliderOpacity = useSharedValue(0);

  useEffect(() => {
    if (isSliderVisible) {
      sliderTranslateY.value = withSpring(0, {damping: 10, stiffness: 100});
      sliderOpacity.value = withTiming(1, {duration: 200});
    } else {
      (sliderTranslateY.value = withSpring(100)),
        (sliderOpacity.value = withTiming(0, {duration: 200}));
    }
  }, [isSliderVisible]);

  const sliderAnimationStyle = useAnimatedStyle(() => ({
    transform: [{translateY: sliderTranslateY.value}],
    opacity: sliderOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#222'} barStyle={'light-content'} />
      {/** TOP BAR */}
      <View style={styles.topbar}>
        {/*Neumorphic button  */}
        <NeumorphicButton>
          <Icon name="arrow-left" size={30} color="white" />
        </NeumorphicButton>
        <Text style={styles.nowPlaying}>Now Playing</Text>
        <NeumorphicButton onPress={() => setIsSliderVisible(!isSliderVisible)}>
          <Icon
            name={isSliderVisible ? 'close' : 'menu'}
            size={30}
            color="#fff"
          />
        </NeumorphicButton>
      </View>
      {/** TOP BALL */}
      <Canvas style={styles.canvas}>
        <Group>
          <Circle cx={size} cy={cc} r={rc} color={'#222'} />
          <Shadow dx={10} dy={10} blur={20} color={'#000'} />
          <Shadow dx={-10} dy={-10} blur={20} color={'#444'} />
        </Group>
      </Canvas>

      {/** TITLE INFO */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{currentSong.title}</Text>
        <Text style={styles.trackArtist}>{currentSong.artist}</Text>
      </View>
      {/** BOTTOM BALL */}
      <Canvas style={styles.canvas}>
        <Group>
          <Circle cx={size} cy={cc} r={rc} color={'#222'} />
          <Shadow dx={10} dy={10} blur={20} color={'#000'} />
          <Shadow dx={-10} dy={-10} blur={20} color={'#444'} />

          <LinearGradient
            start={vec(120, 120)}
            end={vec(280, 280)}
            colors={gradientColor}
          />
          {/** WAVE */}
          <Path path={waveFormPath} strokeWidth={4} colors={gradientColor} />
        </Group>
      </Canvas>
      {/** TIMER */}

      <View style={styles.timelineContainer}>
        <View style={styles.topTimelineContainer}>
          <Text style={styles.time}>1:21</Text>
          <Text style={styles.time}>3:46</Text>
        </View>

        {/** CANVAS FOR PROGRESS */}
        <Canvas style={styles.sliderCanvas}>
          <Fill>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(width, height)}
              colors={gradientColor}
            />
          </Fill>
        </Canvas>
      </View>
      {/** CONTROLLERS */}
      <View style={styles.bottomContainer}>
        <View style={styles.controlContainer}>
          <NeumorphicButton>
            <Icon name="skip-backward" size={30} color="#fff" />
          </NeumorphicButton>
          <NeumorphicButton
            style={styles.playPauseButton}
            onPress={tooglePlayPause}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={40} color="#fff" />
          </NeumorphicButton>
          <NeumorphicButton>
            <Icon name="skip-forward" size={30} color="#fff" />
          </NeumorphicButton>
        </View>
      </View>

      {/** BOTTOM SONG LIST SLIDER */}
      {isSliderVisible && (
        <>
          <Canvas style={styles.bottomSliderCanvasContainer}>
            <BackdropBlur blur={20} />
          </Canvas>
          <Animated.View
            style={[styles.bottomSliderCanvasContainer, sliderAnimationStyle]}>
            <Text style={styles.slidertext}>All Songs</Text>
            <FlatList
              data={songs}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => (
                <Animated.View
                  entering={FadeInDown.delay(index * 100)}
                  exiting={FadeOutDown.delay(index * 10)}
                  style={styles.songItem}>
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentSong(item);
                      setIsSliderVisible(false);
                      setIsPlaying(true);
                    }}>
                    <Text style={styles.songTitle}>{item.title}</Text>
                    <Text style={styles.songArtist}>{item.artist}</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  neumorphicButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#aaa',
    shadowOffset: {width: -10, height: -10},
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  nowPlaying: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '900',
    letterSpacing: 2,
  },
  canvas: {
    width: width,
    height: height * 0.26,
    position: 'relative',
  },
  trackInfo: {
    alignItems: 'center',
    marginTop: 5,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  trackArtist: {
    fontSize: 18,
    color: '#bbb',
  },
  timelineContainer: {
    height: 50,
    width: width,
  },
  topTimelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  time: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '100',
  },
  sliderCanvas: {
    width: '95%',
    height: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  controlContainer: {
    height: 100,
    width: width,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  playPauseButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#333',
  },
  bottomSliderCanvasContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(24,24,24,0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderTopColor: '#fff',
    borderWidth: 1,
    height: 400,
    elevation: 20,
  },
  slidertext: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: 3,
  },
  songItem: {
    paddingVertical: 5,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  songTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 14,
    color: '#bbb',
  },
});
