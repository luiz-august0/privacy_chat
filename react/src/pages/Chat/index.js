import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import style from './style';
import IIcon from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import 'moment/locale/pt-br'
import { getMensagens, postMensagem } from '../../services/api';

const socket = io('http://10.47.4.164:6000');

const Chat = (props) => {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const scrollViewRef = useRef();

	const handleGetMensagens = async() => {
		const res = await getMensagens(props.usuario.state.id.toString(), props.route.params?.contatoID.toString());
		const data = res.data;
		let mensagens = [];

		data.map((e) => {
			mensagens.push({message: e.Mensagem, sender: e.Sender_Id, receiver: e.Receiver_Id, createdAt: e.Data.toString()})
		})

		setMessages(mensagens);
	}

	useEffect(() => {
		moment.locale('pt-br')
		handleGetMensagens();
		socket.connect();
		
		socket.emit('addUser', props.usuario.state.id.toString());
		
		socket.on('getUsers', () => {null});
		
		socket.on('getMessage', data => {
			if (data.senderID.toString() == props.route.params?.contatoID.toString()) {
				setMessages((prev) => [...prev, {message: data.text, sender: data.senderID, receiver: props.route.params?.contatoID.toString(), createdAt: Date.now()}]);
			}
		})
	
		socket.on('disconnect', () => {null});
	
		return () => {
		  	socket.disconnect();
		};
	}, []);

	const sendMessage = async() => {
		if (message.trim() !== '') {
			socket.emit('sendMessage', {
				senderID: props.usuario.state.id.toString(),
				receiverID: props.route.params?.contatoID.toString(),
				text: message
			});
			setMessages((prev) => [...prev, {message: message, sender: props.usuario.state.id.toString(), receiver: props.route.params?.contatoID.toString(), createdAt: Date.now()}]);
			setMessage('');
			await postMensagem(props.usuario.state.id.toString(), props.route.params?.contatoID.toString(), message, moment(Date.now()).format('YYYY/MM/DD HH:mm:ss').format("YYYY-MM-DD HH:mm:ss"))
		}
	};

	return (
		<KeyboardAvoidingView style={style.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<View style={[style.container, {padding: 16, marginTop: 30}]}>
				<Text style={style.header}>{`Usuário ID: ${props.route.params?.contatoID.toString()}`}</Text>
				{props.route.params?.apelido!==null && props.route.params?.apelido !== '' && props.route.params?.apelido !== undefined?
				<Text style={[style.header, {marginBottom: 16, fontFamily: 'Montserrat-Regular'}]}>{`Apelido: ${props.route.params?.apelido.toString()}`}</Text>
				:null}
				<ScrollView style={style.messagesContainer} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
				{messages.map((e, index) => (
					<View key={index} style={{alignItems: e.sender.toString() !== props.usuario.state.id.toString()?'flex-start':'flex-end', paddingRight: 5}}>
						<View style={[style.viewMessage, { backgroundColor: e.sender.toString() !== props.usuario.state.id.toString()?'#313637':'#325C57' }]}>
							<Text style={style.message}>
								{e.message}
							</Text>
							<Text style={[style.message, { fontSize: 12, color: '#b3b3b3', textAlign: 'right'}]}>
								{moment(e.createdAt).fromNow()}
							</Text>
						</View>
					</View>
				))}
				</ScrollView>
				<View style={style.inputContainer}>
					<TextInput
					style={style.input}
					placeholder="Digite uma mensagem..."
					value={message}
					onChangeText={(text) => setMessage(text)}
					/>
					<TouchableOpacity onPress={sendMessage}>
						<IIcon name="send-outline" size={25} color={'#007bff'}></IIcon>
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	  );
}

const mapStateToProps = ({ usuario }) => {
	return {
		usuario
	}
}
  
export default connect(mapStateToProps, null)(Chat);