
import { StoryMapData, Activity, Release, Story, Link } from './types';

export const parseMarkdownToStoryMap = (markdown: string): StoryMapData => {
  const lines = markdown.split('\n');
  
  let title = 'User Story Map';
  const activities: Activity[] = [];
  const releasesList: Release[] = [];
  const stories: Record<string, Record<string, Story[]>> = {};

  let currentActivity: Activity | null = null;
  let currentRelease: Release | null = null;
  let currentStory: Story | null = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // H2: Map Title
    if (trimmed.startsWith('## ')) {
      title = trimmed.replace('## ', '').trim();
      return;
    }

    // H3: Activity (Column)
    if (trimmed.startsWith('### ')) {
      const activityTitle = trimmed.replace('### ', '').trim();
      currentActivity = { id: activityTitle, title: activityTitle };
      activities.push(currentActivity);
      currentRelease = null; 
      currentStory = null;
      return;
    }

    // H4: Activity Subtitle
    if (trimmed.startsWith('#### ')) {
      if (currentActivity) {
        currentActivity.subtitle = trimmed.replace('#### ', '').trim();
      }
      return;
    }

    // H5: Release (Row)
    if (trimmed.startsWith('##### ')) {
      const releaseTitle = trimmed.replace('##### ', '').trim();
      
      let release = releasesList.find(r => r.title === releaseTitle);
      if (!release) {
        release = { id: releaseTitle, title: releaseTitle };
        releasesList.push(release);
      }
      currentRelease = release;
      currentStory = null;
      return;
    }

    // Story Title: **Title**
    const storyTitleMatch = trimmed.match(/^\*\*(.*?)\*\*/);
    if (storyTitleMatch && currentActivity && currentRelease) {
      const storyTitle = storyTitleMatch[1];
      const newStory: Story = {
        id: `${currentActivity.id}-${currentRelease.id}-${Date.now()}-${Math.random()}`,
        title: storyTitle,
        details: []
      };
      
      currentStory = newStory;

      if (!stories[currentRelease.id]) stories[currentRelease.id] = {};
      if (!stories[currentRelease.id][currentActivity.id]) stories[currentRelease.id][currentActivity.id] = [];
      
      stories[currentRelease.id][currentActivity.id].push(newStory);
      return;
    }

    // List item: - [ ] text
    if (trimmed.startsWith('-') && currentStory) {
      const isChecked = trimmed.includes('[x]');
      let text = trimmed.replace(/^- \[[ x]\] /, '').trim();
      
      // Parse link: [text](url)
      const linkMatch = text.match(/\[(.*?)\]\((.*?)\)/);
      let link: Link | undefined;
      
      if (linkMatch) {
        const [full, linkText, url] = linkMatch;
        text = text.replace(full, linkText);
        
        let type: Link['type'] = 'external';
        if (url.startsWith('app://')) type = 'internal';
        else if (linkText.toLowerCase().includes('clickup')) type = 'clickup';
        
        link = { text: linkText, url, type };
      }

      currentStory.details.push({ text, checked: isChecked, link });
    }
  });

  return {
    title,
    activities,
    releases: releasesList,
    stories
  };
};
