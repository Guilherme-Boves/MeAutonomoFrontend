import { useRouter } from 'next/router';
import React from 'react'
import { setupAPIClient } from '../../../../../services/api';
import { canSSRAuth } from '../../../../../utils/canSSRAuth'

export default function Perfis() {

    const router = useRouter();

    const id = router.query.perfis_id;
    return(

        <div>
            <h1>
                Perfis dos profissionais: {id}
            </h1>
        </div>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    //const id = ctx.query.perfis_id;

    //const api = setupAPIClient(ctx);

    //const response = await api.get('')

    return{
        props: {}
    }
})