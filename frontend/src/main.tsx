import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { ChatRoom } from './views';

const queryClient = new QueryClient();

axios.defaults.baseURL = 'http://localhost:8000/';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ChatRoom />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//<React.StrictMode>
  <ChakraProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ChakraProvider>
//</React.StrictMode>
);
