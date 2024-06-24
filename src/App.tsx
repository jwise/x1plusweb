import { AppShell, NavLink, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconScreenShare } from '@tabler/icons-react';
import { VncScreen } from 'react-vnc';

function App() {
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
        <VncScreen url="ws://10.1.10.50:5900" scaleViewport style={{ width: '75vw', height: '75vh', }} />
      </AppShell.Main>
      <AppShell.Footer p="md">
        Not connected to printer
      </AppShell.Footer>
    </AppShell>
  );
}

export default App;
