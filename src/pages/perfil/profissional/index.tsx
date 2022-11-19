import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { ReturnButton } from "../../../components/ui/ReturnButton";
import { setupAPIClient } from "../../../services/api";
import styles from '../styles.module.css'
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { canSSRProf } from "../../../utils/canSSRProf";
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
    const [nomeUsuario, setNomeUsuario] = useState(user.nome);
    const [telefone, setTelefone] = useState(user.telefone);
    const [endereco, setEndereco] = useState(user.endereco);
    const [imagem, setImagem] = useState(user.imagem);
    const [cnpj, setCnpj] = useState('');

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

        // if(nomeUsuario === user.nome && telefone === user.telefone && endereco === user.endereco){
        //     // Se o usuário não inserir informações novas, a função será finalizada.           
        //     return;
        // }
        if(nomeUsuario === null || telefone === null || endereco === null || descricaoSobreMim === null) {
            toast.warn('Campos de Nome, Telefone, Email e Descrição não podem ser vazios')
            return;
        }

        if(nomeUsuario.length === 0 || telefone.length === 0 || endereco.length === 0 || descricaoSobreMim.length === 0) {
            toast.warn('Campos de Nome, Telefone, Email e Descrição não podem ser vazios')
            return;
        }


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
       
        const api = setupAPIClient();

        try{
            await api.put('/userinfo/update/profissional', {
                nome: nomeUsuario,
                telefone: telefone,
                endereco: endereco,
                cnpj: cnpj,
                descricaoSobreMim: descricaoSobreMim,
            })
        } catch(err){
            const { error } = err.response.data
            toast.error('Ops! Erro inesperado, favor contatar o suporte! ' + error)            
        }

        setNomeUsuario(nomeUsuario)
        setTelefone(telefone)
        setEndereco(endereco)
        setDescricaoSobreMim(descricaoSobreMim)
    
        toast.success('Dados atualizados com sucesso!');
    }

    useEffect(() => {
        function loadDescricao(){
            let descricao = user.userProfissional.map((item) => {
                return(item.descricaoSobreMim)
            })
            setDescricaoSobreMim(descricao.toString())
        }
        loadDescricao();
    }, [user.userProfissional])

    return(
        // <div>
        //     <ReturnButton/>
        //     <div className={styles.container}>
        //         <div className={styles.imagemContainer}>
        //             {imagem === '' || imagem === null ? (
        //                 <label className={styles.label}>
        //                 <span className={styles.span}>
        //                     <FiUpload size={25} />
        //                 </span>

        //                 <input type="file" accept="image/png, image/jpeg"  className={styles.input} onChange={handleFile}/>
                        
        //             </label>
        //             ) : (
        //                 <div>
        //                     <label className={styles.label}>
        //                         <span className={styles.span}>
        //                             <FiUpload size={25} />
        //                         </span>

        //                         <input type="file" accept="image/png, image/jpeg"  className={styles.input} onChange={handleFile}/>
                                
        //                         <Image className={styles.preview} src={`http://localhost:3333/files/${imagem}`} alt={'Imagem de perfil do usuário'} width={250} height={250} />     
                                
        //                     </label>
        //                 </div>
        //             )}
        //         </div>

        //         <h1 className={styles.nome}>{user.nome}</h1>

        //         <div className={styles.containerCards}>
        //             <form onSubmit={handleSalvarInformacoes}>
        //                 <h1>Meus Dados</h1>
        //                 <div className={styles.linhaHorizontal}></div>
        //                 <div className={styles.cardDadosDaConta}>

        //                     <h1 className={styles.DadosContaTitle}>Dados da Conta</h1>
        //                     <div className={styles.DadosInfos}>
        //                         <h2 className={styles.DadosContaSubTitle} style={{marginBottom:'1rem'}}>Nome de Usuário: </h2>
        //                         <input
        //                             value={nomeUsuario}
        //                             onChange={(e) => setNomeUsuario(e.target.value)}
        //                         />
        //                     </div>

        //                     <div className={styles.DadosInfos}>
        //                         <h2 className={styles.DadosContaSubTitle}>Email: </h2>
        //                         <input
        //                             disabled={true}
        //                             value={user.email}
        //                         />
        //                     </div>

        //                 </div>
                        
        //                 <div className={styles.cardDadosPessoais}>
        //                     <h1 className={styles.DadosPessoaisTitle}>Dados Pessoais</h1>
        //                     <div className={styles.DadosInfos}>
        //                         <h2 className={styles.DadosPessoaisSubTitle}>Nome Completo: </h2>
        //                         <input
        //                             value={nomeUsuario}
        //                             onChange={(e) => setNomeUsuario(e.target.value)}
        //                         />
        //                     </div>
                            
        //                     {user.userProfissional.map((item)=>{

        //                         {cnpj === '' ? (setCnpj(item.cnpj)) : (<></>) }

        //                         return(
        //                             <div key={user.id}>
                                        
        //                                 <div className={styles.DadosInfos}>
        //                                     <h2 className={styles.DadosPessoaisSubTitle}>CNPJ: </h2>
        //                                     <MaskedInput
        //                                         style={{marginBottom:"0", padding:"0"}}         
        //                                         mask={"99.999.999/9999-99"}
        //                                         disabled={true}
        //                                         value={item.cnpj}                                                
        //                                         onChange={() => {}}
        //                                     />
        //                                 </div>
        //                             </div>
        //                         )
        //                     })}
                                                        
        //                     <div className={styles.DadosInfos}>
        //                         <h2 className={styles.DadosPessoaisSubTitle}>Telefone: </h2>
        //                             <MaskedInput
        //                                 style={{marginBottom:"0", padding:"0"}}                                       
        //                                 mask={"(99) 99999-9999"}
        //                                 maskChar={''}
        //                                 value={telefone}
        //                                 onChange={(e) => setTelefone(retiraMascara(e.target.value))}                                        
        //                             />
        //                     </div>

        //                     <div className={styles.DadosInfos}>
        //                         <h2 className={styles.DadosPessoaisSubTitle}>Data de Nascimento: </h2>
        //                             <input
        //                                 disabled={true}
        //                                 value={ShortDateFormat(user.dataNascimento)}
        //                             />
        //                     </div>

        //                     <div className={styles.DadosInfos}>
        //                         <h2 className={styles.DadosPessoaisSubTitle}>Endereço: </h2>
        //                             <input
        //                                 value={endereco}
        //                                 onChange={(e) => setEndereco(e.target.value)}
        //                             />
        //                     </div>
                            
        //                 </div>

        //                 <div className={styles.cardSobreMim}>
        //                     <h1 className={styles.DadosPessoaisTitle}>Sobre Mim</h1>

        //                     <textarea 
        //                         className={styles.TextAreaSobreMim}
        //                         maxLength={265}
        //                         placeholder={'Escreva uma breve descrição sobre você...'}
        //                         value={descricaoSobreMim}
        //                         onChange={(e) => setDescricaoSobreMim(e.target.value)}
        //                     /> 
                            
        //                 </div>
                    
        //                 <div className={styles.button}>
        //                     <button type="submit">
        //                         Salvar
        //                     </button>
        //                 </div>

        //             </form>        
        //         </div>
        //     </div>
        // </div>
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

                                {user.userProfissional.map((item)=>{
                                    
                                    {cnpj === '' ? (setCnpj(item.cnpj)) : (<></>) }
                                    
                                    return(
                                        <div key={user.id}>
                                            <label className="block mb-2 text-sm font-bold text-gray-70 lg:px-16 text-gray-700">CNPJ</label>
                                            <div className="pb-8">
                                                <MaskedInput 
                                                    className="text-sm rounded-lg block w-[803px] p-2.5 ml-[63px] shadow-md" 
                                                    onChange={() => {}}
                                                    mask={"99.999.999/9999-99"}
                                                    disabled={true}
                                                    value={item.cnpj}
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

                            <div className="mt-10 flex flex-col justify-center bg-[#EBF2F5] rounded-lg">
                                <div className="flex w-[85%] ml-auto mr-auto py-3 items-center">
                                    <div className="flex-grow border-t-2 border-gray-700 "></div>
                                    <span className="flex-shrink mx-4 text-gray-700 font-bold">Sobre Mim</span>
                                    <div className="flex-grow border-t-2 border-gray-700"></div>
                                </div>

                                <div className="mb-6">
                                    <textarea 
                                    className="text-sm rounded-lg block w-[803px] p-2.5 ml-[63px] shadow-md" 
                                    maxLength={265}
                                    placeholder={'Escreva uma breve descrição sobre você...'}
                                    value={descricaoSobreMim}
                                    onChange={(e) => setDescricaoSobreMim(e.target.value)}
                                    rows={5}
                                    />
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

export const getServerSideProps = canSSRProf(async (ctx) => {
    
    const api = setupAPIClient(ctx);

    const user = await api.get('/userinfo');
        
    return{
        props: {
            userData: user.data
        }
    }
})