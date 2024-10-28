import { ReactNode, useState } from 'react';
import MeshBase from './MeshBase';

export default function EditorBase({ children }: { children: ReactNode }) {
  const [extraSpaceTop, setExtraSpaceTop] = useState(false);
  const [extraSpaceBottom, setExtraSpaceBottom] = useState(false);

  return (
    <div>
      <MeshBase>{children}</MeshBase>
    </div>
  );
}
