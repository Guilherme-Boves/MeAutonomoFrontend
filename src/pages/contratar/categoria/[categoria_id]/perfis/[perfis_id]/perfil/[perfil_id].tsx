import React, { useContext, useState, useEffect } from 'react';
import { canSSRAuth } from '../../../../../../../utils/canSSRAuth';
import { setupAPIClient } from '../../../../../../../services/api';
import Image from 'next/image';
import styles from './styles.module.css'
import { ReturnButton } from '../../../../../../../components/ui/ReturnButton';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../../../../../contexts/AuthContext';
import { DateFormat, ShortDateFormat } from '../../../../../../../utils/Functions';
import { FiAward, FiCheck, FiMail, FiMapPin } from 'react-icons/fi';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent } from '@mui/material';
import { Rating } from '@mui/material'
import { toast } from 'react-toastify';
import { MdPlace, MdVerified } from 'react-icons/md';
import { BsPersonCheckFill, BsWhatsapp } from 'react-icons/bs';
import {IoInformationCircle} from 'react-icons/io5';
import {FaRegGrinStars} from 'react-icons/fa';

type ItemProps = {
    id: string;
    descricao: string;
    publicacao_id: string;
    tipoDoServico: {
        id: string;
        nome: string;
        imagem: string;
    },
    publicacao: {
        id: string;
        user: {
            id: string;
            nome: string;
            imagem: string;
            endereco: string;
            telefone: string;
            userProfissional: [{
                descricaoSobreMim: string;
            }]
        }
    },
    servicosPrestadosProf: [{
        id: string;
        nome: string;
        preco: string;
    }],
    agenda: [{
        id: string;
        data: string;
        status: boolean;
    }]
}

type ItemAvaliacaoProps = {
    id: string;
    descricao: string;
    nota: string;
    userProfissional_id: string;
    created_at: string;
    contrato_id: string;
    contrato: {
        userCliente: {
            nome: string;
        }
    }
    avaliacao_id: string;
}

interface PerfilProps {
    perfilProf: ItemProps[];
}

