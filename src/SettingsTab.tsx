import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Table } from '@mantine/core';

import type { Tab } from './tabs.d';
import printerConnection from './printer';

function body() {
  const [isConnected, setIsConnected] = useState(printerConnection.connected);
  const [settings, setSettings] = useState(null);

  function requestSettings() {
    printerConnection.rpc('dbus.call', {
      object: '/x1plus/settings',
      bus_name: 'x1plus.x1plusd',
      interface: 'x1plus.settings',
      method: 'GetSettings',
      params: null
    }).then(val => setSettings(val));
  }

  useEffect(() => {
    function onConnectedChanged(ev: any) {
    	setIsConnected(printerConnection.connected);
    	if (printerConnection.connected) {
    	  requestSettings();
    	}
    }
    printerConnection.addEventListener('connected', onConnectedChanged);
    printerConnection.addEventListener('disconnected', onConnectedChanged);
    return () => {
        printerConnection.removeEventListener('connected', onConnectedChanged);
    	printerConnection.removeEventListener('disconnected', onConnectedChanged);
    };
  }, []);
  
  if (isConnected && !settings) 
    requestSettings();

  return settings && <Table style={{ width: "50vw", }}>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Setting</Table.Th>
        <Table.Th>Value</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {Object.entries(settings).map(
        ([k, v], i) =>
          v !== null &&
            <Table.Tr key={i}>
              <Table.Td>{k}</Table.Td>
              <Table.Td>{JSON.stringify(v)}</Table.Td>
            </Table.Tr>
        )
      }
    </Table.Tbody>
  </Table>;
}

const tab : Tab = {
  title: "Settings",
  icon: IconAdjustmentsHorizontal,
  body: body,
};

export default tab;
