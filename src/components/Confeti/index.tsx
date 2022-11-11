import React from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

export const Confeti = () => {
    const { width, height } = useWindowSize()
        return (
            <Confetti id='confetti' run={true} width={width} height={height} recycle={true} numberOfPieces={150} />   
        )
    }