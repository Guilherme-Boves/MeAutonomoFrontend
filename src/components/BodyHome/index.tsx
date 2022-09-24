import { BsFillArrowRightCircleFill } from "react-icons/bs";
import Link from 'next/link';
import Typed from 'react-typed'

export function Body(){
    return(
        <div className="mt-12">
            <div className="flex flex-col">
                <div className="max-w-[1280px] mt-[-96px] w-full min-h-[748px] mx-auto text-center flex flex-col justify-center">
                    <h1 className="text-8xl font-extrabold text-white">
                        Uma nova forma de 
                    </h1>
                    
                    <Typed 
                    className="text-8xl font-extrabold text-white"
                    strings={['contratar profissionais','divulgar serviços']} 
                    typeSpeed={80} 
                    backSpeed={60} 
                    loop/>
                    
                    <div>
                        <p className="text-xl font-semibold py-10 text-white">
                            Conte o que precisa, converse com o autônomo, contrate e pague tudo <br /> em um único lugar.
                        </p>
                    </div>

                    <Link href={"/tipoconta"}>
                        <a href="" className="text-2xl my-6 mx-auto py-4 w-56 flex items-center justify-center bg-[#FFD666] text-[#8D734B] rounded-[12px] font-extrabold gap-2 shadow-lg hover:bg-yellow-200 transition-colors">
                            Começar
                            <BsFillArrowRightCircleFill size={28}/>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
} 