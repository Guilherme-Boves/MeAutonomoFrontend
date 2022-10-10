import { Player as VimePlayer, Youtube, DefaultUi, ClickToPlay, Spinner, Poster, MuteControl } from '@vime/react'

const Player = () => (
  <VimePlayer theme="dark">
    <Youtube videoId="fU5yNrvXCh8"/>
    <ClickToPlay/>
    <Spinner/>
    <Poster/>

  </VimePlayer>
)

export default Player