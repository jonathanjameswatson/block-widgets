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
        'notion-bg': 'white',
        'notion-text': 'rgb(55, 53, 47)',
        'notion-border': 'rgba(55, 53, 47, 0.16)',
        'notion-bg-hover': 'rgba(55, 53, 47, 0.08)',
        'notion-bg-dark': 'rgb(47, 52, 55)',
        'notion-text-dark': 'rgb(235, 235, 235)',
        'notion-border-dark': 'rgba(255, 255, 255, 0.14)',
        'notion-bg-hover-dark': 'rgb(71, 76, 80)',
      },
      lineHeight: {
        'notion-inner': 1.3,
        'notion-outer': 1.6,
      },
      spacing: {
        '2px': '2px',
        '3px': '3px',
        'notion-padding': '5px',
        notion: '30px',
      },
      minHeight: {
        notion: '30px',
      },
      fontSize: {
        'notion-normal': '17px',
        'notion-small': '15px',
        'notion-title': '1.25em',
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
