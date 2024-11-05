import { ReactNode } from 'react';
import { useEasingStore } from '~/state/easing-store';
import MeshBase from './MeshBase';

export default function EditorBase({ children }: { children: ReactNode }) {
  const editorExtraSpaceTop = useEasingStore((state) => state.editorExtraSpaceTop);
  const editorExtraSpaceBottom = useEasingStore((state) => state.editorExtraSpaceBottom);

  return (
    <div className="relative z-0">
      {editorExtraSpaceTop && <div className="aspect-square w-full border-t border-zinc-800" />}
      <MeshBase>{children}</MeshBase>
      {editorExtraSpaceBottom && <div className="aspect-square w-full border-b border-zinc-800" />}
    </div>
  );
}
