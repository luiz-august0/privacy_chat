import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.main_color
    }, 
    safeArea: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '40%',
        height: 40,
        borderRadius: 10,
        backgroundColor: '#404040'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
        width: 100,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#515657'
    }
});