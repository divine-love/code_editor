import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const EditorPage = () => {
  const socketRef = useRef(null);
  const reactNavigator = useNavigate();
  const location = useLocation();
  const codeRef = useRef(null);
  const { roomId } = useParams();
  const [clients, setClients] = useState([
     
  ]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket(); // client connect to server by this function
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }
      // used for room id to send
      socketRef.current.emit(ACTIONS.JOIN, {
        // emit the join event
        roomId,
        username: location.state?.username, // ? if username not given then not give error
      });


 // Listening for joined event 
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) { // who are started didnt get notify other will get 
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients); // pushing client  
          // as the client join we have to sync the previous code 
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
 
          // Listening for disconnected
          socketRef.current.on(
            ACTIONS.DISCONNECTED,
            ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => { // recieve the previous state 
                    return prev.filter(   // loop through 
                        (client) => client.socketId !== socketId   // remove the disconnected client 
                    );
                });
            }
        );

    };
    init();
   
  //many listener(ex socket.on) are there so we have to remove them 
  return () => {
    socketRef.current.disconnect();
    socketRef.current.off(ACTIONS.JOINED); //unsubscribe the event 
    socketRef.current.off(ACTIONS.DISCONNECTED);
};
  }, []);

  

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId); // inbuit api from browser   
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <>
   
    <div className="mainWrap">
   
      <div className="editorWrap">
        <Editor
        socketRef={socketRef}
        roomId={roomId}
        onCodeChange={(code) => {
            codeRef.current = code;
        }}
        />
      </div>

      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/cx.png" alt="logo" />
          </div>
          <h3>People Joined</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

    </div>
    </>
  );
};

export default EditorPage;
