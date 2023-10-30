import { QueryOptions, UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios, { Axios, AxiosError } from "axios";

const fetchUserAccUUID = async () => {
  const response = await axios.get('/');
  return response.data;
};

export const useAccIdQuery = (options?:UseQueryOptions<string,AxiosError>) => {
  return useQuery({
    queryKey: ["userID"],
    queryFn:  fetchUserAccUUID,
    staleTime: 31536000000,
    ...options
  });
}