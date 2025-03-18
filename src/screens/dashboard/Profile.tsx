import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import CommonHeader from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsUserLoggedIn } from '../../redux/slice/AuthSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Avatar, Divider, Icon, IconButton } from 'react-native-paper';
import { globalStyles, imagesBucket } from '../../Resources';
import { GlobalColors } from '../../styles/Colors';
import { socialShare } from '../../utils/CommonUtils';
import { AppEnvironment } from '../../constants/Global';
import { httpService } from '../../services/api/Api'; // Import your HTTP service here
import { loggerService } from '../../utils/CommonUtils'; // Import your logger if necessary
import { useLoader } from '../../utils/common/LoaderContext';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [userData, setUserData] = useState<any>({}); // State to hold user data
  const [loading, setLoading] = useState(true); // State to manage loading
  const { showLoader, hideLoader } = useLoader();
  const [userRank, setUserRank] = useState(0);
  const [todayScore, setTodayScore] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [selectAvatarSelection, setSelectAvatarSelection] = useState(false);

  const [isExpanded, setExpand] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('UserId'); // Fetch user ID from storage
        const response: any = await httpService.post('userInfo', { userID: userId }); // Make API call
        console.log('response', response.userinfo);
        setUserData(response.userinfo); // Set user data in state
      } catch (error) {
        loggerService('error', 'Error fetching user profile', error);
        Alert.alert('Error', 'Unable to fetch profile data.'); // Handle error
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };


    fetchUserProfile(); // Call the function to fetch user profile
    getUserLeaderBoard();
  }, []);

  const getUserLeaderBoard = async () => {
    showLoader();
    try {
      let userId = await AsyncStorage.getItem('UserId');

      // Fetch user rank from API
      const result: any = await httpService.post('getUserRank', { "userID": userId });
      loggerService('default', 'Rank Information Fetch', result);

      // Update state with the fetched rank
      setUserRank(result.rank);
      setTodayScore(result.todayScore);
      setOverallScore(result.overallScore);

      // Save the rank information locally
      await AsyncStorage.setItem('UserRank', JSON.stringify({
        rank: result.rank,
        todayScore: result.todayScore,
        overallScore: result.overallScore,
      }));

    } catch (error) {
      loggerService('error', 'Rank Information Error', error);

      // If there's an error, try to load the last saved rank from local storage
      const savedRank: any = await AsyncStorage.getItem('UserRank');
      const { rank, todayScore, overallScore } = JSON.parse(savedRank);

      if (!rank) {
        setUserRank(rank);
        setTodayScore(todayScore);
        setOverallScore(overallScore);
      } else {
        // If no saved rank exists, set defaults
        console.log('default');
        setUserRank(0);
        setTodayScore(0);
        setOverallScore(0);
      }
    } finally {
      hideLoader();
    }
  };

  const shareResult = () => {
    socialShare(
      AppEnvironment.MainLogo,
      '🚀 Level Up Your Dating Game with ArkXpert! 🚀',
      'Guys, are you ready to level up your dating game? 💪 "ArkXpert" is here to help you understand yourself better, learn what it takes to attract the woman of your dreams, and build real, lasting relationships. Dive into quizzes, read insightful stories, and become a top learner on our leaderboard! 🏆  \n\n📲 Download the app now, start your journey, and show her that you are ready for what comes next. 😉🔥 \n\n Download ArkXpert & Start Your Journey!',
      AppEnvironment.StoreLink
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('UserId');
      dispatch(setIsUserLoggedIn(false));
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during logout.');
    }
  };

  const openPage = async (page:any) => {
    // Function to handle "Know More" action
    const knowMoreURL = AppEnvironment.BaseUrl + page || '';
    loggerService('bannerURL', knowMore.name, knowMoreURL);

    if (knowMoreURL) {
      try {
        await Linking.openURL(knowMoreURL);
      } catch (error) {
        Alert.alert('Error', 'Unable to open the link.');
      }
    }
  }

  const knowMore = async () => {
    // Function to handle "Know More" action
    const knowMoreURL = AppEnvironment.BaseUrl + 'about' || '';
    loggerService('bannerURL', knowMore.name, knowMoreURL);

    if (knowMoreURL) {
      try {
        await Linking.openURL(knowMoreURL);
      } catch (error) {
        Alert.alert('Error', 'Unable to open the link.');
      }
    }
  };

  const editProfile = () => {
    // Navigate to the Edit Profile screen or handle edit profile logic
    navigation.navigate('EditProfile'); // Ensure 'EditProfile' is a valid screen in your navigator
  };



  const onScreenFocus = useCallback(() => {
    getUserInfo(); // Call the function to fetch user profile
    getUserLeaderBoard();
  }, []);

  useFocusEffect(onScreenFocus);

  const renderUserIcon = (userIcon: any) => {
    switch (userIcon) {
      case '1':
        return imagesBucket.icon1;
      case '2':
        return imagesBucket.userIcon1;
      case '3':
        return imagesBucket.userIcon2;
      case '4':
        return imagesBucket.userIcon3;
      case '5':
        return imagesBucket.userIcon4;
      case '6':
        return imagesBucket.userIcon5;
      case '7':
        return imagesBucket.userIcon6;
      default:
        return imagesBucket.icon1;
    }
  };

  const getUserInfo = async () => {
    let userId = await AsyncStorage.getItem('UserId');
    httpService.post('userInfo', { userID: userId }).then((response1: any) => {
      setUserData(response1.userinfo);
    });
  }

  const toggleQuestion = () => {
    if (isExpanded) {
      setExpand(false);
    } else {
      setExpand(true);
    }

  };

  const selectUserIcon = async (usericon: any) => {
    let userId = await AsyncStorage.getItem('UserId');

    const data = {
      'userId': userId,
      'userIcon': usericon
    }
    httpService.post('updateUserIcon', data).then(async (response: any) => {
      if (response.status) {
        getUserInfo();
        setSelectAvatarSelection(false);
      }
    });
  }

  return (
    <View style={globalStyles.mainContainer}>
      <CommonHeader />
      <View style={globalStyles.padding}>

        <Modal
          visible={selectAvatarSelection}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={globalStyles.flex}>
                  <Text style={[globalStyles.h2, globalStyles.mTop10]}>Select Your Avatar</Text>
                  <IconButton
                    icon="close" // You can use the "close" icon or any other from your icon set
                    size={20}
                    onPress={() => setSelectAvatarSelection(false)} // Close the modal
                    style={styles.closeIcon} // Optional: Add a style for spacing
                  />
                </View>
              </View>
              <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={() => selectUserIcon('2')}>
                  <Avatar.Image
                    source={renderUserIcon('2')} // Use fetched profile image
                    size={100}
                    style={styles.avatarImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectUserIcon('3')}>
                  <Avatar.Image
                    source={renderUserIcon('3')} // Use fetched profile image
                    size={100}
                    style={styles.avatarImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectUserIcon('4')}>
                  <Avatar.Image
                    source={renderUserIcon('4')} // Use fetched profile image
                    size={100}
                    style={styles.avatarImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectUserIcon('5')}>
                  <Avatar.Image
                    source={renderUserIcon('5')} // Use fetched profile image
                    size={100}
                    style={styles.avatarImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectUserIcon('6')}>
                  <Avatar.Image
                    source={renderUserIcon('6')} // Use fetched profile image
                    size={100}
                    style={styles.avatarImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectUserIcon('7')}>
                  <Avatar.Image
                    source={renderUserIcon('7')} // Use fetched profile image
                    size={100}
                    style={styles.avatarImage}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {userData && (
            <View style={globalStyles.mainContainer}>
              <View style={[styles.viewCard, globalStyles.mBottom20]}>
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={editProfile}
                >
                  <Icon source="pencil" color={GlobalColors.colors.black} size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectAvatarSelection(true)}>
                  <Avatar.Image
                    source={renderUserIcon(userData.icon)} // Use fetched profile image
                    size={100}
                    style={styles.image}
                  />
                  <View style={{ position: 'absolute', bottom: 5, right: '10%', backgroundColor: GlobalColors.colors.primaryColor, borderRadius: 50, padding: 5 }}>
                    <Icon source="pencil" color={GlobalColors.colors.white} size={20} />
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    marginStart: 10,
                  }}
                >
                  <Text style={[globalStyles.h2, globalStyles.caps]}>
                    {userData.fullname} {/* Use fetched user name */}
                  </Text>
                  <Text style={[globalStyles.smallFont]}>
                    {userData.email} {/* Use fetched user email */}
                  </Text>

                  <View style={[globalStyles.flex, globalStyles.mTop20]}>
                    <Image
                      source={imagesBucket.rank}
                      style={{ height: 30, width: 30 }}
                    />
                    <Text style={[globalStyles.h2, globalStyles.caps, { flex: 0.5, marginTop: 4 }]}>
                      &nbsp; {userRank} {/* Use fetched user rank */}
                    </Text>
                    <Image
                      source={imagesBucket.points}
                      style={{ height: 30, width: 30 }}
                    />
                    <Text style={[globalStyles.h2, globalStyles.caps, { flex: 0.5, marginTop: 4 }]}>
                      &nbsp; {overallScore} {/* Use fetched user points */}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={ styles.questionContainer}>
                <TouchableOpacity onPress={() => toggleQuestion()} >
                  <View style={[globalStyles.flex, globalStyles.mTop10]}>
                    <Text style={[globalStyles.themeTextColor, styles.questionHeader,globalStyles.mBottom10]}>Know More About ArkXpert</Text>
                  </View>
                </TouchableOpacity>
              {
                isExpanded && (
                  <View style={[globalStyles.mBottom10,globalStyles.mTop10]}>
                    <View>
                      <TouchableOpacity onPress={()=>openPage('about')}>
                        <View style={[globalStyles.flex, globalStyles.mTop10, globalStyles.generalList]}>
                          <Text style={[globalStyles.themeTextColor]}>About Us</Text>
                          <Icon
                            source="chevron-right"
                            color={GlobalColors.colors.white}
                            size={20}
                          />
                        </View>
                      </TouchableOpacity>
                      <Divider />
                    </View>
                    <View>
                      <TouchableOpacity onPress={()=>openPage('privacy')}>
                        <View style={[globalStyles.flex, globalStyles.mTop10, globalStyles.generalList]}>
                          <Text style={[globalStyles.themeTextColor]}>Privacy Policy</Text>
                          <Icon
                            source="chevron-right"
                            color={GlobalColors.colors.white}
                            size={20}
                          />
                        </View>
                      </TouchableOpacity>
                      <Divider />
                    </View>
                    <View>
                      <TouchableOpacity onPress={()=>openPage('terms')}>
                        <View style={[globalStyles.flex, globalStyles.mTop10, globalStyles.generalList]}>
                          <Text style={[globalStyles.themeTextColor]}>Terms & Conditions</Text>
                          <Icon
                            source="chevron-right"
                            color={GlobalColors.colors.white}
                            size={20}
                          />
                        </View>
                      </TouchableOpacity>
                      <Divider />
                    </View>
                    <View>
                      <TouchableOpacity onPress={()=>openPage('disclaimer')}>
                        <View style={[globalStyles.flex, globalStyles.mTop10, globalStyles.generalList]}>
                          <Text style={[globalStyles.themeTextColor]}>Disclaimer</Text>
                          <Icon
                            source="chevron-right"
                            color={GlobalColors.colors.white}
                            size={20}
                          />
                        </View>
                      </TouchableOpacity>
                      <Divider />
                    </View>
                  </View>
                )
              }
              </View>

              <View>
                <TouchableOpacity onPress={shareResult}>
                  <View style={[globalStyles.flex, globalStyles.mTop10, globalStyles.generalList]}>
                    <Text style={[globalStyles.themeTextColor]}>Share our App</Text>
                    <Icon
                      source="chevron-right"
                      color={GlobalColors.colors.white}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>
                <Divider />
              </View>

              <View>
                <TouchableOpacity onPress={handleLogout}>
                  <View style={[globalStyles.flex, globalStyles.mTop10, globalStyles.generalList]}>
                    <Text style={[globalStyles.themeTextColor]}>Logout</Text>
                    <Icon
                      source="chevron-right"
                      color={GlobalColors.colors.white}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>
                <Divider />
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={[globalStyles.quizButtomButton]}>
        <Text style={[globalStyles.themeTextColor, globalStyles.smallFont]}>
          {`Version 0.1`}
        </Text>
        <Text style={[globalStyles.themeTextColor, globalStyles.smallFont]}>
          {`Published by PMGS Technology`}
        </Text>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  expandedContent: {
    marginTop: 20,
  },
  questionContainer: {
    backgroundColor: '#1c1c1c', // Dark background for the accordion container
    borderRadius: 3,
    borderWidth: 0.2,
    borderColor: GlobalColors.colors.white,
    marginVertical: 8,
    padding: 15,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewCard: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    height: 200,
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    resizeMode: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow items to wrap onto the next line
    justifyContent: 'space-between', // Optional: Adds space between the images
  },
  avatarImage: {
    margin: 20,
    width: 100,
    height: 100
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },

  modalHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: GlobalColors.colors.lightGrey,
    padding: 10,
  },
  closeIcon: {
    marginLeft: 10,
  },
});
