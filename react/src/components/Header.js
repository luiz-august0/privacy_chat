import React, { useContext } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Image,
    TouchableOpacity
} from 'react-native';
import logoutImage from "../img/logout.png";
import settingImage from "../img/settings.png";
import { Context } from '../contexts/auth';

const Header = (props) => {
    const { logout } = useContext(Context);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { logout();  props.navigation.navigate('Login')}}>
                <View style={styles.rowContainer}>
                    <Image source={logoutImage} style={styles.logoutImage}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingImageContainer} onPress={() => props.navigation.navigate('EditarSenha')}>
                <Image source={settingImage} style={styles.settingImage}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 20 : 50,
        padding: 10,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutImage: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    settingImageContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    settingImage: {
        width: 25,
        height: 25,
        marginLeft: 10
    }
})

export default Header;