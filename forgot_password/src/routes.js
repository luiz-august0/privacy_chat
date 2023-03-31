import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";

const Rotas = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route exact path="/:key" element={<ForgotPassword/>}/>
			</Routes>
		</BrowserRouter>
	)
}

export default Rotas;