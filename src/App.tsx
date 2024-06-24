import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

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
      <AppShell.Navbar p="md">
        Navbar
      </AppShell.Navbar>
      <AppShell.Main>
        Main
      </AppShell.Main>
      <AppShell.Footer p="md">
        Not connected to printer
      </AppShell.Footer>
    </AppShell>
  );
}

export default App;
