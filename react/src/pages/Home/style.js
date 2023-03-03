import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.main_color
    }, 
    safeAreaH: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        marginLeft: '90%',
        height: 27,
        width: 27,
        marginTop: 25
    },
    btnLogout: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
        width: 80,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#515657'
    }
});