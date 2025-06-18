import React from 'react';
import { useConfig } from 'payload/components/utilities';

const Page: React.FC = () => {
  const config = useConfig();
  const { chatUrl, aiUrl } = config.custom;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-6">Bine ați venit!</h1>
          <div className="prose max-w-none">
            <p>Acesta este un site demonstrativ pentru tema de licență.</p>
            <p>În partea dreaptă puteți găsi aplicațiile integrate:</p>
            <ul>
              <li>Chat - pentru comunicare în timp real</li>
              <li>AI - pentru procesarea fișierelor folosind servicii de inteligență artificială</li>
            </ul>
          </div>
        </div>
        <div className="space-y-8">
          <div className="h-[300px]">
            <h2 className="text-2xl font-bold mb-4">Chat</h2>
            <iframe
              src={chatUrl}
              className="w-full h-full border rounded-lg"
              title="Chat Application"
            />
          </div>
          <div className="h-[300px]">
            <h2 className="text-2xl font-bold mb-4">AI Processing</h2>
            <iframe
              src={aiUrl}
              className="w-full h-full border rounded-lg"
              title="AI Application"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page; 