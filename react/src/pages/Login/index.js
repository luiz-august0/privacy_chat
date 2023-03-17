import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, Alert, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native'
import { TextInput } from "react-native-paper";
import { connect } from 'react-redux';
import globalStyles from '../../globalStyles';
import { usuarioLogado } from '../../store/actions/usuario';
import style from '../Login/style'
import Logo from '../../img/logo.png';
import { Context } from '../../contexts/auth';

const Login = (props) => {
	const [senha, setSenha] = useState('');
	const [hidePass, setHidePass] = useState(true);
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	
	const { login, loadUser } = useContext(Context);

	useEffect(() => {
		setIsLoading(true);
		loadUser().then((resolve) => {
			const data = resolve.dataUsuario;
		  	if (resolve.authenticated) {
				props.onLogin(data);
				props.navigation.navigate('HomeNav', { screen: 'Home' });
		  	}
		});
		setIsLoading(false);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (email === '' && senha === '') {
			Alert.alert('Email e senha deve ser informado');
		  	return;
		}
	
		setIsLoading(true);
		login(email, senha).then((resolve) => {
		 	const data = resolve.dataUsuario;
		  	if (resolve.authenticated) {
				props.onLogin(data);
				props.navigation.navigate('HomeNav', { screen: 'Home' });
		  	}
		});
		setIsLoading(false);
	}

	return (
		<ScrollView style={{ backgroundColor: globalStyles.main_color }}>
			{!isLoading?
			<View style={style.container}>
				<SafeAreaView style={style.safeAreaL} >
					<Image source={Logo} style={style.LogoImage}></Image>
					<TextInput
						style={style.inputL}
						mode='outlined'
						activeOutlineColor='#fff'
						label="Email"
						keyboardType='email-address'
						theme={{ colors: { placeholder: 'white', text: 'white', primary: 'white' } }}
						left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="email" />}
						value={email}
						onChangeText={(email) => setEmail(email)}
					/>
					<TextInput
						style={style.inputL}
						mode='outlined'
						activeOutlineColor='#fff'
						theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white' } }}
						label="Senha"
						secureTextEntry={hidePass}
						left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="lock" />}
						right={<TextInput.Icon color="white" style={{ marginTop: '50%' }} onPress={() => setHidePass(!hidePass)} name={hidePass ? "eye-off" : "eye"}></TextInput.Icon>}
						value={senha}
						onChangeText={(senha) => setSenha(senha)}
					/>
					<TouchableOpacity
						onPress={() => Alert.alert('Teste')}
					>
						<Text style={{ color: "#ffff", marginTop: 10, fontSize: 14, fontWeight: 'bold' }} >Esqueci a Senha</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleSubmit}
						style={style.btnLogin}
					>
						<Text style={{ color: '#ffff', fontWeight: 'bold' }}>Login</Text>
					</TouchableOpacity>
					<Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }} >Não tem cadastro ?</Text>
					<TouchableOpacity
						onPress={() => props.navigation.navigate('Registro')}
						style={style.btnCadastro}
					>
						<Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Cadastrar agora</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</View>
			:<ActivityIndicator color="white" style={{marginTop: Dimensions.get('window').height / 2}}/>}
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Login);