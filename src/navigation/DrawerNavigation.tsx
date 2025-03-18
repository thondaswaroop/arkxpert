import * as React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Home from '../screens/dashboard/Home';
import { useDispatch } from 'react-redux';
import { setLogoutAction } from '../redux/slice/AuthSlice';
import { clearSession } from '../utils/CommonUtils';


const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(setLogoutAction());
        clearSession();
    };

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem label="Home" onPress={() => props.navigation.navigate('Home')} />
            <DrawerItem label="Notifications" onPress={() => props.navigation.navigate('Notifications')} />
            <DrawerItem label="Logout" onPress={handleLogout} />
        </DrawerContentScrollView>
    );
};


const DrawerNavigation = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={Home} />
        </Drawer.Navigator>
    );
};


export default DrawerNavigation;