import React from "react";
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import globalStyles from "../globalStyles";

const KeyboardAvoidingWrapper = ({children}) => {
	return (
		<KeyboardAvoidingView style={{flex: 1, backgroundColor: globalStyles.main_color}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<ScrollView>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					{children}
				</TouchableWithoutFeedback>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

export default KeyboardAvoidingWrapper;