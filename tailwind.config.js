export default {
  purge: [],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      serif:
        'Lyon-Text, Georgia, YuMincho, "Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "Songti TC", "Songti SC", "SimSun", "Nanum Myeongjo", NanumMyeongjo, Batang, serif',
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
