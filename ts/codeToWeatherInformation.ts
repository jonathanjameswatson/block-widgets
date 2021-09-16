export interface WeatherInformation {
  name: string
  display: string
  icon: string
}

const codeToWeatherInformation: Record<number | 'null', WeatherInformation> = {
  null: {
    name: 'Not available',
    display: 'Not available',
    icon: 'alien',
  },
  0: {
    name: 'Clear night',
    display: 'Clear',
    icon: 'night-clear',
  },
  1: {
    name: 'Sunny day',
    display: 'Sunny',
    icon: 'day-sunny',
  },
  2: {
    name: 'Partly cloudy (night)',
    display: 'Partly cloudy',
    icon: 'night-alt-partly-cloudy',
  },
  3: {
    name: 'Partly cloudy (day)',
    display: 'Partly cloudy',
    icon: 'day-sunny-overcast',
  },
  4: {
    name: 'Not used',
    display: 'Not used',
    icon: 'alien',
  },
  5: {
    name: 'Mist',
    display: 'Mist',
    icon: 'fog',
  },
  6: {
    name: 'Fog',
    display: 'Fog',
    icon: 'fog',
  },
  7: {
    name: 'Cloudy',
    display: 'Cloudy',
    icon: 'cloud',
  },
  8: {
    name: 'Overcast',
    display: 'Overcast',
    icon: 'cloudy',
  },
  9: {
    name: 'Light rain shower (night)',
    display: 'Light rain shower',
    icon: 'night-alt-showers',
  },
  10: {
    name: 'Light rain shower (day)',
    display: 'Light rain shower',
    icon: 'day-showers',
  },
  11: {
    name: 'Drizzle',
    display: 'Drizzle',
    icon: 'sprinkle',
  },
  12: {
    name: 'Light rain',
    display: 'Light rain',
    icon: 'showers',
  },
  13: {
    name: 'Heavy rain shower (night)',
    display: 'Heavy rain shower',
    icon: 'night-alt-rain',
  },
  14: {
    name: 'Heavy rain shower (day)',
    display: 'Heavy rain shower',
    icon: 'day-rain',
  },
  15: {
    name: 'Heavy rain',
    display: 'Heavy rain',
    icon: 'rain',
  },
  16: {
    name: 'Sleet shower (night)',
    display: 'Sleet shower',
    icon: 'night-alt-sleet',
  },
  17: {
    name: 'Sleet shower (day)',
    display: 'Sleet shower',
    icon: 'day-sleet',
  },
  18: {
    name: 'Sleet',
    display: 'Sleet',
    icon: 'sleet',
  },
  19: {
    name: 'Hail shower (night)',
    display: 'Hail shower',
    icon: 'night-alt-hail',
  },
  20: {
    name: 'Hail shower (day)',
    display: 'Hail shower',
    icon: 'day-hail',
  },
  21: {
    name: 'Hail',
    display: 'Hail',
    icon: 'hail',
  },
  22: {
    name: 'Light snow shower (night)',
    display: 'Light snow shower',
    icon: 'night-alt-snow',
  },
  23: {
    name: 'Light snow shower (day)',
    display: 'Light snow shower',
    icon: 'day-snow',
  },
  24: {
    name: 'Light snow',
    display: 'Light snow',
    icon: 'snow',
  },
  25: {
    name: 'Heavy snow shower (night)',
    display: 'Heavy snow shower',
    icon: 'night-alt-snow-wind',
  },
  26: {
    name: 'Heavy snow shower (day)',
    display: 'Heavy snow shower',
    icon: 'day-snow-wind',
  },
  27: {
    name: 'Heavy snow',
    display: 'Heavy snow',
    icon: 'snow-wind',
  },
  28: {
    name: 'Thunder shower (night)',
    display: 'Thunder shower',
    icon: 'night-alt-thunderstorm',
  },
  29: {
    name: 'Thunder shower (day)',
    display: 'Thunder shower',
    icon: 'day-thunderstorm',
  },
  30: {
    name: 'Thunder',
    display: 'Thunder',
    icon: 'thunderstorm',
  },
}

export default codeToWeatherInformation
