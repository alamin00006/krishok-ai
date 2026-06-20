export const colors = {
  ink: '#173b2a',
  green: '#168447',
  greenDark: '#0c6534',
  mint: '#e8f5e9',
  paper: '#fbf8ec',
  paperDeep: '#f3edd9',
  white: '#fffdf6',
  line: '#c9d7c8',
  muted: '#68766d',
  red: '#b42318',
  redSoft: '#fff0ee',
  amber: '#9a6700',
  amberSoft: '#fff6d9',
};

export type Theme = {
  background: string;
  paper: string;
  paperDeep: string;
  card: string;
  ink: string;
  muted: string;
  line: string;
  primary: string;
  mint: string;
  red: string;
  redSoft: string;
  amber: string;
  amberSoft: string;
};

export function makeTheme(dark: boolean): Theme {
  return dark
    ? {
        background: '#111a15',
        paper: '#17231c',
        paperDeep: '#1d2c23',
        card: '#203128',
        ink: '#f1f6ef',
        muted: '#a9b9ae',
        line: '#365043',
        primary: '#67d391',
        mint: '#243f30',
        red: '#ff8b82',
        redSoft: '#442622',
        amber: '#f6c453',
        amberSoft: '#40371f',
      }
    : {
        background: colors.paper,
        paper: colors.white,
        paperDeep: colors.paperDeep,
        card: '#fffef9',
        ink: colors.ink,
        muted: colors.muted,
        line: colors.line,
        primary: colors.green,
        mint: colors.mint,
        red: colors.red,
        redSoft: colors.redSoft,
        amber: colors.amber,
        amberSoft: colors.amberSoft,
      };
}
