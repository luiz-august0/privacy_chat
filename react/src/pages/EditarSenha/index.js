import React, { useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Alert } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import style from "./style";
import { updateUsuarioPassword } from "../../services/api";
import globalStyles from "../../globalStyles";
import { connect } from "react-redux";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";

const EditarSenha = (props) => {
    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [hidePass, setHidePass] = useState(true);
    const [senha, setSenha] = useState('');
    const [hidePass1, setHidePass1] = useState(true);
    const [senhaConfirmed, setSenhaConfirmed] = useState('');
    const [hidePass2, setHidePass2] = useState(true);
  
    const [errors, setErrors] = React.useState({ 'senhaAntiga': null, 'senha': null, 'senhaConfirmed': null });
  
    const handleError = (error, input) => {
      setErrors(prevState => ({ ...prevState, [input]: error }));
    };
  
    const AtualizaSenha = async() => {
      let isValid = true;
  
      if (senhaAntiga === ''){
        handleError("Deve ser informada a senha antiga", "senhaAntiga");
        isValid = false;
      }

      if (senha.length < 6) {
        handleError("Senha invalida, digite uma senha com no minímo 6 caracteres", "senha");
        isValid = false;
      }
  
      if (senha != senhaConfirmed) {
        handleError("Senhas não coincidem, digite novamente", "senhaConfirmed");
        isValid = false;
      }
  
      if (isValid) {
        try {
            await updateUsuarioPassword(senhaAntiga, senha, props.usuario.state.id);
            Alert.alert('Senha alterada com sucesso!');
            props.navigation.navigate('HomeNav', { screen: 'Home' });
        } catch (error) {
            if (error.message === "Request failed with status code 401") {
                handleError('Senha antiga incorreta', 'senhaAntiga');
            }
						console.log(error)
        }
      }
    }

    return (
        <KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
            <View style={style.containerPassword} >
                <Text style={style.textTitle}>Alterar senha do usuário</Text>
                <SafeAreaView style={style.safeArea}>
                    <TextInput
                    style={style.input}
                    mode='outlined'
                    activeOutlineColor='#fff'
                    theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white', error: '#ffff00' } }}
                    label="Senha Antiga"
                    error={errors.senhaAntiga !== null ? true : false}
                    onFocus={() => handleError(null, 'senhaAntiga')}
                    secureTextEntry={hidePass}
                    left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="lock" />}
                    right={<TextInput.Icon color="white" style={{ marginTop: '50%' }} onPress={() => setHidePass(!hidePass)} name={hidePass ? "eye-off" : "eye"}></TextInput.Icon>}
                    value={senhaAntiga}
                    onChangeText={(senhaAntiga) => setSenhaAntiga(senhaAntiga)}
                    />
                    <HelperText HelperText style={{ color: 'yellow', marginBottom: '-4%' }} type="error" visible={errors.senhaAntiga !== null ? true : false}>
                        {errors.senhaAntiga}
                    </HelperText>
                    <TextInput
                    style={style.input}
                    mode='outlined'
                    activeOutlineColor='#fff'
                    theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white', error: '#ffff00' } }}
                    label="Nova Senha"
                    error={errors.senha !== null ? true : false}
                    onFocus={() => handleError(null, 'senha')}
                    secureTextEntry={hidePass1}
                    left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="lock" />}
                    right={<TextInput.Icon color="white" style={{ marginTop: '50%' }} onPress={() => setHidePass1(!hidePass1)} name={hidePass1 ? "eye-off" : "eye"}></TextInput.Icon>}
                    value={senha}
                    onChangeText={(senha) => setSenha(senha)}
                    />
                    <HelperText HelperText style={{ color: 'yellow', marginBottom: '-4%' }} type="error" visible={errors.senha !== null ? true : false}>
                        {errors.senha}
                    </HelperText>
                    <TextInput
                    style={style.input}
                    mode='outlined'
                    activeOutlineColor='#fff'
                    theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white', error: '#ffff00' } }}
                    label="Confirmar Senha"
                    error={errors.senhaConfirmed !== null ? true : false}
                    onFocus={() => handleError(null, 'senhaConfirmed')}
                    secureTextEntry={hidePass2}
                    left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="lock" />}
                    right={<TextInput.Icon color="white" style={{ marginTop: '50%' }} onPress={() => setHidePass2(!hidePass2)} name={hidePass2 ? "eye-off" : "eye"}></TextInput.Icon>}
                    value={senhaConfirmed}
                    onChangeText={(senhaConfirmed) => setSenhaConfirmed(senhaConfirmed)}
                    />
                    <HelperText style={{ color: 'yellow', marginBottom: '-4%' }} type="error" visible={errors.senhaConfirmed !== null ? true : false}>
                        {errors.senhaConfirmed}
                    </HelperText>
                    <TouchableOpacity style={style.button} onPress={() => AtualizaSenha()}>
                        <Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
                    </TouchableOpacity>
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
  
export default connect(mapStateToProps, null)(EditarSenha);