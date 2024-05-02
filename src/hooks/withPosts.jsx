import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../api/getAllPosts";

const useAllPosts = () => {
  return useQuery("allPosts", getAllPosts);
};

export default useAllPosts;
