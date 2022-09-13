import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { Logo } from "../components/Logo";
import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>        
        <title>MeAutonomo</title>
      </Head>

      <div className={styles.container}>        
        <Link href={"/tipoconta"}>
            <button>
                <a>Começar</a>
            </button>
        </Link>
      </div>
     
    </>
  )
}

