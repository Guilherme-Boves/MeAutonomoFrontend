import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { ReturnButton } from "../../../components/ui/ReturnButton";
import { setupAPIClient } from "../../../services/api";
import styles from '../styles.module.css'
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { canSSRCliente } from "../../../utils/canSSRCliente";
import MaskedInput from "../../../components/ui/MaskedInput";
import { containsNumbers, retiraMascara, ShortDateFormat } from "../../../utils/Functions";

type ItemUserProps = {
    id: string;
    nome: string;
    email: string;
    role: string;
    telefone: string;
    dataNascimento: string;
    endereco: string;
    imagem: string;
    userCliente:[{
        cpf: string;        
    }]
}

interface UserProps {
    userData: ItemUserProps
}

export default function PerfilCliente({ userData }: UserProps){

    const [user, setUser] = useState(userData);
    const [nomeUsuario, setNomeUsuario] = useState(user.nome);
    const [telefone, setTelefone] = useState(user.telefone);
    const [endereco, setEndereco] = useState(user.endereco);
    const [imagem, setImagem] = useState(user.imagem);
    const [cpf, setCpf] = useState('');   

    async function handleFile(e: ChangeEvent<HTMLInputElement>){
       
        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            
            try{
                const data = new FormData();

                data.append('file', image)

                const api = setupAPIClient();
                const response = await api.put('/user/upload/imagem', data)

                const {imagem} = response.data
                setImagem(imagem)

                toast.success('Imagem atualizada com sucesso!')
            } catch(err){
                toast.error('Falha ao atualizar a imagem')
            }
        }

    }

    async function handleSalvarInformacoes(e: FormEvent) {
        e.preventDefault();

        if(nomeUsuario === '' || telefone === '' || endereco === '' || endereco === null) {
            toast.warn('Campos de Nome, Telefone e Email não podem ser vazios')
            return;
        }

        // if(nomeUsuario === user.nome && telefone === user.telefone && endereco === user.endereco){
        //     // Se o usuário não inserir informações novas, a função será finalizada.            
        //     return;
        // }

        if(!containsNumbers(nomeUsuario)){ // Verificando se o nome possui números ou caracteres inválidos.
            toast.error("Nome inválido")
            return;
        }

        if(telefone.length < 11){
            toast.error("Telefone incompleto")
            return;
        }
        
        const api = setupAPIClient();

        try{
            await api.put('/userinfo/update/cliente', {
                nome: nomeUsuario,
                telefone: telefone,
                endereco: endereco,
                cpf: cpf,
            })
        } catch(err){
            toast.error('Ops! Erro inesperado, favor contatar o suporte!')
            console.log(err)
        }

        toast.success('Dados atualizados com sucesso!');
    }

    return(
        
        <div>
            <ReturnButton/>
            <div className={styles.container} style={{height:'970px'}}>
                <div className={styles.imagemContainer}>
                    {imagem === '' || imagem === null ? (
                        <label className={styles.label}>
                        <span className={styles.span}>
                            <FiUpload size={25} />
                        </span>

                        <input type="file" accept="image/png, image/jpeg"  className={styles.input} onChange={handleFile}/>
                        
                    </label>
                    ) : (
                        <div>
                            <label className={styles.label}>
                                <span className={styles.span}>
                                    <FiUpload size={25} />
                                </span>

                                <input type="file" accept="image/png, image/jpeg"  className={styles.input} onChange={handleFile}/>
                                
                                <Image className={styles.preview} src={`http://localhost:3333/files/${imagem}`} alt={'Imagem de perfil do usuário'} width={250} height={250} />     
                                
                            </label>
                        </div>
                    )}
                </div>

                <h1 className={styles.nome}>{user.nome}</h1>
                           
                <div className={styles.containerCards}>
                    <form onSubmit={handleSalvarInformacoes}>
                        <h1>Meus Dados</h1>
                        <div className={styles.linhaHorizontal}></div>                        
                        <div className={styles.cardDadosDaConta}>

                            <h1 className={styles.DadosContaTitle}>Dados da Conta</h1>
                            <div className={styles.DadosInfos}>
                                <h2 className={styles.DadosContaSubTitle} style={{marginBottom:'1rem'}}>Nome de Usuário: </h2>
                                <input
                                    value={nomeUsuario}
                                    onChange={(e) => setNomeUsuario(e.target.value)}
                                />
                            </div>

                            <div className={styles.DadosInfos}>
                                <h2 className={styles.DadosContaSubTitle}>Email: </h2>
                                <input
                                    disabled={true}
                                    value={user.email}
                                />
                            </div>

                        </div>
                        
                        <div className={styles.cardDadosPessoais}>
                            <h1 className={styles.DadosPessoaisTitle}>Dados Pessoais</h1>
                            <div className={styles.DadosInfos}>
                                <h2 className={styles.DadosPessoaisSubTitle}>Nome Completo: </h2>
                                <input
                                    value={nomeUsuario}
                                    onChange={(e) => setNomeUsuario(e.target.value)}
                                />
                            </div>
                                                        
                            {user.userCliente.map((item)=>{

                                {cpf === '' ? (setCpf(item.cpf)) : (<></>) }

                                return(
                                    <div key={user.id}>
                                        
                                        <div className={styles.DadosInfos}>
                                            <h2 className={styles.DadosPessoaisSubTitle}>CPF: </h2>
                                            <MaskedInput
                                                style={{marginBottom:"0", padding:"0"}}
                                                onChange={() => {}}
                                                mask={'999.999.999-99'}
                                                disabled={true}
                                                value={item.cpf}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                            
                            
                            <div className={styles.DadosInfos}>
                                <h2 className={styles.DadosPessoaisSubTitle}>Telefone: </h2>
                                    <MaskedInput
                                        style={{marginBottom:"0", padding:"0"}}                                       
                                        mask={"(99) 99999-9999"}
                                        maskChar={''}
                                        onChange={(e) => setTelefone(retiraMascara(e.target.value))}
                                        value={telefone}                                        
                                    />
                            </div>

                            <div className={styles.DadosInfos}>
                                <h2 className={styles.DadosPessoaisSubTitle}>Data de Nascimento: </h2>
                                    <input 
                                        disabled={true}
                                        value={ShortDateFormat(user.dataNascimento)}
                                    />
                            </div>

                            <div className={styles.DadosInfos}>
                                <h2 className={styles.DadosPessoaisSubTitle}>Endereço: </h2>
                                    <input
                                        value={endereco}
                                        onChange={(e) => setEndereco(e.target.value)}
                                    />
                            </div>
                        </div>
                        
                        <div className={styles.button}>
                            <button type="submit">
                                Salvar
                            </button>
                        </div>

                    </form>        
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = canSSRCliente(async (ctx) => {
    
    const api = setupAPIClient(ctx);

    const user = await api.get('/userinfo');

    return{
        props: {
            userData: user.data
        }
    }
})