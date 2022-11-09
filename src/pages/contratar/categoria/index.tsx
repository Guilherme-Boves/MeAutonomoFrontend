import { useState, useRef } from 'react';
import styles from './styles.module.css'
import Image from 'next/image';
import { ReturnButton } from '../../../components/ui/ReturnButton';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { setupAPIClient } from '../../../services/api';
import { CategoriaProps } from '../../tiposervico/cadastrar'
import Link from 'next/link';
import { TbArrowUpRight } from 'react-icons/tb';
import { IoIosArrowBack,IoIosArrowForward } from 'react-icons/io';


export default function Categoria({ listaCategorias }: CategoriaProps){

    const [categorias, setCategorias] = useState(listaCategorias || []);
    const carousel = useRef(null);
    
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
                    <h1 className='flex mx-auto text-3xl text-white font-bold'>Vamos lá,{<div className='text-[#FFD666] ml-1'>Luiz Henrique</div>}! Selecione a categoria desejada!</h1>
                </div>


                
                <div className="max-w-screen-xl flex mx-auto">
                    <div className="max-w-[75vw]">
                        {categorias.length === 0 &&(
                            <div className='flex ml-[350px] overflow-x-auto scroll-smooth scrollbar' ref={carousel}>
                                <div className='flex flex-none m-10 p-10 space-x-12'>
                                    {categorias.length === 0 ? (
                                        <>
                                            <div className='flex flex-col items-center mx-auto'>
                                                <img src="/images/ErroEncontrar.png" alt="" width={150} height={150}/>
                                                <h1 className='font-bold text-white text-xl py-5'>Ops! Parece que nenhuma categoria foi encontrada...</h1>
                                            </div>
                                        </>
                                        ) : (
                                            categorias.map((item) => {
                                                const {id, nome, imagem} = item;     
                                                return(            
                                                    <div key={id}>
                                                        <img className="rounded-t-2xl shadow-2xl max-w-full 2xl:max-w-full object-cover w-[300px] h-[300px]" 
                                                        src={`http://localhost:3333/files/${imagem}`}  />
                                                        <div className="bg-white shadow-2xl rounded-b-3xl">
                                                            <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">{nome}</h2>
                                                            <Link href={`/contratar/categoria/${id}`}>
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

                        {categorias.length >= 1 &&(
                            <div className='flex overflow-x-auto scroll-smooth scrollbar' ref={carousel}>
                                <div className='flex flex-none m-10 p-10 space-x-12'>
                                    {categorias.length === 0 ? (
                                            <h1 className='font-bold text-white'>Nenhuma categoria encontrada</h1>
                                        ) : (
                                            categorias.map((item) => {
                                                const {id, nome, imagem} = item;     
                                                return(            
                                                    <div key={id}>
                                                        <img className="rounded-t-2xl shadow-2xl max-w-full 2xl:max-w-full object-cover w-[300px] h-[300px]" 
                                                        src={`http://localhost:3333/files/${imagem}`}  />
                                                        <div className="bg-white shadow-2xl rounded-b-3xl">
                                                            <h2 className="text-center text-gray-800 text-2xl font-bold pt-6">{nome}</h2>
                                                            <Link href={`/contratar/categoria/${id}`}>
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


                        {categorias.length >= 4 &&(                       
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
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/categorias')
  
    return {
        props: {
            listaCategorias: response.data
        }
    }
})
