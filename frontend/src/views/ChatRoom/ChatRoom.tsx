import { Box, Button, Center, HStack, Input, VStack, Text, Spinner} from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { ChatWindow } from './components';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAccIdQuery } from './cache';



export const ChatRoom = () => {
  
  const [userAcc, setUserAcc] = React.useState("");

  const {data: userID, isLoading} = useAccIdQuery();

  useEffect(() => {
    if (!isLoading && userID) {
      setUserAcc(userID);
    }
  }, [isLoading, userID]);

  if(isLoading){
    return <Spinner></Spinner>
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box bg="blue.500" color="white" p={4} textAlign="center">
        <Center>
          Hello {userAcc}! Welcome to chat room!
        </Center>
      </Box>
      {userAcc && (
              <ChatWindow  userAcc={userAcc} />
          )}
    </Box>
  )
}


