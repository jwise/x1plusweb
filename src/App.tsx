import { AppShell, NavLink, Burger, Button, TextInput, Group, Modal, Stack, PasswordInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconScreenShare, IconLogout } from '@tabler/icons-react';
import { VncScreen } from 'react-vnc';
import { useState, useEffect } from 'react';

import printerConnection from './printer';

function App() {
  // const [conn, updConn] = useState('conn');
  const [opened, { toggle }] = useDisclosure();
  const [isConnected, setIsConnected] = useState(printerConnection.connected);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(null);
  
  const [host, setHost] = useState('');
  const [password, setPassword] = useState('');
  
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
  
  return <>
    <Modal opened={!isConnected} centered title="Connect to X1Plus" withCloseButton={false} onClose={() => null}>
      {/* XXX: use mantine-form here to persist this */}
      {/* XXX: handle connection error here */}
      {/* XXX: provide connecting feedback in this modal, not just down below */}
      <Stack>
        <TextInput label="Printer IP address" placeholder={location.host} value={host} onChange={ev => setHost(ev.currentTarget.value)} />
        <PasswordInput label="Password" value={password} onChange={ev => setPassword(ev.currentTarget.value)} />
        <Button onClick={() => {printerConnection.connect(host == '' ? location.host : host, password); setIsConnecting(true)}} enabled={!isConnecting}>Connect</Button>
      </Stack>
    </Modal>
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          X1Plus
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <NavLink
          href="#"
          label="VNC"
          leftSection={<IconScreenShare size="1rem" stroke={1.5} />}
          active
        />
        <NavLink
          href="#"
          label="Disconnect"
          leftSection={<IconLogout size="1rem" stroke={1.5} />}
          onClick={() => {printerConnection.disconnect(); return false;}}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        { isConnected && <VncScreen url={`ws://${location.hostname}:5900`} scaleViewport style={{ width: '75vw', height: '75vh', }} /> }
      </AppShell.Main>
      <AppShell.Footer p="md">
        {isConnected ? "Connected" :
         isConnecting && connectionProgress ? `Connecting: ${connectionProgress}...` :
         isConnecting ? "Connecting..." :
         "Not connected to printer"
        }
      </AppShell.Footer>
    </AppShell>
  </>;
}

export default App;
