import React from 'react';
import { Page } from '../../payload-types';

type Props = {
  page: Page;
};

const WithAI: React.FC<Props> = ({ page }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
          <div className="prose max-w-none">
            {page.content}
          </div>
        </div>
        <div className="h-[600px]">
          <iframe
            src="http://localhost:90/ai"
            className="w-full h-full border-0"
            title="AI Application"
          />
        </div>
      </div>
    </div>
  );
};

export default WithAI; 