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

type ItemProps = {
    id: string;
    descricao: string;
    publicacao_id: string;
    tipoDoServico: {
        id: string;
        nome: string;
        imagem: string;
    },
    publicacao:{
        id:string;
        user:{
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
    servicosPrestadosProf:[{
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
    contrato:{
        userCliente:{
            nome: string;
        }
    }
    avaliacao_id: string;
}

interface PerfilProps {
    perfilProf: ItemProps[];
}

// Neste componente será exibido a página do perfil do usuário escolhido
export default function Perfil({ perfilProf }: PerfilProps){

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

            try{
                const api = setupAPIClient();
                
                const response = await api.get("/avaliacoes/id", {
                    params:{
                        userProfissional_id: userProfissional_id
                    }
                })

                setAvaliacoes(response.data)
                const data = [] = response.data;                    
                let notasSomadas = 0;
                notasSomadas = data.reduce( (valorAnterior, valorAtual) => valorAnterior + parseFloat(valorAtual.nota), 0);
                setAvaliacao(notasSomadas / data.length)

            } catch(err) {
                toast.error("Ops! Erro inesperado!");
            }
        }

        loadRating();
    }, [router.query.perfil_id, avaliacao])

    async function handleCriarContrato(){

        const api = setupAPIClient();

        //Não é necessário passar o ID do userCliente_id pois o sistema pega o ID automaticamente pelo token de quem está logado
        const response = await api.post(`contrato?profissional_id=${perfil_id}`)

        const { id } = response.data
        
        router.push(`/contratar/categoria/${categoria_id}/perfis/${tipoServico_id}/perfil/${perfil_id}/contrato/${id}`)
    }

    const handleClickOpen = (op: number) => {

        if(op === 0){
            setOpcao("Descrição do Profissional")
        } else if(op === 1){
            setOpcao("Endereço")
        } else if(op === 2){
            setOpcao("Avaliações")
        }

        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    return(
        
        <>
            <div className={styles.body}>
            <ReturnButton/>
                <div className={styles.container}>
                    <div className={styles.bodyImagem}>
                        {perfil.map((item, index)=> {

                            const profissionalTelefone = item.publicacao.user.telefone;
                                                                              
                            return(
                                <div key={item.id}>
                                    <div className={styles.containerMap}>                                    
                                        <div className={styles.containerImagem}>
                                                <Image src={`http://localhost:3333/files/${item.publicacao.user.imagem}`} alt={`Foto do Profissional`} width={200} height={200} />
                                        </div>

                                        <div className={styles.bodySobreMimNomeBtnContratar}>
                                            <div className={styles.containerNomeTipoServicoBtnContratar}>
                                                <div className={styles.containerSobreMim}>
                                                    <button className={styles.buttonSobreMim} onClick={e => handleClickOpen(0)}>
                                                        Sobre Mim
                                                    </button> 
                                                </div>

                                                <div className={styles.containerNomeServico}>
                                                    <h1 className={styles.Profnome}> { item.publicacao.user.nome } <FiCheck className={styles.check}/></h1>
                                                    <div onClick={e => handleClickOpen(2)} style={{cursor:'pointer'}}>
                                                        <Rating value={avaliacao} readOnly size={'small'} precision={0.5}/>
                                                    </div>                                                    
                                                    <h1 className={styles.tipoServicoTitle}>{ item.tipoDoServico.nome }</h1>
                                                </div>

                                                <div className={styles.containerContratar}>                                                                            
                                                    <button className={styles.buttonContratar} onClick={handleCriarContrato}>
                                                        Contratar
                                                    </button>                                        
                                                </div>

                                                <div className={styles.containerChat}>                                                                            
                                                    <button className={styles.buttonChat} onClick={() => {}}>
                                                        <a 
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            href={`https://api.whatsapp.com/send?l=pt_BR&phone=55${profissionalTelefone}&text=Olá! Sou cliente do MeAutonomo! `}>                                                                
                                                            <FiMail size={24}/>
                                                        </a>
                                                    </button>
                                                </div>

                                                <div className={styles.containerEndereco}>                                                                            
                                                    <button className={styles.buttonEndereco} onClick={e => handleClickOpen(1)}>
                                                        <FiMapPin size={24}/>
                                                    </button> 
                                                </div>

                                            </div>
                                        </div>

                                        <div className={styles.bodyDescricao}>
                                            <div className={styles.containerDescricao}>
                                                <h1 className={styles.cardTitle}>Descrição</h1>
                                                <div className={styles.linhaHorizontal} style={{marginBottom:'1rem'}}></div>
                                                <h1>{ item.descricao }</h1>
                                            </div>

                                            <div className={styles.containerServicoAgenda}>
                                                <div className={styles.containerServicosPrestados}>
                                                    <h1 className={styles.cardTitle}>Serviços Prestados</h1>
                                                    <div className={styles.linhaHorizontal}></div>
                                                    { item.servicosPrestadosProf.map((item) => 
                                                        {
                                                            return (
                                                                <div key={item.id} className={styles.itemsServicosAgenda}>                                                    
                                                                    <h1>{item.nome} - R${item.preco}</h1>
                                                                </div>
                                                            )
                                                        }) 
                                                    }
                                                </div>

                                                <div className={styles.containerAgenda}>
                                                    <h1 className={styles.cardTitle}>Agenda</h1>
                                                    <div className={styles.linhaHorizontal}></div>
                                                    { item.agenda.map((item) => {
                                                        return (
                                                            <div key={item.id} className={styles.itemsServicosAgenda}>
                                                                <h1>{DateFormat(item.data)}</h1>                                                    
                                                            </div>
                                                        )})
                                                    }
                                                </div>
                                            </div>
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
                                                    {"Descrição do Profissional"}
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
                                                            <h1>O profissional ainda não avaliações</h1>
                                                        ) : (
                                                            avaliacoes.map((item) => {
                                                                return(
                                                                    <div key={item.id}>
                                                                        <div className={styles.cardAvaliacao}>                                                                        
                                                                            <Rating value={Number(item.nota)} readOnly precision={0.5}/>
    
                                                                            <h1 className={styles.titleAvaliacao}>Descrição</h1>
                                                                            <textarea 
                                                                                maxLength={400} 
                                                                                className={styles.textAreaAvaliacao} 
                                                                                value={item.descricao}
                                                                                readOnly
                                                                            />
                                                                            <h1>- {item.contrato.userCliente.nome}</h1>
                                                                            <h2>{ShortDateFormat(item.created_at)}</h2>
                                                                        </div>
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
                            )
                        })}                        
                    </div>
                </div>
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