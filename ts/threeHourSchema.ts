export default interface definitions {
  /** A feature object with mandatory geometry and properties fields */
  Feature: {
    /** The GeoJSON type identifier */
    type: string
    /** The GeoJSON representation of the feature point with a type of Point and a latitude/longitude co-ordinates array */
    geometry: definitions['Point']
    /** All properties associated with the feature */
    properties: definitions['Properties']
  }
  'Map«string,ParameterDetails»': {
    [key: string]: definitions['ParameterDetails']
  }
  ParameterDetails: {
    description?: string
    type?: string
    unit?: definitions['Unit']
  }
  Point: {
    /** The longitude, latitude and elevation values for the point */
    coordinates: number[]
    /** The GeoJSON type identifier */
    type: string
  }
  Location: {
    /** The forecast location name */
    name: string
    /** The license */
    licence?: string
  }
  Properties: {
    /** The forecast location name */
    location?: definitions['Location']
    /** The distance from the requested point in metres */
    requestPointDistance: number
    /** The model run date in UTC */
    modelRunDate: string
    /** A time step ordered list  of forecast parameters and associated values */
    timeSeries: definitions['TimeSeries'][]
  }
  /** A feature collection object, must have a member array of features */
  SpotForecastFeatureCollection: {
    /** The GeoJSON type identifier */
    type: string
    /** A list of feature objects */
    features: definitions['Feature'][]
    /** Forecast parameter metadata for all possible forecast parameters in response - each forecast parameter has a nested object containing a unit of measurement, using standard unit representation as defined by UCUM - http://unitsofmeasure.org/ucum.html - and an optional parameter definition */
    parameters?: definitions['Map«string,ParameterDetails»'][]
  }
  Symbol: {
    type?: string
    value?: string
  }
  TimeSeries: {
    /** Time of the forecast in UTC */
    time: string
    /** A map of forecast parameters and associated values */
    [key: string]: string | number
  }
  Unit: {
    /** The name of the unit */
    label: string
    /** The symbolic notation of the unit */
    symbol: definitions['Symbol']
  }
}
