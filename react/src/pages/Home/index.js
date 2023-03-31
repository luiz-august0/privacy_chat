import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { connect } from 'react-redux';
import globalStyles from '../../globalStyles';
import { usuarioLogado } from '../../store/actions/usuario';
import style from '../Home/style';
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

const Home = (props) => {
	return (
		<KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
      		<View style={style.container}>
				<SafeAreaView style={style.safeAreaH} >
				</SafeAreaView>
      		</View>
    	</KeyboardAvoidingWrapper>
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