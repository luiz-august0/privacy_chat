import React, { useState, useEffect } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import { Card, TextInput, HelperText } from "react-native-paper";
import { connect } from 'react-redux';
import FIcon from 'react-native-vector-icons/FontAwesome';
import globalStyles from '../../globalStyles';
import style from '../UsuarioSolicitacoes/style'
import { 
	getUsuarioSolicitacoes,
	getUsuarioSolicitacoesEnviadas, 
	postUsuarioSolicitacao,  
	postUsuarioContato, 
	deleteUsuarioSolicitacao 
} from '../../services/api';

const UsuarioSolicitacoes = (props) => {
	const initialStateErrors = {'id': null, 'apelido': null};
	const [id, setId] = useState('');
	const [apelido, setApelido] = useState('');
	const [sendMode, setSendMode] = useState(false);
	const [sendContatoMode, setSendContatoMode] = useState(false);
	const [usuarioSolicitacoes, setUsuarioSolicitacoes] = useState([]);
	const [usuarioSolicitacoesEnv, setUsuarioSolicitacoesEnv] = useState([]);
	const [loadingSolicitacoes, setLoadingSolicitacoes] = useState(false);
	const [loadginSolicitacoesEnv, setLoadingSolicitacoesEnv] = useState(false);
	const [errors, setErrors] = useState(initialStateErrors);

	const handleError = (error, input) => {
		setErrors(prevState => ({ ...prevState, [input]: error }));
	};

	const getSolicitacoes = async() => {
		try {			
			const response = await getUsuarioSolicitacoes(props.usuario.state.id);
			setUsuarioSolicitacoes(response.data);
		} catch (error) {
			Alert.alert('Ops!. Ocorreu algum ao carregar suas solicitações, contate o suporte');
		}
	}

	const getSolicitacoesEnv = async() => {
		try {			
			const response = await getUsuarioSolicitacoesEnviadas(props.usuario.state.id);
			setUsuarioSolicitacoesEnv(response.data);
		} catch (error) {
			Alert.alert('Ops!. Ocorreu algum ao carregar suas solicitações enviadas, contate o suporte');
		}
	}

    useEffect(() => {
        getSolicitacoes();
		getSolicitacoesEnv();
    }, []);

	const handleEnviaSolicitacao = async() => {
		let isValid = true;
	
		if (id === "") {
			handleError("Deve ser informado o ID do usuário", "id");
			isValid = false;
		}

		if (id === props.usuario.state.id) {
			handleError("ID do usuário não pode ser o mesmo de seu usuário", "id");
			isValid = false;
		}
	
		if (isValid) {
			try {
				await postUsuarioSolicitacao(id, props.usuario.state.id);
				Alert.alert('Solicitação enviada com sucesso!');
				setSendMode(false);
				setErrors(initialStateErrors);
				setId('');
			} catch (error) {
				if (error.message === "Request failed with status code 401") {
					handleError('ID de usuário informado já consta em suas solicitações enviadas', 'id');
				} else if (error.message === "Request failed with status code 404") {
					handleError('ID de usuário informado não existe', 'id');
				} else if (error.message === "Request failed with status code 406") {
					handleError('ID de usuário informado ja é um contato seu', 'id');
				} else if (error.message === "Request failed with status code 400") {
					handleError('ID de usuário informado ja enviou uma solicitação para você.' + '\n' + 
								'Digite abaixo um apelido para adicionar este novo contato', 'id');
					setSendContatoMode(true);
				} else {
					Alert.alert('Ops!. Ocorreu algum erro de servidor, contate o suporte');
				}
			}
		}
	}

	const handleEnviaContato = async() => {
		try {
			await postUsuarioContato(props.usuario.state.id, id, apelido);
			Alert.alert('Contato adicionado com sucesso!');
		} catch (error) {
			Alert.alert('Ops!. Ocorreu algum erro de servidor, contate o suporte');
		}
		
		setSendContatoMode(false);
		setSendMode(false);
		setId('');
		setApelido('');
		setSendMode(false);
		setErrors(initialStateErrors);
		setId('');
	}

	return (
		<ScrollView style={{ backgroundColor: globalStyles.main_color }}>
      		<View style={style.container}>
				<SafeAreaView style={style.safeArea}>
					<TouchableOpacity style={[style.button, { width: 160 }]} onPress={() => setSendMode(true)}>
						<Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Enviar solicitação</Text>
					</TouchableOpacity>
					{sendMode?
					<>
						<TextInput
							style={style.input}
							mode='outlined'
							activeOutlineColor='#fff'
							keyboardType='numeric'
							label="Usuário ID"
							error={errors.id !== null ? true : false}
							onFocus={() => handleError(null, 'id')}
							theme={{colors: { placeholder: 'white', text: 'white', primary: 'white', error: '#ffff00'}}}
							left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
							value={id}
							onChangeText={(id) => setId(id)}
						/>
						<HelperText style={{ color: 'yellow', marginBottom: '-4%' }} type="error" visible={errors.id !== null ? true : false}>
							{errors.id}
						</HelperText>
						{(sendContatoMode && sendMode)?
						<>
							<TextInput
								style={[style.input, { width: '70%', marginTop: 20 }]}
								mode='outlined'
								activeOutlineColor='#fff'
								keyboardType='default'
								label="Apelido"
								error={errors.apelido !== null ? true : false}
								onFocus={() => handleError(null, 'apelido')}
								theme={{colors: { placeholder: 'white', text: 'white', primary: 'white', error: '#ffff00'}}}
								left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account" />}
								value={apelido}
								onChangeText={(apelido) => setApelido(apelido)}
							/>
							<HelperText style={{ color: 'yellow', marginBottom: '-4%' }} type="error" visible={errors.apelido !== null ? true : false}>
								{errors.apelido}
							</HelperText>
							<TouchableOpacity style={[style.button, {backgroundColor: '#515657'}]} onPress={() => handleEnviaContato()}>
								<Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[style.button, {backgroundColor: '#8a1a1a', marginTop: -10}]} onPress={() => { 
								setSendContatoMode(false);
								setErrors(initialStateErrors); 
								setId(''); 
								setApelido('');
							}}>
								<Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Cancelar</Text>
							</TouchableOpacity>
						</>:null}
						<TouchableOpacity style={[style.button, {backgroundColor: '#05A94E'}]} onPress={() => handleEnviaSolicitacao()}>
							<Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[style.button, {backgroundColor: '#E82E2E', marginTop: -10}]} onPress={() => { 
							setSendContatoMode(false);
							setSendMode(false); 
							setErrors(initialStateErrors); 
							setId(''); 
							setApelido('');
						}}>
							<Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Cancelar</Text>
						</TouchableOpacity>
					</>:null}
					{JSON.stringify(usuarioSolicitacoes)!=='[]'?
						<>
							<Text style={style.textTitle}>Solicitações pendentes</Text>
							{usuarioSolicitacoes.map((e) => {
								return (
									<>
										<Card key={e.Usr_Solicitacao} style={{width: 300, marginBottom: 10, backgroundColor: '#262626'}}>
											<Card.Title titleStyle={{color: '#ffff'}} title={`Usuário ID: ${e.Usr_Solicitacao}`}/>
											<View style={{flexDirection: 'row', justifyContent: 'center'}}>
												<TouchableOpacity style={{padding: 10}}>
													<FIcon name="check-circle" size={25} color={'#05A94E'}></FIcon>
												</TouchableOpacity>
												<TouchableOpacity style={{padding: 10}}>
													<FIcon name="trash" size={25} color={'#E82E2E'}></FIcon>
												</TouchableOpacity>
											</View>
										</Card>
									</>
								)
							})}
						</>
					:null}
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

export default connect(mapStateToProps, null)(UsuarioSolicitacoes);