import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.main_color
    }, 
	header: {
		fontSize: 16,
		textAlign: 'center',
		fontFamily: 'Montserrat-Bold',
		color: '#fff',
	},
	messagesContainer: {
		flex: 1,
		marginBottom: 16,
	},
	message: {
		fontSize: 16,
		marginBottom: 8,
		color: '#fff',
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	input: {
		flex: 1,
		marginLeft: 8,
		marginRight: 8,
		padding: 8,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		color: '#000',
		backgroundColor: '#fff'
	},
	button: {
		padding: 8,
		backgroundColor: '#007bff',
		borderRadius: 4,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	viewMessage: {
		padding: 10,
		borderRadius: 10,
		marginBottom: 10
	},
	viewImage: {
		width: 250,
		height: 250,
		borderRadius: 10, 
		marginBottom: 10
	}
});