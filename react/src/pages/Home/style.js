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
    },
    buttonViewChat: {
        flexDirection: 'row', 
        padding: 10, 
        justifyContent: 'space-between'
    },
    buttonOpenChat: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    input: {
        marginTop: 10,
        width: '70%',
        height: 40,
        borderRadius: 10,
        backgroundColor: '#404040',
        marginBottom: 10
    },
    button: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#515657'
    },
});