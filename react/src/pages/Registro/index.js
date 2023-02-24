import React, { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, Alert, ScrollView, Image } from 'react-native';
import { TextInput, HelperText, DefaultTheme } from "react-native-paper";
import globalStyles from '../../globalStyles';
import style from '../Registro/style'
import Logo from '../../img/logo.png';

const validarEmail = (email) => {
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
};

const Registro = (props) => {
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [hidePass, setHidePass] = useState(true);
	const [senhaConfirma, setSenhaConfirma] = useState('');
	const [hidePass2, setHidePass2] = useState(true);
	const [errors, setErrors] = React.useState({ 'email': null, 'senha': null, 'senhaConfirma': null });

	const handleError = (error, input) => {
		setErrors(prevState => ({ ...prevState, [input]: error }));
	};

	const handleConfirm = () => {
		let isValid = true;
	
		if (senha.length < 6) {
			handleError("Senha invalida, digite uma senha com no minímo 6 caracteres", "senha");
		  	isValid = false;
		}
	
		if (senha != senhaConfirma) {
		  	handleError("Senhas não coincidem, digite novamente", "senhaConfirmed");
		  	isValid = false;
		}
	
		if (isValid) {
			Alert.alert('valido')
		}
	}

	return (
		<ScrollView style={{ backgroundColor: globalStyles.main_color }}>
      		<View style={style.container}>
				<SafeAreaView style={style.safeAreaC}>
					<Image source={Logo} style={style.LogoImage}/>
					<Text style={{ color: '#fff', textAlign: 'center', marginBottom:50, fontSize: 27, fontWeight: 'bold', fontFamily: 'Montserrat-Bold' }}>Cadastro de Usuário</Text>
					<TextInput
						style={style.inputC}
						mode='outlined'
						activeOutlineColor='#fff'
						keyboardType='email-address'
						label="Email"
						error={errors.email !== null ? true : false}
						onFocus={() => handleError(null, 'email')}
						theme={{colors: { placeholder: 'white', text: 'white', primary: 'white', surface: 'yellow'}}}
						left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="email" />}
						value={email}
						onChangeText={(email) => setEmail(email)}
          			/>
          			<HelperText style={{ color: 'yellow', marginBottom: '-4%' }} type="error" visible={errors.email !== null ? true : false}>
            			{errors.email}
          			</HelperText>
					<TextInput
						style={style.inputC}
						mode='outlined'
						activeOutlineColor='#fff'
						theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white' } }}
						label="Senha"
						error={errors.senha !== null ? true : false}
						onFocus={() => handleError(null, 'senha')}
						secureTextEntry={hidePass}
						left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="lock" />}
						right={<TextInput.Icon color="white" style={{ marginTop: '50%' }} onPress={() => setHidePass(!hidePass)} name={hidePass ? "eye-off" : "eye"}></TextInput.Icon>}
						value={senha}
						onChangeText={(senha) => setSenha(senha)}
          			/>
          			<HelperText style={{ color: 'yellow', marginBottom: '-4%' }} type="error" visible={errors.senha !== null ? true : false}>
            			{errors.senha}
          			</HelperText>
          			<TextInput
						style={style.inputC}
						mode='outlined'
						activeOutlineColor='#fff'
						theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white' } }}
						label="Confirmar Senha"
						error={errors.senhaConfirma !== null ? true : false}
						onFocus={() => handleError(null, 'senhaConfirmed')}
						secureTextEntry={hidePass2}
						left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="lock" />}
						right={<TextInput.Icon color="white" style={{ marginTop: '50%' }} onPress={() => setHidePass2(!hidePass2)} name={hidePass2 ? "eye-off" : "eye"}></TextInput.Icon>}
						value={senhaConfirma}
						onChangeText={(senhaConfirma) => setSenhaConfirma(senhaConfirma)}
          			/>
          			<HelperText style={{ color: 'yellow', marginBottom: '-4%' }} type="error" visible={errors.senhaConfirma !== null ? true : false}>
            			{errors.senhaConfirma}
          			</HelperText>
					<TouchableOpacity style={style.btnConfirma} onPress={() => handleConfirm()}>
						<Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
					</TouchableOpacity>
				</SafeAreaView>
      		</View>
    	</ScrollView>
	)
}
  
export default Registro;