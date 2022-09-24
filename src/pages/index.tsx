import Head from 'next/head'
import Image from "next/image";
import Link from 'next/link';
import { Body } from '../components/BodyHome';
import { Navbar } from '../components/NavBarHome/Navbar';
import VideoHome from '../components/VideoHome';

export default function Home() {
  return(
   <>
      <Head>        
         <title>MeAutonomo</title>
      </Head>

      <div>
          <Navbar/>
          <Body/>
          <VideoHome/>
      </div>
   </>
  )
}

