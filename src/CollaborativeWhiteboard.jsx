import React, { useEffect, useRef, useState } from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function CollaborativeWhiteboard({ roomId }) {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    socket.emit('join-room', roomId);
    socket.on('whiteboard-update', (data) => {
      if (editor && data) {
        editor.loadSnapshot(data);
      }
    });
    return () => socket.off('whiteboard-update');
  }, [roomId, editor]);

  const handlePersist = (snapshot) => {
    socket.emit('whiteboard-update', { room: roomId, data: snapshot });
  };

  return (
    <div style={{ height: '500px', border: '1px solid #ccc' }}>
      <Tldraw onMount={setEditor} onPersist={handlePersist} />
    </div>
  );
}