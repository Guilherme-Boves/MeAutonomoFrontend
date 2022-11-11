import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReturnButton } from '../../../../../components/ui/ReturnButton';
import { setupAPIClient } from '../../../../../services/api';
import { canSSRAuth } from '../../../../../utils/canSSRAuth'
import styles from '../../styles.module.css'
import { TbArrowUpRight } from 'react-icons/tb';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type ItemProps = {    
    publicacao:{
        user:{
            id: string;
            nome: string;
            imagem: string;
        }
    }
}

interface ListPerfisProps {
    listPerfis: ItemProps[];
}

// Neste componente será listado todos os profissionais que prestam o tipo de serviço escolhido pelo usuário
export default function Perfis({ listPerfis }: ListPerfisProps) {

    const router = useRouter();
    const categoria_id = router.query.categoria_id;
    const tipoServico_id = router.query.perfis_id;

    const [perfis, setPerfis] = useState(listPerfis || []);
    const [nomeTipoServico, setNomeTipoServico] = useState('');
    const carousel = useRef(null);

    useEffect(() => {
        
        function loadNomeTipoServico() {
            setNomeTipoServico(localStorage.getItem("ls_NomeTipoServico"))
        }

        loadNomeTipoServico();
    }, [])

    const handleLeftClick = (e) =>{
        e.preventDefault();
        carousel.current.scrollLeft -= carousel.current.offsetWidth;
    }

    const handleRightClick = (e) =>{
        e.preventDefault();
        carousel.current.scrollLeft += carousel.current.offsetWidth;
    }

    return(
        <>
            <div className='bg-gradient-to-b from-[#12afcb] to-[#ebf2f5] w-full min-h-screen justify-center items-center'>
                <div className='ml-10 p-3'>
                    <ReturnButton/>
                </div>

                <div className='flex p-5'>
                    <h1 className='flex mx-auto text-4xl text-[#FFD666] font-bold'>{nomeTipoServico}</h1>
                </div>
                <div className='flex'>
                    <h1 className='flex mx-auto text-3xl text-white font-bold'>Estes são alguns dos profissionais próximos de você!</h1>
                </div>

                <div className="max-w-screen-xl flex mx-auto">
                    <div className="max-w-[75vw]">

                        {perfis.length === 0 &&(
                            <div className='flex ml-[350px] overflow-x-auto scroll-smooth scrollbar' ref={carousel}>
                                <div className='flex flex-none m-10 p-10 space-x-12'>
                                    {perfis.length === 0 ? (
                                        <>
                                            <div className='flex flex-col items-center mx-auto'>
                                                <img src="/images/ErroEncontrar.png" alt="" width={150} height={150}/>
                                                <h1 className='font-bold text-white text-xl py-5'>Ops! Parece que nenhum profissional foi encontrado...</h1>
                                            </div>
                                        </>
                                    ) : (
                                        perfis.map((item) => {
                                            const {id, nome, imagem} = item.publicacao.user; 
                                            return(                            
                                                <div key={id}>
                                                    <img className="rounded-t-2xl shadow-2xl max-w-full 2xl:max-w-full object-cover w-[300px] h-[300px]" 
                                                    src={`http://localhost:3333/files/${imagem}`}  />
                                                    <div className="bg-white shadow-2xl rounded-b-3xl">
                                                        <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">{nome}</h2>                                                                                                                
                                                        <Link href={`/contratar/categoria/${categoria_id}/perfis/${tipoServico_id}/perfil/${id}`}>
                                                            <div className="cursor-pointer bg-[#12AFCB] w-72 lg:w-5/6 m-auto mt-6 p-2 hover:bg-[#56CCF2] transition-colors rounded-2xl  text-white text-center shadow-xl shadow-bg-blue-700">
                                                                <button className="lg:text-sm text-lg font-bold">
                                                                    <TbArrowUpRight size={28}/>
                                                                </button>
                                                            </div>
                                                        </Link>
                                                        <div className="text-center m-auto mt-6 w-full h-5"></div>                        
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                        {perfis.length >= 1 &&(
                            <div className='flex overflow-x-auto scroll-smooth scrollbar' ref={carousel}>
                                <div className='flex flex-none m-10 p-10 space-x-12'>
                                    {perfis.length === 0 ? (
                                            <h1 className='font-bold text-white'>Nenhum Profissional foi encontrado</h1>
                                        ) : (
                                            perfis.map((item, index) => {
                                                const {id, nome, imagem} = item.publicacao.user;
                                                return(            
                                                    <div key={id}>
                                                        <img className="rounded-t-2xl shadow-2xl max-w-full 2xl:max-w-full object-cover w-[300px] h-[300px]" 
                                                        src={`http://localhost:3333/files/${imagem}`}  />
                                                        <div className="bg-white shadow-2xl rounded-b-3xl">
                                                            <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">{nome}</h2>                                                                                                                        
                                                            <Link href={`/contratar/categoria/${categoria_id}/perfis/${tipoServico_id}/perfil/${id}`}>
                                                                <div className="cursor-pointer bg-[#12AFCB] w-72 lg:w-5/6 m-auto mt-6 p-2 hover:bg-[#56CCF2] transition-colors rounded-2xl  text-white text-center shadow-xl shadow-bg-blue-700">
                                                                    <button className="lg:text-sm text-lg font-bold">
                                                                        <TbArrowUpRight size={28}/>
                                                                    </button>
                                                                </div>
                                                            </Link>
                                                            <div className="text-center m-auto mt-6 w-full h-5"></div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                </div>
                            </div>
                        )}


                        {perfis.length >= 4 &&(                       
                            <div className='w-auto text-center space-x-3'>
                                <button className='bg-[#12AFCB] rounded-xl w-10 h-10 shadow hover:bg-[#56CCF2] transition-colors' onClick={handleLeftClick}>
                                    <IoIosArrowBack color="white" className='mx-auto' size={28}/>
                                </button>    

                                <button className='bg-[#12AFCB] rounded-xl w-10 h-10 shadow hover:bg-[#56CCF2] transition-colors'  onClick={handleRightClick}>
                                    <IoIosArrowForward color="white" className='mx-auto' size={28}/>
                                </button>       
                            </div>
                        )}

                    </div>
                </div>
            </div>

        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    const tipoDoServicoId = ctx.query.perfis_id;

    const api = setupAPIClient(ctx);

    const response = await api.get(`perfis?tipoDoServico_id=${tipoDoServicoId}`)
    
    return{
        props: {
            listPerfis: response.data
        }
    }
})