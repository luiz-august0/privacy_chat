import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Oval } from  'react-loader-spinner';
import withReactContent from 'sweetalert2-react-content'
import './styles.css';
import { updatePassword } from './api';

const ForgotPassword = () => {
    const { key } = useParams();
    const [senha, setSenha] = useState(""); 
    const [senhaConfirm, setSenhaConfirm] = useState(""); 
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const MySwal = withReactContent(Swal);

    const update = async() => {
        setLoading(true);
        await updatePassword(key, senha)
            .then(() => {
                setConfirmed(true);
            })
            .catch((error) => {
                console.log(error)
                MySwal.fire({
                    html: <i>Ocorreu algum erro ao alterar a senha, favor envie novamente uma solicitação pelo aplicativo</i>,
                    icon: 'error'
                })
            })
        setLoading(false);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (senha.length < 6) {
            MySwal.fire({
            html: <i>Senha invalida, digite uma senha com no minímo 6 caracteres</i>,
            icon: 'warning'
            })
            return;
        } 
	  
		if (senha !== senhaConfirm) {
            MySwal.fire({
                html: <i>Senhas não coincidem, digite novamente</i>,
                icon: 'warning'
            })
            return;
        } 

        update();
        
    }
      
    return (
        <div id="app">
            {confirmed?
            <h1 style={{color: '#FFF', fontFamily: 'unset', fontSize: 28}} >Senha alterada com sucesso, volte ao aplicativo e faça o login novamente</h1>
            :
            <>
                <h1 style={{color: '#FFF', fontFamily: 'unset', fontSize: 28}} >Recuperação de Senha</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="senha">Senha</label>
                        <input 
                            type="text" 
                            name="senha" 
                            id="senha"
                            value={senha} 
                            onChange={(e) => setSenha(e.target.value)} 
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="senhaConfirm">Confirmar Senha</label>
                        <input 
                            type="text" 
                            name="senhaConfirm" 
                            id ="senhaConfirm"
                            value={senhaConfirm}
                            onChange={(e) => setSenhaConfirm(e.target.value)}
                        />
                    </div>
                    <div className="actions">
                        <button type="submit">
                            {!loading?'Confirmar'
                            :
                            <Oval
                            height={20}
                            width={20}
                            color="#1976d2"
                            wrapperStyle={{ justifyContent: 'center' }}
                            wrapperClass=""
                            visible={true}
                            ariaLabel='oval-loading'
                            secondaryColor="#1976d2"
                            strokeWidth={3}
                            strokeWidthSecondary={3}
                            />}
                        </button>                
                    </div>
                </form>
            </>}
        </div>
    );
};

export default ForgotPassword;