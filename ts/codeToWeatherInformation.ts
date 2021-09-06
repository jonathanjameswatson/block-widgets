import WeatherInformation from '~/ts/weatherInformation'

const codeToWeatherInformation: Record<number | 'null', WeatherInformation> = {
  null: {
    name: 'Not available',
    icon: 'alien',
  },
  0: {
    name: 'Clear night',
    icon: 'night-clear',
  },
  1: {
    name: 'Sunny day',
    icon: 'day-sunny',
  },
  2: {
    name: 'Partly cloudy (night)',
    icon: 'night-alt-partly-cloudy',
  },
  3: {
    name: 'Partly cloudy (day)',
    icon: 'day-sunny-overcast',
  },
  4: {
    name: 'Not used',
    icon: 'alien',
  },
  5: {
    name: 'Mist',
    icon: 'fog',
  },
  6: {
    name: 'Fog',
    icon: 'fog',
  },
  7: {
    name: 'Cloudy',
    icon: 'cloud',
  },
  8: {
    name: 'Overcast',
    icon: 'cloudy',
  },
  9: {
    name: 'Light rain shower (night)',
    icon: 'night-alt-showers',
  },
  10: {
    name: 'Light rain shower (day)',
    icon: 'day-showers',
  },
  11: {
    name: 'Drizzle',
    icon: 'sprinkle',
  },
  12: {
    name: 'Light rain',
    icon: 'showers',
  },
  13: {
    name: 'Heavy rain shower (night)',
    icon: 'night-alt-rain',
  },
  14: {
    name: 'Heavy rain shower (day)',
    icon: 'day-rain',
  },
  15: {
    name: 'Heavy rain',
    icon: 'rain',
  },
  16: {
    name: 'Sleet shower (night)',
    icon: 'night-alt-sleet',
  },
  17: {
    name: 'Sleet shower (day)',
    icon: 'day-sleet',
  },
  18: {
    name: 'Sleet',
    icon: 'sleet',
  },
  19: {
    name: 'Hail shower (night)',
    icon: 'night-alt-hail',
  },
  20: {
    name: 'Hail shower (day)',
    icon: 'day-hail',
  },
  21: {
    name: 'Hail',
    icon: 'hail',
  },
  22: {
    name: 'Light snow shower (night)',
    icon: 'night-alt-snow',
  },
  23: {
    name: 'Light snow shower (day)',
    icon: 'day-snow',
  },
  24: {
    name: 'Light snow',
    icon: 'snow',
  },
  25: {
    name: 'Heavy snow shower (night)',
    icon: 'night-alt-snow-wind',
  },
  26: {
    name: 'Heavy snow shower (day)',
    icon: 'day-snow-wind',
  },
  27: {
    name: 'Heavy snow',
    icon: 'snow-wind',
  },
  28: {
    name: 'Thunder shower (night)',
    icon: 'night-alt-thunderstorm',
  },
  29: {
    name: 'Thunder shower (day)',
    icon: 'day-thunderstorm',
  },
  30: {
    name: 'Thunder',
    icon: 'thunderstorm',
  },
}

export default codeToWeatherInformation
