import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'

export function ReturnButtonWithFunction({onClick}) {
    
    const router = useRouter()

    return (
<<<<<<< HEAD
        <button onClick={() => router.back()} className='bg-[#12AFCB] rounded-xl w-10 h-10 shadow hover:bg-[#56CCF2] transition-colors'>
=======
        <button onClick={onClick} className='bg-[#12AFCB] rounded-xl w-10 h-10 shadow hover:bg-[#56CCF2] transition-colors'>
>>>>>>> 5115ae991ceb317fcbe4a8ed4925934bbc2e891c
            <FiArrowLeft size={28} color="white" className='mx-auto' />
        </button>
    )
}