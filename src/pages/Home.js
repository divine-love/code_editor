import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Card from "./Card";
import Tw from "./typewr";

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & Username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username, // passing username from room page to editor page 
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };
    return (
        <>
            <div className="divide">
          
                <div className="content contentWrapper">
                
                <Card >
                <Tw/>
           <h1>
           A real-time CodeXpert platform that enables developers to collaborate on a piece of code simultaneously, with changes being reflected in real-time on all connected devices.This platform often come with a range  of tools and features to make coding easier such as syntax highlighting, saving changes.
           
           </h1>
           </Card>
                    {/* <h1>CodeXpert</h1>
                    <div className="leftPanel">
                        <h4>A real-time CodeXpert platform that enables developers to collaborate on a piece of code simultaneously,
                            with changes being reflected in real-time on all connected devices.This platform often come with a range
                            of tools and features to make coding easier,
                            such as syntax highlighting, dynamic fontSize , saving changes,change theme .</h4>
                    </div> */}
                </div>
                
                <div className="homePageWrapper">
                    <div className="formWrapper">
                        <img
                            className="homePageLogo"
                            src="/cx.png"
                            alt="code-expert-logo"
                        />
                        <h4 className="mainLabel">Paste Invitation ROOM ID</h4>
                        <div className="inputGroup">
                            <input
                                type="text"
                                className="inputBox"
                                placeholder="ROOM ID"
                                onChange={(e) => setRoomId(e.target.value)}
                                value={roomId}
                                onKeyUp={handleInputEnter}
                            />
                            <input
                                type="text"
                                className="inputBox"
                                placeholder="USERNAME"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                onKeyUp={handleInputEnter}
                            />
                            <button className="btn joinBtn" onClick={joinRoom}>
                                Enter the Room
                            </button>
                            <span className="createInfo">
                                <button className="btn joinBtn" onClick={createNewRoom}>
                                    Create New Room
                                </button>
                                { /*    Create Room Id &nbsp;
                      <a
                            onClick={createNewRoom}
                            href=""
                            className="createNewBtn"
                        >
                           
                        </a>*/}

                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;