import { useQuery } from "react-query";
import axios from "axios";

export interface Issue {
  id: number;
  number: number;
  url: string;
  repository_url: string;
  title: string;
  state: string;
  user: User;
}

export interface User {
  login: string;
  avatar_url: string;
}

export const useIssueQuery = (labels: string) => {
  return useQuery(
    ["issues", labels],
    async () => {
      const { data } = await axios.get<Issue[]>(
        "https://api.github.com/repos/octocat/hello-world/issues",
        {
          params: { labels },
        }
      );
      return data;
    },
    { staleTime: 30000 }
  );
};
