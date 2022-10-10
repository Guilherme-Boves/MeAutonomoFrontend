import { canSSRGuest } from '../../utils/canSSRGuest';
import { TipoContaAside } from '../../components/TipoContaAside';
import { TipoContaBody } from '../../components/TipoContaBody';

export default function TipoConta() {
    return (
      <>     
        <div className='flex flex-1'>
            <TipoContaAside/>
            <TipoContaBody/>
        </div>
      </>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {}
    }
})