import React from 'react';

export interface Tab {
  title: string;
  icon: () => React.ReactNode;
  body: () => React.ReactNode;
};
