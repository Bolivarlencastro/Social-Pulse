
import { useState, useEffect } from 'react';
import { StoryMapData } from './types';
import { parseMarkdownToStoryMap } from './utils';

export const useStoryMapping = (url: string) => {
  const [data, setData] = useState<StoryMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch markdown file");
        return res.text();
      })
      .then(text => {
        const parsed = parseMarkdownToStoryMap(text);
        setData(parsed);
        setLoading(false);
      })
      .catch(err => {
        console.error("StoryMapping Load Error:", err);
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
};
