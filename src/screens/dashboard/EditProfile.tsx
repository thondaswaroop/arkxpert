import React, { useState, useEffect } from 'react';
import { Image, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsUserLoggedIn } from '../../redux/slice/AuthSlice';
import { imagesBucket, globalStyles, authenticationStyles } from '../../Resources';
import { isEmpty, isValidEmail } from '../../utils/common/Validation';
import { useToast } from 'react-native-toast-notifications';
import { showToast } from '../../utils/common/ToastUtil';
import { httpService } from '../../services/api/Api';
import { useLoader } from '../../utils/common/LoaderContext';
import { useNavigation } from '@react-navigation/native';
import DropdownComponent from '../../components/DropDown';
import { loggerService } from '../../utils/CommonUtils';
import CustomTextInput from '../../components/UIComponents/CustomTextInput';
import { getCountries } from '../../services/sync/countries';
import { GlobalColors } from '../../styles/Colors';
import CommonHeader from '../../components/Header';

const EditProfile = () => {
  const navigation = useNavigation();
  const [fullname, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [countriesList, setCountriesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const dispatch = useDispatch();
  const toast = useToast();
  const { showLoader, hideLoader } = useLoader();
  const [userData, setUserData] = useState<any>({}); // State to hold user data
  const [loading, setLoading] = useState(true); // State to manage loading

  const ageSelectionData = [
    { label: '18-30', value: '18-30' },
    { label: '31-40', value: '31-40' },
    { label: '40+', value: '40+' }
  ];

  const relationSelectionData = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorce', value: 'Divorce' }
  ];

  useEffect(() => {
    fetchCountries();
    fetchUserProfile(); 
  }, []);
  
  const fetchUserProfile = async () => {
    showLoader();
    try {
      const userId = await AsyncStorage.getItem('UserId'); // Fetch user ID from storage
      const response: any = await httpService.post('userInfo', { userID: userId }); // Make API call
      console.log('profile response', response.userinfo);
      setFullName(response.userinfo.fullname);
      setEmail(response.userinfo.email);
      setNickName(response.userinfo.nickname);
      setAgeGroup(response.userinfo.age);
      setSelectedCountry(response.userinfo.country);
      setRelationship(response.userinfo.relationship);
      setPassword(response.userinfo.password);
      hideLoader();
    } catch (error) {
      loggerService('error', 'Error fetching user profile', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  
  async function fetchCountries() {
    try {
      const response = await getCountries();
      const mappedCountries: any = response.map((country) => ({
        label: country.name,
        value: country.name,
      }));
      setCountriesList(mappedCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }

  const updateProfile = async () => {
    const userId = await AsyncStorage.getItem('UserId'); // Fetch user ID from storage
    showLoader();
    if (isEmpty(selectedCountry)) {
      showToast('warning', toast, 'Please Select Your Country');
      hideLoader();
      return;
    } else if (isEmpty(fullname)) {
      showToast('warning', toast, 'Please Enter First Name');
      hideLoader();
      return;
    } else if (isEmpty(nickname)) {
      showToast('warning', toast, 'Please Enter Your Nick Name');
      hideLoader();
      return;
    }  else if (isEmpty(ageGroup)) {
      showToast('warning', toast, 'Please Select Your Age Group');
      hideLoader();
      return;
    } else if (isEmpty(relationship)) {
      showToast('warning', toast, 'Please Select Your Relationship Status');
      hideLoader();
      return;
    } else if (isEmpty(password)) {
      showToast('warning', toast, 'Please enter Password');
      hideLoader();
      return;
    } else {
      const data = {
        userId,
        fullname,
        age: ageGroup,
        nickname,
        relationship,
        country: selectedCountry,
        password
      };
      try {
        const response: any = await httpService.post('updatProfile', data);
        hideLoader();
        loggerService('default', 'updatProfile Response', response);
        showToast('warning', toast, response.message);
        if (response.status) {
          navigation.goBack();
        }
      } catch (error) {
        loggerService('error', 'updatProfile Error Response', error);
        hideLoader();
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={[globalStyles.mainContainer,{backgroundColor:'#fff'}]}>
        <View style={globalStyles.padding}>
          <ScrollView contentContainerStyle={globalStyles.innerContainer} showsVerticalScrollIndicator={false}>

            <View style={[{ width: '100%' }, globalStyles.mTop20]}>
              <View style={{ marginTop: 10 }}>
                <DropdownComponent
                  data={countriesList}
                  label="Country"
                  placeholder="Select Country"
                  onValueChange={(value: any) => setSelectedCountry(value)}
                  value={selectedCountry}  // Pass the initial value here
                />
              </View>
            </View>
            <View style={globalStyles.newInputContainer}>
              <CustomTextInput
                name={fullname}
                isPasswordField={false}
                placeHolder="First Name"
                setName={setFullName}
                style={globalStyles.input}
              />
              <CustomTextInput
                isPasswordField={false}
                name={nickname}
                placeHolder="Nick Name"
                setName={setNickName}
                style={globalStyles.input}
              />
            </View>

            <View style={{ width: '100%' }}>
              <DropdownComponent
                data={ageSelectionData}
                label="Age"
                placeholder="Select Age Group"
                onValueChange={(value: any) => setAgeGroup(value)}
                value={ageGroup}  // Pass the initial value here
              />
              <View style={{ marginTop: 10 }}>
                <DropdownComponent
                  data={relationSelectionData}
                  label="RelationShip Status"
                  placeholder="Select Relationship Status"
                  onValueChange={(value: any) => setRelationship(value)}
                  value={relationship}  // Pass the initial value here
                />
              </View>
            </View>

            <View style={globalStyles.newInputContainer}>
              <CustomTextInput
                name={password}
                isPasswordField={true}
                placeHolder="Password"
                setName={setPassword}
                style={globalStyles.input}
              />
            </View>

            <View style={globalStyles.buttonContainer}>
              <Button
                style={[authenticationStyles.loginButton, { borderRadius: 50 }]}
                mode="contained"
                onPress={updateProfile}
              >
                Update
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default EditProfile;
