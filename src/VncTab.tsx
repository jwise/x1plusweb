import { VncScreen } from 'react-vnc';
import { IconScreenShare } from '@tabler/icons-react';
import { useState, useEffect } from 'react';

import type { Tab } from './tabs.d';
import printerConnection from './printer';

function body() {
  const [isConnected, setIsConnected] = useState(printerConnection.connected);
  useEffect(() => {
    function onConnectedChanged() {
    	setIsConnected(printerConnection.connected);
    }
    printerConnection.addEventListener('connected', onConnectedChanged);
    printerConnection.addEventListener('disconnected', onConnectedChanged);
    return () => {
        printerConnection.removeEventListener('connected', onConnectedChanged);
    	printerConnection.removeEventListener('disconnected', onConnectedChanged);
    };
  }, [/* url */]);

  return isConnected && <VncScreen url={`ws://${printerConnection.host}:5900`} scaleViewport style={{ width: '75vw', height: '75vh', }} />;
}

const tab : Tab = {
  title: "VNC",
  icon: IconScreenShare,
  body: body,
};

export default tab;
