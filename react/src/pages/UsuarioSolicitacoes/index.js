import React, { useState, useEffect } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, Alert } from 'react-native';
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
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';
import { sleep } from '../../globalFunctions';

const UsuarioSolicitacoes = (props) => {
	const initialStateErrors = {'id': null, 'apelido': null};
	const [id, setId] = useState('');
	const [idSolicitacao, setIdSolicitacao] = useState('');
	const [apelido, setApelido] = useState('');
	const [sendMode, setSendMode] = useState(false);
	const [sendContatoMode, setSendContatoMode] = useState(false);
	const [sendContatoSolicitacao, setSendContatoSolicitacao] = useState(false);
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

	const refreshData = () => {
        getSolicitacoes();
		getSolicitacoesEnv();
	}
		
    useEffect(() => {
		refreshData();
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
				refreshData();
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
					setIdSolicitacao('');
					setSendContatoSolicitacao(false);
				} else {
					Alert.alert('Ops!. Ocorreu algum erro de servidor, contate o suporte');
				}
			}
		}
	}

	const handleEnviaContato = async() => {
		try {
			if (idSolicitacao !== null && idSolicitacao !== '') {
				await postUsuarioContato(props.usuario.state.id, idSolicitacao, apelido);
			} else {
				await postUsuarioContato(props.usuario.state.id, id, apelido);
			}
			Alert.alert('Contato adicionado com sucesso!');
			refreshData();
		} catch (error) {
			Alert.alert('Ops!. Ocorreu algum erro de servidor, contate o suporte');
		}
		
		if (sendContatoMode) {
			setSendContatoMode(false);
			setId('');
			setApelido('');
			setSendMode(false);
			setErrors(initialStateErrors);
		} else {
			setSendContatoSolicitacao(false);
			setApelido('');
			setIdSolicitacao('');
			handleError(null, 'apelido');
		}
	}

	const handleCancelarContato = () => {
		if (sendContatoMode) {
			setSendContatoMode(false);
			setErrors(initialStateErrors); 
			setId(''); 
			setApelido('');
		} else {
			setSendContatoSolicitacao(false);
			setApelido('');
			setIdSolicitacao('');
			handleError(null, 'apelido');
		}
	}

	const handleConfirmaSolicitacao = (idParameter) => {
		setSendContatoMode(false);
		setApelido('');
		setIdSolicitacao(idParameter);
		setErrors(initialStateErrors);
		handleError(null, 'apelido');
		setSendContatoSolicitacao(true);
	}

	const handleDeleteSolicitacao = async(id, idSolicitado) => {
		try {
			await deleteUsuarioSolicitacao(id, idSolicitado);
			Alert.alert('Solicitação excluida com sucesso!');
			refreshData();
		} catch (error) {
			Alert.alert('Ops!. Ocorreu algum erro de servidor, contate o suporte');
		}
	}

	const ViewApelido = () => {
		return (
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
				<TouchableOpacity style={[style.button, {backgroundColor: '#05A94E'}]} onPress={() => handleEnviaContato()}>
					<Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Confirmar</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[style.button, {backgroundColor: '#E82E2E', marginTop: -10}]} onPress={() => handleCancelarContato()}>
					<Text style={{ color: "#ffff", fontSize: 14, fontWeight: 'bold' }}>Cancelar</Text>
				</TouchableOpacity>
			</>
		)
	}

	return (
		<KeyboardAvoidingWrapper style={{ backgroundColor: globalStyles.main_color }}>
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
						{!sendContatoMode?
						<>
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
						</>
						:null}
						{(sendContatoMode && sendMode)?ViewApelido():null}
					</>:null}
					<View style={{ width: 250, marginTop: 20 }}>
						<TouchableOpacity style={{ left: '100%' }} onPress={() => refreshData()}>
							<FIcon name="repeat" size={25} color={'#05A94E'}></FIcon>
						</TouchableOpacity>
					</View>
					{JSON.stringify(usuarioSolicitacoes)!=='[]'?
						<>
							<Text style={style.textTitle}>Solicitações pendentes</Text>
							{usuarioSolicitacoes.map((e) => {
								return (
									<Card key={e.Usr_Solicitacao} style={{width: 300, marginBottom: 10, backgroundColor: '#262626'}}>
										<Card.Title titleStyle={{color: '#ffff'}} title={`Usuário ID: ${e.Usr_Solicitacao}`}/>
										{(sendContatoSolicitacao) && (e.Usr_Solicitacao == idSolicitacao)?
										<View style={{alignItems: 'center'}}>
											{ViewApelido()}
										</View>
										:
										<View style={{flexDirection: 'row', justifyContent: 'center'}}>
											<TouchableOpacity style={{padding: 20}} onPress={() => handleConfirmaSolicitacao(e.Usr_Solicitacao)}>
												<FIcon name="check-circle" size={25} color={'#05A94E'}></FIcon>
											</TouchableOpacity>
											<TouchableOpacity style={{padding: 20}} onPress={() => handleDeleteSolicitacao(props.usuario.state.id, e.Usr_Solicitacao)}>
												<FIcon name="trash" size={25} color={'#E82E2E'}></FIcon>
											</TouchableOpacity>
										</View>
										}
									</Card>
								)
							})}
						</>
					:null}
					{JSON.stringify(usuarioSolicitacoesEnv)!=='[]'?
						<>
							<Text style={style.textTitle}>Solicitações enviadas</Text>
							{usuarioSolicitacoesEnv.map((e) => {
								return (
									<Card key={e.Usr_Codigo} style={{width: 300, marginBottom: 10, backgroundColor: '#262626'}}>
										<Card.Title titleStyle={{color: '#ffff'}} title={`Usuário ID: ${e.Usr_Codigo}`}/>
										<View style={{flexDirection: 'row', justifyContent: 'center'}}>
											<TouchableOpacity style={{padding: 20}} onPress={() => handleDeleteSolicitacao(e.Usr_Codigo, props.usuario.state.id)}>
												<FIcon name="trash" size={25} color={'#E82E2E'}></FIcon>
											</TouchableOpacity>
										</View>
									</Card>
								)
							})}
						</>
					:null}
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

export default connect(mapStateToProps, null)(UsuarioSolicitacoes);