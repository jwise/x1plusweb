import { AppShell, NavLink, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconScreenShare } from '@tabler/icons-react';
import { VncScreen } from 'react-vnc';

import WebSocketAsPromised from 'websocket-as-promised';

async function connectToPrinter() {
  const wsp = new WebSocketAsPromised(`ws://${location.host}/ws`, {
    packMessage: data => JSON.stringify(data),
    unpackMessage: data => JSON.parse(data),
    attachRequestId: (data, requestId) => Object.assign({id: requestId}, data),
    extractRequestId: data => data && data.id,
  });
  console.log("... connecting to printer websocket ...");
  await wsp.open();
  console.log("... connected ...");
  const resp = await wsp.waitUnpackedMessage(data => data.method == 'hello' );
  console.log(resp);
  const resp2 = await wsp.sendRequest({"method": "auth", "params": {"password": "lol"}});
  console.log(resp2);
}

connectToPrinter();

function App() {
  // const [conn, updConn] = useState('conn');
  const [opened, { toggle }] = useDisclosure();
  
  return (
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
          href="#required-for-focus"
          label="VNC"
          leftSection={<IconScreenShare size="1rem" stroke={1.5} />}
          active
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <VncScreen url={`ws://${location.hostname}:5900`} scaleViewport style={{ width: '75vw', height: '75vh', }} />
      </AppShell.Main>
      <AppShell.Footer p="md">
        Not connected to printer
      </AppShell.Footer>
    </AppShell>
  );
}

export default App;
