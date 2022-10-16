import React from 'react';
import InputMask from 'react-input-mask';
import styles from './styles.module.css'

const MaskedInput = ({ value, onChange, mask, ...rest }) => {
    
    return(
        <InputMask 
            className={styles.input}            
            mask={mask}
            value={value}
            onChange={onChange}
            {...rest}        
        />
    )
}

export default MaskedInput;