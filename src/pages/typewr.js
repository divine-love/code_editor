import Typewriter from 'typewriter-effect';
import React from 'react';
import './typer.css'
const Tw=()=>{
    return(
         <div className='Tw'>
            <Typewriter 
              options={{
             strings: ['CODE XPERT'],
             autoStart: true,
             loop: true,
                 }}
          />
         </div>
    )
}

export default Tw;