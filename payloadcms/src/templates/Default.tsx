import React from 'react';
import { Page } from '../../payload-types';

type Props = {
  page: Page;
};

const Default: React.FC<Props> = ({ page }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
      <div className="prose max-w-none">
        {page.content}
      </div>
    </div>
  );
};

export default Default; 