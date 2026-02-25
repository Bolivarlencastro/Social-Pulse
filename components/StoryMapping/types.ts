
export interface Link {
  text: string;
  url: string;
  type: 'internal' | 'clickup' | 'external';
}

export interface Story {
  id: string;
  title: string;
  details: { text: string; checked: boolean; link?: Link }[];
}

export interface Release {
  id: string;
  title: string;
}

export interface Activity {
  id: string;
  title: string;
  subtitle?: string;
}

export interface StoryMapData {
  title: string;
  activities: Activity[];
  releases: Release[];
  stories: {
    [releaseId: string]: {
      [activityId: string]: Story[];
    };
  };
}
