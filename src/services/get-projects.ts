import {ProjectRecord} from '@/types/projects';

import {projects} from '@/data/projects';

export const getProjects = (): ProjectRecord[] => {
  return projects.records;
};
