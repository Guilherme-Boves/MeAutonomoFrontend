import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { ReturnButton } from "../../../components/ui/ReturnButton";
import { setupAPIClient } from "../../../services/api";
import styles from '../styles.module.css'
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { canSSRProf } from "../../../utils/canSSRProf";
import MaskedInput from "../../../components/ui/MaskedInput";
import { containsNumbers, retiraMascara } from "../../../utils/Functions";

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

export default function PerfilProfissional({ userData }: UserProps){

    const [user, setUser] = useState(userData);
    const [descricaoSobreMim, setDescricaoSobreMim] = useState('');
    const [descricaoSobreMimPlaceHolder, setDescricaoSobreMimPlaceHolder] = useState('Escreva uma breve descrição sobre você...');
    const [nomeUsuario, setNomeUsuario] = useState(user.nome);
    const [telefone, setTelefone] = useState(user.telefone);
    const [endereco, setEndereco] = useState(user.endereco);
    const [imagem, setImagem] = useState(user.imagem);
    const [cnpj, setCnpj] = useState('');
    const [cadastrou, setCadastrou] = useState(false)

    let splitedData = user.dataNascimento.split('T')
    let newDate = splitedData[0].split('-')
    let dataFormatada = `${newDate[2]}/${newDate[1]}/${newDate[0]}`


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

        // if(nomeUsuario === user.nome && telefone === user.telefone && endereco === user.endereco && descricaoSobreMim === ''){
        //     // Se o usuário não inserir informações novas, a função será finalizada.
        //     console.log('encerrou')
        //     return;
        // }

        // Map necessário para validar se a descrição está vazia ou não.
        // Se o usuário não alterar nenhum caracter da Textarea, a useState "descricaoSobreMim" ficará vazia, mesmo se o Textarea da tela possuir um texto        
        //var descricao = '';
        // user.userProfissional.map((item) => {
        //     descricao = item.descricaoSobreMim            
        // })
        // console.log(descricao)

        // if(nomeUsuario === '' || telefone === '' || endereco === '' || descricaoSobreMim === '') {
        //     toast.warn('Campos de Nome, Telefone, Email e Descrição não podem ser vazios')
        //     return;
        // }

        if(nomeUsuario){
            if(!containsNumbers(nomeUsuario)){ // Verificando se o nome possui números ou caracteres inválidos.
                toast.error("Nome inválido")
                return;
            }
        }

        if(telefone){
            if(telefone.length < 11){
                toast.error("Telefone incompleto")
                return;
            }
        }

        let descricao = user.userProfissional.map((item) => item.descricaoSobreMim)

        if(cadastrou === false){
            if(descricao[0]){
                setDescricaoSobreMimPlaceHolder(descricao[0])
            }
    
            if(descricaoSobreMim === ''){
                setDescricaoSobreMimPlaceHolder('Escreva uma breve descrição sobre você...')
            }            
        }
        const api = setupAPIClient();

        try{
            if(descricaoSobreMim === '' && cadastrou === false){
                await api.put('/userinfo/update/profissional', {
                    nome: nomeUsuario,
                    telefone: telefone,
                    endereco: endereco,
                    cnpj: cnpj,
                    descricaoSobreMim: descricao[0],
                })
            } else if(descricaoSobreMim === '' && cadastrou === true) {
                await api.put('/userinfo/update/profissional', {
                    nome: nomeUsuario,
                    telefone: telefone,
                    endereco: endereco,
                    cnpj: cnpj,
                    descricaoSobreMim: descricaoSobreMimPlaceHolder,
                })
            } else {
                await api.put('/userinfo/update/profissional', {
                    nome: nomeUsuario,
                    telefone: telefone,
                    endereco: endereco,
                    cnpj: cnpj,
                    descricaoSobreMim: descricaoSobreMim,
                })
            }
        } catch(err){
            const { error } = err.response.data
            toast.error('Ops! Erro inesperado, favor contatar o suporte! ' + error)            
        }

        if(nomeUsuario){
            setNomeUsuario(nomeUsuario)
        }
        if(telefone){
            setTelefone(telefone)
        }
        if(endereco){
            setEndereco(endereco)
        }

        if(descricaoSobreMim){
            setCadastrou(true)
            setDescricaoSobreMimPlaceHolder(descricaoSobreMim)
        }
        
        setDescricaoSobreMim('')        
        toast.success('Dados atualizados com sucesso!');
    }

    return(
        
        <div>
            <ReturnButton/>
            <div className={styles.container}>
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
                            
                            {user.userProfissional.map((item)=>{

                                {cnpj === '' ? (setCnpj(item.cnpj)) : (<></>) }

                                return(
                                    <div key={user.id}>
                                        
                                        <div className={styles.DadosInfos}>
                                            <h2 className={styles.DadosPessoaisSubTitle}>CNPJ: </h2>
                                            <MaskedInput
                                                style={{marginBottom:"0", padding:"0"}}         
                                                mask={"99.999.999/9999-99"}
                                                disabled={true}
                                                value={item.cnpj}                                                
                                                onChange={() => {}}
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
                                        value={telefone}
                                        onChange={(e) => setTelefone(retiraMascara(e.target.value))}                                        
                                    />
                            </div>

                            <div className={styles.DadosInfos}>
                                <h2 className={styles.DadosPessoaisSubTitle}>Data de Nascimento: </h2>
                                    <input
                                        disabled={true}
                                        value={dataFormatada}
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

                        <div className={styles.cardSobreMim}>
                            <h1 className={styles.DadosPessoaisTitle}>Sobre Mim</h1>
                            
                            {user.userProfissional.map((item)=>{
                                return(                                
                                    <div key={user.id}>
                                        {item.descricaoSobreMim === '' || item.descricaoSobreMim === null ? (
                                            <textarea 
                                                className={styles.TextAreaSobreMim}
                                                maxLength={265}
                                                placeholder={descricaoSobreMimPlaceHolder}
                                                value={descricaoSobreMim}
                                                onChange={(e) => setDescricaoSobreMim(e.target.value)}
                                            /> 
                                        ) : (
                                            cadastrou === true ? (
                                                <textarea 
                                                    className={styles.TextAreaSobreMim}
                                                    maxLength={265}
                                                    placeholder={descricaoSobreMimPlaceHolder}
                                                    value={descricaoSobreMim}
                                                    onChange={(e) => setDescricaoSobreMim(e.target.value)}
                                                />        
                                            ) : (
                                                <textarea 
                                                    className={styles.TextAreaSobreMim}
                                                    maxLength={265}
                                                    placeholder={item.descricaoSobreMim}
                                                    value={descricaoSobreMim}
                                                    onChange={(e) => setDescricaoSobreMim(e.target.value)}
                                                />
                                            )
                                        )}
                                    </div>
                                )
                            })}
                            
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

export const getServerSideProps = canSSRProf(async (ctx) => {
    
    const api = setupAPIClient(ctx);

    const user = await api.get('/userinfo');

    return{
        props: {
            userData: user.data
        }
    }
})