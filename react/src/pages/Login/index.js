import React, { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, Alert, ScrollView, Image } from 'react-native'
import { TextInput } from "react-native-paper";
import { connect } from 'react-redux';
import { login } from '../../contexts/auth';
import globalStyles from '../../globalStyles';
import { usuarioLogado } from '../../store/actions/usuario';
import style from '../Login/style'
import Logo from '../../img/logo.png';

const Login = (props) => {
	const [senha, setSenha] = useState('');
	const [hidePass, setHidePass] = useState(true);
	const [email, setEmail] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (email === '' && senha === '') {
			Alert.alert('Email e senha deve ser informado');
		  	return;
		}
	
		login(email, senha).then((resolve) => {
		 	const data = resolve.dataUsuario;
		  	if (resolve.authenticated) {
				props.onLogin(data);
				Alert.alert('Logado');
		  	}
		});
	}

	return (
		<ScrollView style={{ backgroundColor: globalStyles.main_color }}>
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