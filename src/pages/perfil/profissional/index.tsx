import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { ReturnButton } from "../../../components/ui/ReturnButton";
import { setupAPIClient } from "../../../services/api";
import styles from '../styles.module.css'
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { canSSRProf } from "../../../utils/canSSRProf";

type ItemUserProps = {
    id: string;
    nome: string;
    email: string;
    role: string;
    telefone: string;
    dataNascimento: string;
    endereco: string;
    imagem: string;
    userProfissional:[{
        cnpj: string;
        descricaoSobreMim: string;
    }]
}

interface UserProps {
    userData: ItemUserProps
}

export default function Perfil({ userData }: UserProps){

    const [user, setUser] = useState(userData)
    const [sobreMim, setSobreMim] = useState('')
    const [avatarUrl, setAvatarUrl] = useState(''); //Armazendo uma URL para mostrar o Preview da imagem

    async function handleFile(e: ChangeEvent<HTMLInputElement>){
       
        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png'){

            //setImageAvatar(image) // Armazendo a imagem no useState para enviar para o banco de dados                    
            setAvatarUrl(URL.createObjectURL(e.target.files[0])) // Armazenando a imagem no useState para fazer o preview da imagem

            try{
                const data = new FormData();

                data.append('file', image)

                const api = setupAPIClient();
                await api.put('/user/upload/imagem', data)
                toast.success('Imagem atualizada com sucesso!')
            } catch(err){
                toast.error('Falha ao atualizar a imagem')
            }
        }

    }

    return(
        
        <div>
            <ReturnButton/>
            <div className={styles.container}>
                <div className={styles.imagemContainer}>                    
                    <label className={styles.label}>
                        <span className={styles.span}>
                            <FiUpload size={25} />
                        </span>

                        <input type="file" accept="image/png, image/jpeg"  className={styles.input} onChange={handleFile}/>

                        {avatarUrl === '' ? (
                            <Image className={styles.preview} src={`http://localhost:3333/files/${user.imagem}`} alt={'Imagem de perfil do usuário'} width={250} height={250} />        
                        ) : (
                            avatarUrl && (
                                <Image
                                    className={styles.preview}
                                    src={avatarUrl}
                                    alt="Foto de Perfil"
                                    width={250}
                                    height={250}
                                />
                            )
                        )}
                    </label>
                    
                </div>

                <h1 className={styles.nome}>{user.nome}</h1>

                <div className={styles.containerCards}>
                    <h1>Meus Dados</h1>
                    <h2 style={{marginTop:'-1rem'}}>__________________________</h2>
                    <div className={styles.cardDadosDaConta}>
                        <h1 className={styles.DadosContaTitle}>Dados da Conta</h1>
                        <h2 className={styles.DadosContaSubTitle} style={{marginBottom:'1rem'}}>Nome de Usuário: {user.nome}</h2>
                        <h2 className={styles.DadosContaSubTitle}>Email: {user.email}</h2>
                    </div>
                    
                    <div className={styles.cardDadosPessoais}>
                        <h1 className={styles.DadosPessoaisTitle}>Dados Pessoais</h1>
                        <h2 className={styles.DadosPessoaisSubTitle}>Nome Completo: {user.nome}</h2>
                        {user.userProfissional.map((item)=>{
                            return(
                                <div key={user.id}>
                                    <h2 className={styles.DadosPessoaisSubTitle}>CPF: {item.cnpj}</h2>
                                </div>
                            )
                        })}
                        
                        <h2 className={styles.DadosPessoaisSubTitle}>Telefone: {user.telefone}</h2>
                        <h2 className={styles.DadosPessoaisSubTitle}>Endereço: {user.endereco}</h2>
                    </div>

                    <div className={styles.cardSobreMim}>
                        <h1 className={styles.DadosPessoaisTitle}>Sobre Mim</h1>
                        {user.userProfissional.map((item)=>{
                            return(
                                <div key={user.id}>
                                    <textarea 
                                        className={styles.TextAreaSobreMim}
                                        maxLength={265}
                                        placeholder={"Uma breve descrição sobre você"}
                                        value={item.descricaoSobreMim}
                                        readOnly={true}                              
                                        //value={descricao}
                                        onChange={(e) => setSobreMim(e.target.value)}
                                    />
                                </div>
                            )
                        })}
                        
                    </div>
                </div>
            </div>
        </div>
    )



}

export const getServerSideProps = canSSRProf(async (ctx) => {
    
    const api = setupAPIClient(ctx);

    const user = await api.get('/userinfo');

    return{
        props: {
            userData: user.data
        }
    }
})