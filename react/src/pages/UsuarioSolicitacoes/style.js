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
    },
    textTitle: {
        width: '100%',
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
        marginTop: '10%',
        marginBottom: '5%'
    },
    textCard: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffff',
        marginLeft: 10
    },
    cardView: {
        flexDirection: 'row', 
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 300, 
        height: 60,
        marginBottom: 10, 
        borderRadius: 10,
        backgroundColor: '#262626'
    }
});