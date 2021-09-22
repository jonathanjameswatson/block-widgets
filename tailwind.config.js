module.exports = {
  mode: 'jit',
  darkMode: 'class',
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
        notion: {
          text: {
            DEFAULT: 'rgb(55, 53, 47)',
            dark: 'rgb(235, 235, 235)',
          },
          bg: {
            DEFAULT: 'white',
            dark: 'rgb(47, 52, 55)',
            hover: {
              DEFAULT: 'rgba(55, 53, 47, 0.08)',
              dark: 'rgb(71, 76, 80)',
            },
          },
          border: {
            DEFAULT: 'rgba(55, 53, 47, 0.16)',
            dark: 'rgba(255, 255, 255, 0.14)',
          },
        },
      },
      lineHeight: {
        notion: 1.3,
      },
      spacing: {
        '2px': '2px',
        '3px': '3px',
        'notion-title': 'calc(1em - 4px)',
      },
      fontSize: {
        'notion-normal': '17px',
        'notion-small': '15px',
        'notion-title': '1.25em',
      },
    },
  },
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
