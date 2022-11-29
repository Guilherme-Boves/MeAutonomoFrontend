import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'

export function ReturnButtonWithFunction({onClick}) {
    
    const router = useRouter()

    return (
        <button onClick={onClick} className='bg-[#12AFCB] rounded-xl w-10 h-10 shadow hover:bg-[#56CCF2] transition-colors'>
            <FiArrowLeft size={28} color="white" className='mx-auto' />
        </button>
    )
}