import React from 'react';
import { Icon } from '@tabler/icons-react';

export interface Tab {
  title: string;
  icon: Icon;
  body: () => React.ReactNode;
};
