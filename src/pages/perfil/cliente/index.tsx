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
import { MdEmail } from "react-icons/md";

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

        if(nomeUsuario === null || telefone === null || endereco === null) {
            toast.warn('Campos de Nome, Telefone, Email')
            return;
        }

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

    return (
        <>
        <div className="p-14 ">
            <ReturnButton />
                <div className="flex justify-center">
                    <div className="p-8 bg-white shadow mt-24 rounded-2xl w-[1000px]">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="grid grid-cols-2 text-center order-last md:order-first mt-20 md:mt-0" />
                            <div className="relative">
                                <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-2xl shadow-xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                                    {imagem === '' || imagem === null ? (
                                     
                                     <label className={styles.label}>
                                        <span className={styles.span}>
                                            <FiUpload size={25} />
                                        </span>
                
                                        <input type="file" accept="image/png, image/jpeg"  className={styles.input} onChange={handleFile}/>
                                    </label>
                                    ):(
                                        <div>
                                            <label className={styles.label}>
                                            <span className={styles.span}>
                                                <FiUpload size={25} />
                                            </span>
                    
                                            <input type="file" accept="image/png, image/jpeg"  className={styles.input} onChange={handleFile}/>
                                            
                                            <img className="w-[200px] h-[200px] rounded-lg" src={`http://localhost:3333/files/${imagem}`} alt=""/>
                                        </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 text-center border-b pb-12 ">
                            <div className='items-center justify-center flex flex-row'>
                                <div className='mx-48 flex items-center p-10'>
                                    <h1 className="text-4xl font-medium  text-gray-700">{user.nome}</h1>
                                </div>
                            </div>
                            <p className="text-gray-500 font-bold text-xl">Meus Dados</p>
                        </div>
                        
                        <form onSubmit={handleSalvarInformacoes}>
                            <div className="mt-10 flex flex-col justify-center bg-[#EBF2F5] rounded-lg">
                                <div className="flex w-[85%] ml-auto mr-auto py-3 items-center">
                                    <div className="flex-grow border-t-2 border-gray-700 "></div>
                                    <span className="flex-shrink mx-4 text-gray-700 font-bold">Dados da Conta</span>
                                    <div className="flex-grow border-t-2 border-gray-700"></div>
                                </div>

                                <div className="mb-6">
                                    <label className="block mb-2 text-sm font-bold text-gray-700 lg:px-16">Usuário</label>
                                    <input type="text" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} className="text-sm rounded-lg block w-[803px] p-2.5 ml-[63px] shadow-md"/>
                                </div>

                                <label className="block mb-2 text-sm font-bold text-gray-70 lg:px-16 text-gray-700">Seu e-mail</label>
                                <div className="pb-8">
                                    <input type="text" disabled={true} value={user.email} className="text-sm rounded-lg block w-[803px] p-2.5 ml-[63px] shadow-md"/>
                                </div>
                                
                            </div>

                            <div className="mt-12 flex flex-col justify-center bg-[#EBF2F5] rounded-lg">
                                <div className="flex w-[85%] ml-auto mr-auto py-3 items-center">
                                    <div className="flex-grow border-t-2 border-gray-700 "></div>
                                    <span className="flex-shrink mx-4 text-gray-700 font-bold">Dados Pessoais</span>
                                    <div className="flex-grow border-t-2 border-gray-700"></div>
                                </div>       
                                
                                <div className="mb-6">
                                    <label className="block mb-2 text-sm font-bold text-gray-700 lg:px-16">Nome Completo</label>
                                    <input type="text" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} className="text-sm rounded-lg block w-[803px] p-2.5 ml-[63px] shadow-md"/>
                                </div>

                                {user.userCliente.map((item)=>{
                                    
                                    {cpf === '' ? (setCpf(item.cpf)) : (<></>) }
                                    
                                    return(
                                        <div key={user.id}>
                                            <label className="block mb-2 text-sm font-bold text-gray-70 lg:px-16 text-gray-700">CPF</label>
                                            <div className="pb-8">
                                                <MaskedInput 
                                                    className="text-sm rounded-lg block w-[803px] p-2.5 ml-[63px] shadow-md" 
                                                    onChange={() => {}}
                                                    mask={'999.999.999-99'}
                                                    disabled={true}
                                                    value={item.cpf}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}

                                <div className="mb-6">
                                    <label className="block mb-2 text-sm font-bold text-gray-700 lg:px-16">Telefone</label>
                                    <MaskedInput 
                                        className="text-sm rounded-lg block w-[803px] p-2.5 ml-[63px] shadow-md"
                                        mask={"(99) 99999-9999"}
                                        maskChar={''}
                                        onChange={(e) => setTelefone(retiraMascara(e.target.value))}
                                        value={telefone}
                                    />
                                </div>

                                <label className="block mb-2 text-sm font-bold text-gray-70 lg:px-16 text-gray-700">Data de Nascimento</label>
                                <div className="pb-8">
                                    <input disabled={true} value={ShortDateFormat(user.dataNascimento)} className="text-sm rounded-lg block w-[803px] p-2.5 ml-[63px] shadow-md"/>
                                </div>

                                <div className="mb-6">
                                    <label className="block mb-2 text-sm font-bold text-gray-700 lg:px-16">Endereço</label>
                                    <input value={endereco} onChange={(e) => setEndereco(e.target.value)} className="text-sm rounded-lg block w-[803px] p-2.5 ml-[63px] shadow-md"/>
                                </div>

                            </div>

                            <div className="cursor-pointer bg-[#12AFCB] w-72 lg:w-5/6 m-auto mt-6 p-2 hover:bg-[#56CCF2] transition-colors rounded-2xl text-white text-center shadow-xl shadow-bg-blue-700">
                                <button type="submit" className="text-base font-bold">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                    
                </div>
        </div>  
        </>
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