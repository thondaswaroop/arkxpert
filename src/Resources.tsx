import { imagesBucket } from './utils/AssetsUtil';
import { globalStyles } from './styles/Global';
import { authenticationStyles } from './styles/AuthStyles';
import { GlobalColors } from './styles/Colors';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: GlobalColors.colors.primaryColor,
        secondary: 'yellow',
    },
};

export { imagesBucket, globalStyles, authenticationStyles, theme }