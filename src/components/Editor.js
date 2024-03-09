import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material-ocean.css';
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/twilight.css'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/python/python';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';  
 
const Editor = ({socketRef,roomId, onCodeChange}) => {
    const editorRef = useRef(null);
    useEffect(()=>{
       // we are connecting codemirror to text editor 
        async function init()
       { 
        editorRef.current =Codemirror.fromTextArea(
            document.getElementById('realtimeEditor'),
            {
                mode: { name: 'javascript', json: true },
                theme: 'material-ocean',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            }
        );
  // when we add delete paste all can be shown in origin we can easily get it 
        editorRef.current.on('change', (instance, changes) => {
            const { origin } = changes;
            // console.log(changes);
            const code = instance.getValue(); //get content of editor 
            onCodeChange(code);
            if (origin !== 'setValue') {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
        }); 

   

       }
   init();

    },[]);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }
    //unsubscribe the code change function 
        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);


    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
