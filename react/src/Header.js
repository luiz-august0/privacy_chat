import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Image,
    TouchableOpacity
} from 'react-native';
import icon from "../img/imgMenu.png";
import perfil from "../img/perfil.png";
import { connect } from 'react-redux';

const Header = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <Image source={icon} style={styles.image}/>
            </View>
            <TouchableOpacity style={styles.userContainer} onPress={() => props.navigation.navigate('Perfil')}>
                <Text style={styles.user}>{props.usuario.state.nome}</Text>
                {props.usuario.state.urlImagem!=='ul'?
                <Image source={{uri: `https://res.cloudinary.com/dvwxrpftt/image/upload/${props.usuario.state.urlImagem}`}} style={styles.avatar}/>
                :<Image source={perfil} style={styles.avatar}/>}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 20 : 50,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#BBB',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    title: {
        color: '#000',
        fontFamily: 'shelter',
        height: 30,
        fontSize: 28
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    user: {
        fontSize: 10,
        color: '#ffff'
    },
    avatar: {
        width: 30,
        height: 30,
        marginLeft: 10
    }
})

const mapStateToProps = ({ usuario }) => {
    return {
        usuario
    }
}

export default connect(mapStateToProps, null)(Header);