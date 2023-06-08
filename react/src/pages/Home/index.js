import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import EIcon from 'react-native-vector-icons/Entypo';
import IIcon from 'react-native-vector-icons/Ionicons';
import { usuarioLogado } from '../../store/actions/usuario';
import style from '../Home/style';
import { useIsFocused } from '@react-navigation/native';
import { getChats, getContatosChats, postChat } from '../../services/api';
import AbsoluteModal from '../../components/AbsoluteModal';
import { HelperText, TextInput } from 'react-native-paper';

const Home = (props) => {
	const isFocused = useIsFocused();
	const [chats, setChats] = useState([]);
	const [newChats, setNewChats] = useState([]);
	const [initialNewChats, setInitialNewChats] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalNewChatVisible, setModalNewChatVisible] = useState(false);
	const [idSearch, setIdSearch] = useState('');
	const [errors, setErrors] = React.useState({ 'idSearch': null });

	const handleError = (error, input) => {
		setErrors(prevState => ({ ...prevState, [input]: error }));
	};

	const refreshData = async() => {
		const res = await getChats(props.usuario.state.id);
		setChats(res.data);
	}

	useEffect(() => {
		if(isFocused) { 
			refreshData();
		}
    }, [props, isFocused]);

	const handlePressChat = async(idChat, apelido) => {
		if (idChat == null || idChat == '' || idChat == undefined) {
			handleError('Deve ser informado o ID do usuário', 'idSearch');
			return;
		}

		try {
			await postChat(props.usuario.state.id, idChat);
			setModalNewChatVisible(false);
		} catch (error) {
			handleError('ID de usuário informado não existe', 'idSearch');
			return;
		}
		
		setModalVisible(false);
		props.navigation.navigate("Chat", { contatoID: idChat, apelido: apelido });
	}

	const RenderItem = ({idChat, apelido}) => {
        return (
            <TouchableOpacity key={idChat} style={style.buttonViewChat} onPress={() => handlePressChat(idChat, apelido)}>
				<View style={{maxWidth: Dimensions.get('window').width / 2}}>
					<Text style={style.text}>{`Usuário ID: ${idChat}`}</Text>
					{apelido !== null && apelido !== ''?
					<Text style={[style.text, {fontFamily: 'Montserrat-Regular'}]}>{`Apelido: ${apelido}`}</Text>
					:null}
				</View>
				<View style={style.buttonOpenChat}>
					<Text style={[style.text, { fontSize: 12, margin:5 }]}>Abrir Chat</Text>
					<IIcon name="enter-outline" size={25} color={'#05A94E'}></IIcon>
				</View>
            </TouchableOpacity>
        )
    }

	const separator = () => ( <View style={{width: '100%', height: '1%', backgroundColor: 'gray'}} ></View> );

	const getNewChats = async() => {
		const res = await getContatosChats(props.usuario.state.id);
		setInitialNewChats(res.data);
		setNewChats(res.data);
	}

	const handlePressNewChat = () => {
		getNewChats();
		setModalVisible(true);
	}

	const handlePressOut = () => {
		setModalVisible(false);
	}

	const handlePressOutNewChat = () => {
		setIdSearch('');
		handleError(null, 'idSearch');
		setModalNewChatVisible(false);
	}

	const filterByApelido = (search) => {
		let oldArray = initialNewChats;
		let newArray = oldArray.filter(e => (new RegExp(search)).test(e.UsrC_Apelido));

		if (search !== '') {
			setNewChats(newArray);
		} else {
			setNewChats(oldArray);
		}
	}

	const handleOpenNewChat = () => {
		setModalNewChatVisible(true);
		setIdSearch('');
		handleError(null, 'idSearch');
	}

	return (
		<View style={style.container}>
			<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 10}} onPress={() => handlePressNewChat()}>
				<Text style={[style.text, { fontSize: 12, margin:5 }]}>Novo Chat</Text>
				<EIcon name="new-message" size={25} color={'#05A94E'}></EIcon>
			</TouchableOpacity>
			{JSON.stringify(chats) !== "[]"?		
			<>	
				<Text style={[style.text, { textAlign: 'center', marginTop: 20, fontSize: 20, marginBottom: 20}]}>Chats</Text>
				<FlatList
					data={chats}
					renderItem={({item}) => <RenderItem idChat={item.Usr_Chat} apelido={item.UsrC_Apelido}/>}
					keyExtractor={item => item.Usr_Chat}
					ItemSeparatorComponent={separator}/>
			</>
			:null}
			<AbsoluteModal modalVisible={modalVisible} width={'100%'} handlePressOut={handlePressOut}>
				<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{alignItems: 'center', justifyContent: 'center'}}>
					<Text style={[style.text, { fontSize: 20 }]}>Novo Chat</Text>
					<TouchableOpacity style={style.button} onPress={() => handleOpenNewChat()}>
						<Text style={[style.text, { fontSize: 14, textAlign: 'center' }]}>Abrir conversa com pessoa desconhecida</Text>
					</TouchableOpacity>
					<TextInput
						style={[style.input, {width: 250}]}
						mode='outlined'
						activeOutlineColor='#fff'
						theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white', error: '#ffff00' } }}
						label="Pesquisar por Apelido"
						left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="magnify" />}
						onChangeText={(search) => filterByApelido(search)}
					/>
					<FlatList
						data={newChats}
						renderItem={({item}) => <RenderItem idChat={item.UsrC_Contato} apelido={item.UsrC_Apelido}/>}
						keyExtractor={item => item.UsrC_Contato}
						ItemSeparatorComponent={separator}/>
				</KeyboardAvoidingView>

				<AbsoluteModal modalVisible={modalNewChatVisible} width={'80%'} handlePressOut={handlePressOutNewChat}>
					<TextInput
						style={style.input}
						mode='outlined'
						activeOutlineColor='#fff'
						keyboardType='numeric'
						theme={{ colors: { placeholder: '#fff', text: 'white', primary: 'white', error: '#ffff00' } }}
						label="Usuário ID"
						error={errors.idSearch !== null ? true : false}
						onFocus={() => handleError(null, 'idSearch')}
						left={<TextInput.Icon color="white" style={{ marginTop: '50%' }} name="account"/>}
						value={idSearch}
						onChangeText={(idSearch) => setIdSearch(idSearch)}
                    />
                    <HelperText HelperText style={{ color: 'yellow', marginBottom: '-4%' }} type="error" visible={errors.idSearch !== null ? true : false}>
                        {errors.idSearch}
                    </HelperText>
					<TouchableOpacity style={[ style.button, {width: '60%'}]} onPress={() => handlePressChat(idSearch, '')}>
						<Text style={[style.text, { fontSize: 14, textAlign: 'center' }]}>Confirmar</Text>
					</TouchableOpacity>
				</AbsoluteModal>
			</AbsoluteModal>
		</View>
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