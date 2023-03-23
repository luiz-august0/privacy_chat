import React from 'react'
import { SafeAreaView, View, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import globalStyles from '../../globalStyles';
import { usuarioLogado } from '../../store/actions/usuario';
import style from '../Home/style'

const Home = (props) => {
	return (
		<ScrollView style={{ backgroundColor: globalStyles.main_color }}>
      		<View style={style.container}>
				<SafeAreaView style={style.safeAreaH} >
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