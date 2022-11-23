export function AsideSignups(){
    return(
        <>
            <div className=" bg-fundo2 bg-cover bg-no-repeat bg-current w-screen h-screen flex flex-row justify-center items-center ">
                <div className='2xl:h-[870px] 2xl:w-[710px] w-[600px] h-[700px] mx-auto text-center flex flex-col justify-center border-collapse rounded-xl shadow-xl bg-gradient-to-b from-[#FFD666] to-[#15B6D6]'>
                    <div className='flex justify-center'>
                        <img className="w-[400px] h-[450px] 2xl:w-[450px] 2xl:h-[500px]" src="/images/carroselSignups.png" alt=""/> 
                    </div>

                    <div className='font-extrabold text-2xl mt-8'>
                        <p className='text-[#FFD666]'>Profissionais verificados atendem</p>  <p className='text-white'>ao seu pedido!</p>
                    </div>

                    <div className='font-extrabold text-base mt-5'>
                        <p className='text-white'>Escolha o melhor negociando diretamente com eles!</p> 
                    </div>

                    <div className="text-xs text-white mt-10">
                        Illustration by <a href="https://icons8.com/illustrations/author/zD2oqC8lLBBA">Icons 8</a> from <a href="https://icons8.com/illustrations">Ouch!</a>
                    </div>
                </div>
            </div>
        </>
    )
}