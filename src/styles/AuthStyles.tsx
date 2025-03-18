import { StyleSheet } from 'react-native';
import { GlobalColors } from './Colors';

export const authenticationStyles = StyleSheet.create({
    loginContainer: {
        flex: 1, // This makes the View take up the full screen
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    inputText: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    loginButton: {
        marginTop: 10,
        width:'100%',
        borderRadius: 0
    },
    logoContainer: {
        margin: 10,
        left:-40,
        width: '100%',
        paddingHorizontal: '30%'
    },
    logoImage: {
        width: 250,
        height: 100,
        textAlign: 'center'
    },
    input:{
        height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    }

});
