import { DefaultUi, Player as Video, Youtube} from '@vime/react'

export default function Player(){
  return(
    <Video autoplay muted >
     <Youtube videoId="4E8JSdbLXbQ"/>
   </Video>
  )
}

