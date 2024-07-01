import { AppShell, NavLink, Burger, Button, TextInput, Group, Modal, Stack, PasswordInput } from '@mantine/core';
import { useState, useEffect } from 'react';

import printerConnection from './printer';

function LoginModal() {
  const [isConnected, setIsConnected] = useState(printerConnection.connected);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(null);

  const [host, setHost] = useState('');
  const [password, setPassword] = useState('');

  const host_connect = host == '' ? location.host : host;

  useEffect(() => {
    function onConnectedChanged(ev: any) {
    	setIsConnected(printerConnection.connected);
    	setIsConnecting(false);
    	setConnectionProgress(null);
    }
    function onConnectingProgress(ev: any) {
        setIsConnected(false);
        setIsConnecting(true);
        setConnectionProgress(ev.progress);
    }
    printerConnection.addEventListener('connected', onConnectedChanged);
    printerConnection.addEventListener('disconnected', onConnectedChanged);
    printerConnection.addEventListener('connectingProgress', onConnectingProgress);
    return () => {
        printerConnection.removeEventListener('connected', onConnectedChanged);
    	printerConnection.removeEventListener('disconnected', onConnectedChanged);
        printerConnection.removeEventListener('connectingProgress', onConnectingProgress);
    };
    	
  }, [/* url */]);

  return <Modal opened={!isConnected} centered title="Connect to X1Plus" withCloseButton={false} onClose={() => null}>
      {/* XXX: use mantine-form here to persist this */}
      {/* XXX: handle connection error here */}
      {/* XXX: provide connecting feedback in this modal, not just down below */}
      <Stack>
        <TextInput label="Printer IP address" placeholder={location.host} value={host} onChange={ev => setHost(ev.currentTarget.value)} />
        <PasswordInput label="Password" value={password} onChange={ev => setPassword(ev.currentTarget.value)} />
        <Button onClick={() => {printerConnection.connect(host_connect, password); setIsConnecting(true)}} disabled={isConnecting}>Connect</Button>
      </Stack>
    </Modal>;
}

export default LoginModal;