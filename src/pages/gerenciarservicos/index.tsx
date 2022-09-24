import Link from 'next/link';
import React, { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { ReturnButton } from '../../components/ui/ReturnButton';
import styles from './styles.module.css'

export default function GerenciarServicos() {

    const [publicacoes, setPublicacoes] = useState([]);

    async function criarNovaPublicacao() {
        
        // const response = await api.post('/publicacao', {
        //     user_id: user_id // Pegar o user_id pelo Token
        // })
        alert('clicou')
        
    }

    return(

        <>
        <ReturnButton/>
            <div className={styles.container}>
                <div className={styles.containertitle}>
                    <h1>Meus Serviços</h1>
                    <div className={styles.novoServico}>
                        <Link href={'/gerenciarservicos/novapublicacao'}>
                            <Button onClick={criarNovaPublicacao}>
                                Nova publicação
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className={styles.publicacoes}>
                    {publicacoes.length === 0 ? (
                        <h1>Nenhum serviço foi publicado</h1>
                    ) : (
                        <></> // Map para printar os serviços na tela
                    )}

                </div>
            </div>
        </>
        
    )
}