import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.main_color
    }, 
    safeAreaL: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    LogoImage: {
        marginTop: '15%',
        height: 175,
        width: 175,
        marginBottom: 10
    },
    inputL: {
        marginTop: 10,
        width: '70%',
        height: 40,
        borderRadius: 10,
        backgroundColor: '#404040',
    },
    btnLogin: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
        width: 80,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#515657'
    },
    btnCadastro: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: 150,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#313637'
    }
});