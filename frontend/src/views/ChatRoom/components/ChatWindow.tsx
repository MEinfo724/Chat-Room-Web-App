import { HStack, VStack, Text, Input, Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

interface ChatWindowProps {
  userAcc: string | undefined;
}

export const ChatWindow = ({ userAcc }: ChatWindowProps) => {

  const [mess, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ userAcc: string; mess: string }[]>([]);
  const wsServer = 'ws://localhost:3001';
  const ws = new WebSocket(wsServer);


  const lastNoteRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (lastNoteRef.current) {
      lastNoteRef.current.scrollIntoView();
    }
  });

  useEffect(() => {
    // Connect to the server
    ws.addEventListener('open', () => {
      ws.send(
        JSON.stringify({
          type: 'join',
          userAcc
        })
      );
    });

    //Receive and handle messages
    ws.addEventListener('message', (e) => {
      try {
        const chat = JSON.parse(e.data);
        console.log(chat);
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { userAcc: chat.userAcc || 'unknown', mess: chat.mess || 'said nothing' },
        ]);
      } catch (err) {
        console.log('Invalid JSON', err);
      }
    });

  }, []);

 
  const sendMessage = (msg: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'message',
          userAcc,
          mess,
        })
      );
    } else {
      console.log("WebSocket is not in the OPEN state. Message not sent.");
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(mess);
    setMessage('');
  };
  return (
    <>
    <VStack  
    borderRadius="lg"  
    boxShadow="0 0 0 3px rgba(0, 0, 255, 0.25)"  
    flex="1" marginTop="10px" marginLeft="10px" 
    marginRight="10px" 
    align="flex-start"
    overflowX="auto"
    >
      {chatLog.map((chat, index) => (
        <HStack
          padding="10px"
          key={index}
          ref={index === chatLog.length - 1 ? lastNoteRef : null}
        >
          <Text
            fontSize="lg"
            style={{ color: chat.userAcc === userAcc ? 'purple' : 'rgba(0, 0, 255)' }}
          >
            {chat.userAcc}:
          </Text>
          <Text fontSize="lg">{chat.mess}</Text>
        </HStack>
      ))}
    </VStack>
    <form onSubmit={handleSubmit}>
      <HStack padding="10px">
        <Input value={mess}
        onChange={(e) => setMessage(e.target.value)}></Input>
        <Button mx="2" type="submit">Send Message</Button>
      </HStack>
    </form>
    </>
  )
}
