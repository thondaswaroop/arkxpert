import { StyleSheet } from 'react-native';
import { GlobalColors } from './Colors';

export const globalStyles = StyleSheet.create({
    introBg: {
        backgroundColor: GlobalColors.colors.white,
        flex: 1, // This makes the View take up the full screen
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    headerButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#eee'
    },
    mainImageBgContainer: {
        flex: 1
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent overlay for readability
      },
    topicViewImageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    topicViewImage: {
        width: '50%',
        height: 300,
        borderRadius: 8,
    },
    introHeading: {
        color: '#fff', // White text color
        fontSize: 20,
    },
    introParagraph: {
        fontSize: 16,
        color: GlobalColors.colors.primaryGrey,
        textAlign: 'center',
        marginBottom: 40,
    },
    buttonWrapper: {
        backgroundColor: GlobalColors.colors.primaryWhite,
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        margin: 10,
        width: '100%',
        paddingHorizontal: '30%'
    },
    logoImage: {
        width: 200,
        height: 200,
        textAlign: 'center'
    },
    body: {
        padding: 10,
        flex: 1
    },
    studentImage: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ccc'
    },
    padding: {
        padding: 10
    },
    textCenter: {
        textAlign: 'center',
    },
    textEnd: {
        alignItems: 'flex-end',
        textAlign: 'right',
    },
    textStart: {
        alignItems: 'flex-start',
    },
    p: {
        padding: 5,
        margin: 2,
        fontSize: 11,
    },
    smallFont: {
        margin: 2,
        fontSize: 11,
    },
    mediumFont: {
        padding: 2,
        fontSize: 14,
    },
    bold: {
        fontWeight: 'bold',
    },
    h1: {
        fontWeight: 'bold',
        color: GlobalColors.colors.secondaryBlack,
        fontSize: 25,
        marginBottom: 5,
    },
    h2: {
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 5,
    },
    h3:{
        fontWeight: 'bold',
        fontSize: 13,
        marginBottom: 5,
    },
    normalFont:{
        fontSize: 15,
        marginBottom: 5,
        lineHeight:20
    },
    caps: {
        textTransform: 'uppercase',
    },
    mTop10: {
        marginTop: 10,
    },
    mTop20: {
        marginTop: 20,
    },
    mTop50: {
        marginTop: 50,
    },
    mTop100: {
        marginTop: 100,
    },
    mBottom2: {
        marginBottom: 2
    },
    mBottom20: {
        marginBottom: 20,
    },
    mBottom10: {
        marginBottom: 10,
    },
    mLeft20: {
        marginLeft: 20
    },
    mRight10: {
        marginRight: 10
    },
    mRight20: {
        marginRight: 20
    },
    mRight30: {
        marginRight: 30
    },
    sectionTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        padding: 15,
    },
    cards: {
        width: '50%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 5,
        backgroundColor: GlobalColors.colors.primaryColor,
    },
    cardHeader: {
        width: '100%',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        color: '#fff',
    },
    cardContent: {
        color: '#fff',
        padding: 10,
    },

    categoriesContainer: {
        marginHorizontal: 10,
    },
    categoryCard: {
        flexDirection: 'row',
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
    },
    categoryImage: {
        width: 100,
        height: 100,
    },
    categoryInfo: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    topicImage: {
        width: 100,
        height: 100,
    },
    categoryTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ratingText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 5,
    },
    categoryDescription: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 5,
    },
    banners: {
        image: {
            marginTop: '-20%',
            marginBottom: '-5%',
            height:400,
        },
    },
    flexCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 4,
    },
    flex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 1
    },
    flexArround: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 1
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginHorizontal: 1,
        borderBottomColor: GlobalColors.colors.secondaryGrey,
        borderBottomWidth: 2
    },
    flatList: {
        width: '100%',
        height: 'auto',
        padding: 10,
        color: GlobalColors.colors.white,
        backgroundColor: GlobalColors.colors.primaryColor,
    },
    generalList: {
        width: '100%',
        height: 'auto',
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 20
    },
    themeTextColor: {
        color: GlobalColors.colors.white
    },
    developerSection: {
        position: 'absolute',
        bottom: 0,
        width: '110%',
        padding: 10,
        backgroundColor: '#fff'
    },
    primaryButton: {
        marginTop: 10,
        borderRadius: 0,
        width: '80%'
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
        borderBottomColor:GlobalColors.colors.primaryGrey,
        borderBottomWidth:1,
        marginTop:10,
        padding:5
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    modalContent: {
        paddingBottom: 20,
    },
    modalcard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    modalsectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    modalcontinueButton: {
        backgroundColor: '#FF7F50',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    modalcontinueButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    // Result screen styles
    correctAnswerAnimation: {
        fontSize: 24,
        color: '#32CD32', // LimeGreen color for correct answer celebration
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    fullWidth: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    halfwidth:{
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputContainer: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    primaryBackground: {
        backgroundColor: GlobalColors.colors.primaryColor,
    },
    buttomButton: {
        bottom: '1%',
        position: 'absolute'
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '80%',
        backgroundColor: GlobalColors.colors.primaryColor,
        alignItems: 'center',
    },
    playButton: {
        padding: 12,
        borderRadius: 3,
        width: '100%',
        backgroundColor: GlobalColors.colors.primaryColor,
        alignItems: 'center',
    },
    borderButton: {
        padding: 12,
        borderRadius: 3,
        width: '100%',
        borderColor: GlobalColors.colors.white,
        borderWidth:1,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    link: {
        color: GlobalColors.colors.blue
    },
    content: {
        marginTop: 70, // Add margin to avoid overlapping the sticky header
        padding: 20,
    },
    bottomEmptySpace: {
        height: 80
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    smallButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    smallButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: GlobalColors.colors.primaryColor,
    },
    iconImage: {
        width: 20,
        height: 20,
        marginTop: 5,
        alignItems: 'center',
        tintColor: GlobalColors.colors.white,
        resizeMode: 'center'
    },
    quizButtomButton: {
        bottom: '1%',  // Slight adjustment to the bottom space
        position: 'absolute',
        width: '100%',  // Ensure it takes the full width
        alignItems: 'center',
    },
    anchorTag:{
        color:GlobalColors.colors.primaryColor,
        textDecorationLine:'underline'
    },

    // New code changes styles (01-11-2024)

    container: {
        flex: 1,
        backgroundColor: GlobalColors.colors.white,
      },
      innerContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
      },
      imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: {
        width: '80%', 
        height: 120, 
        resizeMode: 'center',
      },
      smallImage: {
        width: '60%', 
        height: 50, 
        resizeMode: 'center',
      },
      leftImage: {
        width: '60%', 
        height: 120, 
      },
      newInputContainer: {
        width: '100%',
        marginBottom: 10,
      },
      input: {
        width: '100%',
        marginBottom: 12,
      },
      buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
});
