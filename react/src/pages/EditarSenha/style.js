import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalStyles.main_color
    }, 
    containerPassword: {
        flex: 1,
        backgroundColor: globalStyles.main_color
    },
    textTitle: {
        width: '100%',
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
        marginTop: '20%',
        marginBottom: '5%'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        width: 150,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#515657'
    },
    text: {
        width: '100%',
        fontSize: 12,
        textAlign: 'center',
        color: '#ffff',
        marginBottom: 30
    },
    input: {
        marginTop: 10,
        width: '70%',
        height: 40,
        borderRadius: 10,
        backgroundColor: '#404040',
    },
    safeArea: {
        marginTop: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});