import { useEffect, useState } from 'react';
import { Contest } from './types/Contest';
import { Problem } from './types/Problem';
import { Submission } from './types/Submission';

function useFetchJSON<Data>(url: RequestInfo, initialState: Data): Data {
  const [data, setData] = useState<Data>(initialState);
  useEffect(() => {
    (async () => {
      const data = await fetch(url).then((res) => res.json());
      setData(data);
    })();
  }, [url]);
  return data;
}

export function useRecentSubmissions(): Submission[] {
  return useFetchJSON<Submission[]>(`/api/v1/recent_submissions`, []);
}

export function useContests(): Contest[] {
  return useFetchJSON<Contest[]>(
    `https://kenkoooo.com/atcoder/resources/contests.json`,
    []
  );
}

export function useProblems(): Problem[] {
  return useFetchJSON<Problem[]>(
    `https://kenkoooo.com/atcoder/resources/problems.json`,
    []
  );
}
