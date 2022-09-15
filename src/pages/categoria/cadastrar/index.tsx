import { canSSRAdmin } from "../../../utils/canSSRAdmin"

export default function CadastrarCategoria(){

    return(
        <h1>Cadastrar Categoria</h1>
    )
}

export const getServerSideProps = canSSRAdmin(async (ctx) => {
    return {
        props: {}
    }
})