import { createTheme, rem } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

const bambuColor: MantineColorsTuple = [ '#ebfff2', '#d5fee4', '#a5fdc5', '#72fda4', '#4ffd89', '#3dfd77', '#35fe6d', '#2ae25c', '#1ec850', '#00ad42'];

export const theme = createTheme({
  // fontFamily: 'HarmonyOS Sans SC',
  fontSizes: { xs: rem(12), sm: rem(14), md: rem(16), lg: rem(18), xl: rem(22), },
  colors: { bambuColor,  },
  primaryColor: 'bambuColor',
  black: '#545654',
  components: { Title: { defaultProps: { c: 'bambuColor.9' }, }, },
  /** Put your mantine theme override here */
});
