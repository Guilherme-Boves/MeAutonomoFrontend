import { useRouter } from 'next/router'
import { FiArrowLeft } from 'react-icons/fi'
import styles from './styles.module.css'

export function ReturnButtonWithFunction({onClick}) {
    
    const router = useRouter()

    return (
        <div onClick={onClick} className={styles.container}>
            <FiArrowLeft size={28} className={styles.button} />
        </div>
    )
}