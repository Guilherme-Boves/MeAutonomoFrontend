import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'
import styles from './styles.module.css'

export function ReturnButton() {
    
    const router = useRouter()

    return (
        <div onClick={() => router.back()} className={styles.container}>
            <FiArrowLeft size={28} className={styles.button} />
        </div>
    )
}