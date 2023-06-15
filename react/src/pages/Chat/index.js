import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import style from './style';
import IIcon from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import 'moment/locale/pt-br'
import * as ImagePicker from 'expo-image-picker';
import { getMensagens, postMensagem, postMensagemImagem } from '../../services/api';

const socket = io('http://10.47.5.172:6000');

const Chat = (props) => {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [isSendingImage, setIsSendingImage] = useState(false);
	const scrollViewRef = useRef();;

	const handleGetMensagens = async() => {
		const res = await getMensagens(props.usuario.state.id.toString(), props.route.params?.contatoID.toString());
		const data = res.data;
		let mensagens = [];

		data.map((e) => {
			let message = '';

			switch (e.Tipo.toString()) {
				case 'text':
					message = e.Mensagem;
					break;
				case 'image':
					message = `https://res.cloudinary.com/dvwxrpftt/image/upload/${e.Mensagem}`;
					break;
				default:
					break;
			}

			mensagens.push({message: message, type: e.Tipo, sender: e.Sender_Id, receiver: e.Receiver_Id, createdAt: moment(e.Data.toString()).format('YYYY/MM/DD HH:mm:ss')})
		})

		setMessages(mensagens);
	}

	const pickImage = async () => {
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            aspect: [4, 3],
            quality: 1,
        })
        
		if (!res.cancelled) {
            const encodedBase64 = `data:${res.type}/jpeg;base64,${res.base64}`;

			setIsSendingImage(true);
			try {
                const responseImage = await postMensagemImagem(props.usuario.state.id.toString(), props.route.params?.contatoID.toString(), encodedBase64, moment().format('YYYY-MM-DD HH:mm:ss'))
				setMessages((prev) => [...prev, {message: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, type: 'image', sender: props.usuario.state.id.toString(), receiver: props.route.params?.contatoID.toString(), createdAt: Date.now()}]);
				socket.emit('sendMessage', {
					senderID: props.usuario.state.id.toString(),
					receiverID: props.route.params?.contatoID.toString(),
					message: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`,
					type: 'image'
				});
			} catch (error) {
				Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao realizar o envio da imagem.' )
            }
			setIsSendingImage(false);
        }
    }

    const pickCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
          Alert.alert("Atenção", "Você recusou este app para acessar sua câmera!");
          return;
        }

        let res = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            aspect: [4, 3],
            quality: 1,
        })
        
        if (!res.cancelled) {
            const encodedBase64 = `data:${res.type}/jpeg;base64,${res.base64}`;

			setIsSendingImage(true);
			try {
                const responseImage = await postMensagemImagem(props.usuario.state.id.toString(), props.route.params?.contatoID.toString(), encodedBase64, moment().format('YYYY-MM-DD HH:mm:ss'))
				setMessages((prev) => [...prev, {message: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`, type: 'image', sender: props.usuario.state.id.toString(), receiver: props.route.params?.contatoID.toString(), createdAt: Date.now()}]);
				socket.emit('sendMessage', {
					senderID: props.usuario.state.id.toString(),
					receiverID: props.route.params?.contatoID.toString(),
					message: `https://res.cloudinary.com/dvwxrpftt/image/upload/${responseImage.data}`,
					type: 'image'
				});
			} catch (error) {
                Alert.alert('Atenção', 'Ops!, ocorreu algum erro ao realizar o envio da imagem' )
            }
			setIsSendingImage(false);
        }
    }

	useEffect(() => {
		moment.locale('pt-br')
		handleGetMensagens();
		socket.connect();
		
		socket.emit('addUser', props.usuario.state.id.toString());
		
		socket.on('getUsers', () => {null});
		
		socket.on('getMessage', data => {
			if (data.senderID.toString() == props.route.params?.contatoID.toString()) {
				setMessages((prev) => [...prev, {message: data.message, type: data.type, sender: data.senderID, receiver: props.route.params?.contatoID.toString(), createdAt: Date.now()}]);
			}
		})
	
		socket.on('disconnect', () => {null});
	
		return () => {
		  	socket.disconnect();
		};
	}, []);

	const sendMessage = async(type) => {
		if (message.trim() !== '') {
			socket.emit('sendMessage', {
				senderID: props.usuario.state.id.toString(),
				receiverID: props.route.params?.contatoID.toString(),
				message: message,
				type: type
			});
			setMessages((prev) => [...prev, {message: message, type: type, sender: props.usuario.state.id.toString(), receiver: props.route.params?.contatoID.toString(), createdAt: Date.now()}]);
			setMessage('');

			await postMensagem(props.usuario.state.id.toString(), props.route.params?.contatoID.toString(), message, type, moment().format('YYYY-MM-DD HH:mm:ss'))
		}
	};

	const renderMessage = (type, message, sender, createdAt) => {
		switch (type) {
			case 'text':
				return (
					<View style={[style.viewMessage, { backgroundColor: sender.toString() !== props.usuario.state.id.toString()?'#313637':'#325C57' }]}>
						<Text style={style.message}>
							{message}
						</Text>
						<Text style={[style.message, { fontSize: 12, color: '#b3b3b3', textAlign: 'right'}]}>
							{moment(createdAt).fromNow()}
						</Text>
					</View>
				)
			case 'image':
				return(
					<View style={[style.viewMessage, { backgroundColor: sender.toString() !== props.usuario.state.id.toString()?'#313637':'#325C57', padding: 5}]}>
						<Image style={style.viewImage} source={{uri: message}}/>
						<Text style={[style.message, { fontSize: 12, color: '#b3b3b3', textAlign: 'right'}]}>
							{moment(createdAt).fromNow()}
						</Text>
					</View>
				)
			default:
				break;
		}
	}

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
						{renderMessage(e.type, e.message, e.sender, e.createdAt)}
					</View>
				))}
				{isSendingImage?
				<ActivityIndicator style={{alignItems: 'flex-end', paddingRight: 5}}/>
				:null}
				</ScrollView>
				<View style={style.inputContainer}>
					<TouchableOpacity onPress={pickCamera}>
						<IIcon name="camera" size={25} color={'#007bff'}></IIcon>
					</TouchableOpacity>
					<TouchableOpacity onPress={pickImage} style={{marginLeft: 8}}>
						<IIcon name="image-outline" size={25} color={'#007bff'}></IIcon>
					</TouchableOpacity>
					<TextInput
					style={style.input}
					placeholder="Digite uma mensagem..."
					value={message}
					multiline={true}
					onChangeText={(text) => setMessage(text)}
					/>
					<TouchableOpacity onPress={() => sendMessage('text')}>
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