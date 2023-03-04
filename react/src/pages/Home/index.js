import React, { useContext } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import globalStyles from '../../globalStyles';
import { usuarioLogado } from '../../store/actions/usuario';
import style from '../Home/style'
import { Context } from '../../contexts/auth';

const Home = (props) => {
	const { logout } = useContext(Context);

	return (
		<ScrollView style={{ backgroundColor: globalStyles.main_color }}>
      		<View style={style.container}>
				<SafeAreaView style={style.safeAreaH} >
					<TouchableOpacity
						onPress={() => { logout(); props.navigation.navigate('Login'); }}
						style={style.btnLogout}
					>
						<Text style={{ color: '#ffff', fontWeight: 'bold' }}>Sair</Text>
					</TouchableOpacity>
				</SafeAreaView>
      		</View>
    	</ScrollView>
	)
}

const mapStateToProps = ({ usuario }) => {
	return {
		usuario
	}
}
  
const mapDispatchToProps = dispatch => {
	return {
	  	onLogin: usuario => dispatch(usuarioLogado(usuario))
	}
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);