// Neste componente será exibido a página do perfil do usuário escolhido
export default function Perfil({ perfilProf }: PerfilProps) {

    const user = useContext(AuthContext)
    const router = useRouter();

    const [perfil, setPerfil] = useState(perfilProf || [])
    const [avaliacao, setAvaliacao] = useState<number | null>(0)
    const [avaliacoes, setAvaliacoes] = useState<ItemAvaliacaoProps[]>([])
    const [open, setOpen] = useState(false);
    const [opcao, setOpcao] = useState('');
    const [descricao, setDescricao] = useState('')

    const categoria_id = router.query.categoria_id;
    const tipoServico_id = router.query.perfis_id;
    const perfil_id = router.query.perfil_id;

    useEffect(() => {

        async function loadRating() {

            const userProfissional_id = router.query.perfil_id

            try {
                const api = setupAPIClient();

                const response = await api.get("/avaliacoes/id", {
                    params: {
                        userProfissional_id: userProfissional_id
                    }
                })

                setAvaliacoes(response.data)
                const data = [] = response.data;
                let notasSomadas = 0;
                notasSomadas = data.reduce((valorAnterior, valorAtual) => valorAnterior + parseFloat(valorAtual.nota), 0);
                setAvaliacao(notasSomadas / data.length)

            } catch (err) {
                toast.error("Ops! Erro inesperado!");
            }
        }

        loadRating();
    }, [router.query.perfil_id, avaliacao])

    async function handleCriarContrato() {

        const api = setupAPIClient();

        //Não é necessário passar o ID do userCliente_id pois o sistema pega o ID automaticamente pelo token de quem está logado
        const response = await api.post(`contrato?profissional_id=${perfil_id}`)

        const { id } = response.data

        router.push(`/contratar/categoria/${categoria_id}/perfis/${tipoServico_id}/perfil/${perfil_id}/contrato/${id}`)
    }

    const handleClickOpen = (op: number) => {

        if (op === 0) {
            setOpcao("Descrição do Profissional")
        } else if (op === 1) {
            setOpcao("Endereço")
        } else if (op === 2) {
            setOpcao("Avaliações")
        }

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div className="p-14">
                <ReturnButton/>
                {perfil.map((item)=> {
                    const profissionalTelefone = item.publicacao.user.telefone;
                    
                    return(
                        <div key={item.id}>
                            <div className="p-8 bg-white shadow mt-24 rounded-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-3">
                                    <div className="grid grid-cols-2 text-center order-last md:order-first mt-20 md:mt-0"/>
                                    <div className="relative">
                                        <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-2xl shadow-xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                                            <img className="rounded-lg w-[200px] h-[200px]" src={`http://localhost:3333/files/${item.publicacao.user.imagem}`} alt="" />
                                        </div>
                                    </div>

                                    <div onClick={() => {}}
                                    className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                                        <button
                                            className="text-white py-2 px-4 rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                                        >
                                            <a 
                                                target="_blank"
                                                rel="noreferrer"
                                                href={`https://api.whatsapp.com/send?l=pt_BR&phone=55${profissionalTelefone}&text=Olá! Sou cliente do MeAutonomo! `}>
                                                    <BsWhatsapp size={28}/>                                                             
                                            </a>
                                        </button>

                                        <button
                                            className="text-white py-2 px-4 rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5" onClick={e => handleClickOpen(1)}
                                        >
                                            <MdPlace size={28}/>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-20 text-center border-b pb-12 ">
                                    <div className='items-center justify-center flex flex-row'>

                                        <button onClick={e => handleClickOpen(0)}
                                            className="w-52 text-lg h-14 flex items-center justify-center bg-[#12AFCB] text-white rounded-lg font-extrabold gap-2 shadow-lg hover:bg-[#56CCF2] transition-colors">
                                            <IoInformationCircle size={22} />
                                            Sobre Mim
                                        </button>

                                        <div className='mx-48 flex items-center'>
                                            <h1 className="text-4xl font-medium  text-gray-700">{item.publicacao.user.nome}</h1>
                                            <MdVerified className='ml-3' size={24} color="#089dea" />
                                        </div>

                                        <button onClick={handleCriarContrato}
                                            className="w-52 text-lg h-14 flex items-center justify-center bg-[#FFD666] text-[#8D734B] rounded-lg font-extrabold gap-2 shadow-lg hover:bg-yellow-200 transition-colors" >
                                            <BsPersonCheckFill size={22} />
                                            Contratar
                                        </button>

                                    </div>

                                    <div onClick={e => handleClickOpen(2)} style={{ cursor: 'pointer' }}>
                                        <Rating value={avaliacao} readOnly size={'medium'} precision={0.5} />
                                    </div>

                                    <p className="mt-8 text-gray-500">{item.tipoDoServico.nome}</p>

                                </div>

                                <div className="mt-12 flex flex-col justify-center bg-[#EBF2F5] rounded-lg">
                                    <div className="flex w-[92%] ml-auto mr-auto py-3 items-center">
                                        <div className="flex-grow border-t-2 border-[#4A4646] "></div>
                                        <span className="flex-shrink mx-4 text-[#4A4646] font-bold">Descrição</span>
                                        <div className="flex-grow border-t-2 border-[#4A4646]"></div>
                                    </div>

                                    <p className="pb-4 text-gray-600 font-light lg:px-16">{item.descricao}</p>
                                </div>

                                <div className='grid grid-cols-2 space-x-3'>
                                    <div className="mt-12 flex flex-col justify-center bg-[#EBF2F5] rounded-lg">
                                        <div className="flex w-[85%] ml-auto mr-auto py-3 items-center">
                                            <div className="flex-grow border-t-2 border-[#4A4646] "></div>
                                            <span className="flex-shrink mx-4 text-[#4A4646] font-bold">Serviços Prestados</span>
                                            <div className="flex-grow border-t-2 border-[#4A4646]"></div>
                                        </div>
                                        { item.servicosPrestadosProf.map((item) => 
                                            {
                                                return (
                                                    <div key={item.id} className="pb-4 text-gray-600 font-light lg:px-16">                                                    
                                                        <h1>{item.nome} - R${item.preco}</h1>
                                                    </div>
                                                )
                                            }) 
                                        }
                                        
                                    </div>

                                    <div className="mt-12 flex flex-col justify-center bg-[#EBF2F5] rounded-lg">
                                    <div className="flex w-[85%] ml-auto mr-auto py-3 items-center">
                                        <div className="flex-grow border-t-2 border-[#4A4646] "></div>
                                        <span className="flex-shrink mx-4 text-[#4A4646] font-bold">Agenda</span>
                                        <div className="flex-grow border-t-2 border-[#4A4646]"></div>
                                    </div>
                                        { item.agenda.map((item) => {
                                            return (
                                                <div key={item.id} className="pb-4 text-gray-600 font-light lg:px-16">
                                                    <h1>{DateFormat(item.data)}</h1>                                                    
                                                </div>
                                            )})
                                        }
                                    </div>
                                </div>
                                <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        fullWidth
                                    >
                                        {opcao.startsWith('D') ? (
                                            <div>
                                                <DialogTitle>
                                                    {"Sobre Mim"}
                                                </DialogTitle>
                                                    <DialogContent>
                                                    {item.publicacao.user.userProfissional.map(item => item.descricaoSobreMim)}
                                                </DialogContent>
                                            </div>
                                        ) : opcao.startsWith('E') ? (
                                            <div>
                                                <DialogTitle>
                                                    {"Endereço"}
                                                </DialogTitle>
                                                    <DialogContent>
                                                    {item.publicacao.user.endereco}
                                                </DialogContent>
                                            </div>
                                        ) : (
                                            <div>
                                                <DialogTitle>
                                                    {"Avaliações"}
                                                </DialogTitle>
                                                    <DialogContent>
                                                        {avaliacoes.length === 0 ? (
                                                            <h1>O profissional ainda não tem avaliações</h1>
                                                        ) : (
                                                            avaliacoes.map((item) => {
                                                                return(
                                                                    <div key={item.id}>
                                                                        <article>
                                                                            <div className="flex items-center mb-4 space-x-4">
                                                                                <img className="w-10 h-10 rounded-full" src="http://localhost:3333/files/45781a73126e1bc22c58dbd683e427f4-business-3d-close-up-of-businessman-in-dark-blue-suit-waving-hello.png" alt=""/>
                                                                                <div className="space-y-1 font-medium dark:text-white">
                                                                                    <p className='text-[#4A4646]'>{item.contrato.userCliente.nome} <p className="block text-sm text-[#4A4646]"></p></p>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <div className="flex items-center mb-1">
                                                                                <Rating value={Number(item.nota)} readOnly precision={0.5}/>
                                                                            </div>
                                            
                                                                            <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400"><p>Avaliação realizada em: {ShortDateFormat(item.created_at)} </p></footer>
                                                                            <p className="mb-2 font-light text-gray-500 dark:text-gray-400">{item.descricao}</p>
                                                                            <div className="flex w-[100%] ml-auto mr-auto py-3 items-center">
                                                                                <div className="flex-grow border-t-2 border-[#4A4646] "></div>
                                                                                <span className="flex-shrink mx-4 text-[#4A4646] font-bold"><FaRegGrinStars/></span>
                                                                                <div className="flex-grow border-t-2 border-[#4A4646]"></div>
                                                                            </div>
                                                                        </article>
                                                                        
                                                                    </div>
                                                                )
                                                            })
                                                        )}
                                                </DialogContent>
                                            </div>
                                        )}

                                        <DialogActions>
                                            <Button onClick={handleClose}>
                                                Fechar
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const tipoServicoId = ctx.query.perfis_id
    const profissionalId = ctx.query.perfil_id

    const api = setupAPIClient(ctx);

    const response = await api.get(`/perfil?perfis_id=${tipoServicoId}&perfil_id=${profissionalId}`)

    return {
        props: {
            perfilProf: response.data
        }
    }
})