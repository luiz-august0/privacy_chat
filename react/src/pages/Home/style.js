import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.main_color
    },
    text: {
        color: '#ffff', 
        fontFamily: 'Montserrat-Bold',
        fontSize: 18
    }
});