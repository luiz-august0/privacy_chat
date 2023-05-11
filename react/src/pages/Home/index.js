import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import EIcon from 'react-native-vector-icons/Entypo';
import IIcon from 'react-native-vector-icons/Ionicons';
import { usuarioLogado } from '../../store/actions/usuario';
import style from '../Home/style';
import { useIsFocused } from '@react-navigation/native';
import { getChats, getContatosChats } from '../../services/api';
import AbsoluteModal from '../../components/AbsoluteModal';

const Home = (props) => {
	const isFocused = useIsFocused();
	const [chats, setChats] = useState([]);
	const [newChats, setNewChats] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);

	const refreshData = async() => {
		const res = await getChats(props.usuario.state.id);
		setChats(res.data);
	}

	useEffect(() => {
		if(isFocused) { 
			refreshData();
		}
    }, [props, isFocused]);

	const RenderItem = ({idChat, apelido}) => {
        return (
            <TouchableOpacity key={idChat} style={{flexDirection: 'row', padding: 10, justifyContent: 'space-between'}} onPress={() => props.navigation.navigate("Chat", { contatoID: idChat, apelido: apelido })}>
				<View>
					<Text style={style.text}>{`Usuário ID: ${idChat}`}</Text>
					{apelido !== null && apelido !== ''?
					<Text style={[style.text, {fontFamily: 'Montserrat-Regular'}]}>{`Apelido: ${apelido}`}</Text>
					:null}
				</View>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
					<Text style={[style.text, { fontSize: 12, margin:5 }]}>Abrir Chat</Text>
					<IIcon name="enter-outline" size={25} color={'#05A94E'}></IIcon>
				</View>
            </TouchableOpacity>
        )
    }

	const separator = () => ( <View style={{width: '100%', height: '1%', backgroundColor: 'gray'}} ></View> );

	const getNewChats = async() => {
		const res = await getContatosChats(props.usuario.state.id);
		setNewChats(res.data);
	}

	const handlePressNewChat = () => {
		getNewChats();
		setModalVisible(true);
	}

	const handlePressOut = () => {
		setModalVisible(false);
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
				<Text style={[style.text, { fontSize: 20 }]}>Novo Chat</Text>
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