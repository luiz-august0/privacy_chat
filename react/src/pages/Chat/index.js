import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import style from './style';
import IIcon from 'react-native-vector-icons/Ionicons';

const socket = io('http://192.168.0.109:6000');

const Chat = (props) => {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		socket.on('connect', () => {
		  	console.log('Conectado ao servidor Socket.IO');
		});
		
		socket.emit('addUser', props.usuario.state.id.toString());
		
		socket.on('getUsers', users => {
		  	console.log(users)
		})
		
		socket.on('getMessage', data => {
			console.log(data)
		  	setMessages((prev) => [...prev, {message: data.text, sender: data.senderID, createdAt: Date.now()}]);
		})
	
		socket.on('disconnect', () => {
		  	console.log('Desconectado do servidor Socket.IO');
		});
	
		return () => {
		  	socket.disconnect(); // Fecha a conexão do socket ao desmontar o componente
		};
	}, []);

	const sendMessage = () => {
		Keyboard.dismiss();
		if (message.trim() !== '') {
			socket.emit('sendMessage', {
				senderID: props.usuario.state.id.toString(),
				receiverID: props.route.params?.contatoID.toString(),
				text: message
			});
			setMessages((prev) => [...prev, {message: message, sender: props.usuario.state.id.toString(), createdAt: Date.now()}]);
			setMessage('');
		}
	};

	return (
		<KeyboardAvoidingView style={style.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<View style={[style.container, {padding: 16}]}>
				<Text style={style.header}>{`Usuário ID: ${props.route.params?.contatoID.toString()}`}</Text>
				{props.route.params?.apelido!==null && props.route.params?.apelido !== '' && props.route.params?.apelido !== undefined?
				<Text style={[style.header, {marginBottom: 16, fontFamily: 'Montserrat-Regular'}]}>{`Apelido: ${props.route.params?.apelido.toString()}`}</Text>
				:null}
				<ScrollView style={style.messagesContainer}>
				{messages.map((e, index) => (
					<View key={index} style={{alignItems: e.sender !== props.usuario.state.id.toString()?'flex-start':'flex-end', paddingRight: 5}}>
						<View style={[style.viewMessage, { backgroundColor: e.sender !== props.usuario.state.id.toString()?'#313637':'#325C57' }]}>
							<Text style={style.message}>
								{e.message}
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