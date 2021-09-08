module.exports = {
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      default:
        'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
      serif:
        'Lyon-Text, Georgia, YuMincho, "Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "Songti TC", "Songti SC", "SimSun", "Nanum Myeongjo", NanumMyeongjo, Batang, serif',
      mono: 'iawriter-mono, Nitti, Menlo, Courier, monospace',
    },
    extend: {
      colors: {
        orange: '#FA8B3D',
        red: '#F04B43',
        'notion-bg': 'white',
        'notion-text': 'rgb(55, 53, 47)',
        'notion-bg-dark': 'rgb(47, 52, 55)',
        'notion-text-dark': 'rgb(235, 235, 235)',
      },
      lineHeight: {
        'notion-inner': 1.3,
        'notion-outer': 1.6,
      },
      spacing: {
        'notion-padding': '5px',
        notion: '30px',
      },
      minHeight: {
        notion: '30px',
      },
      fontSize: {
        'notion-normal': '17px',
        'notion-small': '15px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  purge: {
    content: [
      `components/**/*.{vue,js}`,
      `layouts/**/*.vue`,
      `pages/**/*.vue`,
      `plugins/**/*.{js,ts}`,
      `nuxt.config.{js,ts}`,
      './safelist.txt',
    ],
  },
}
