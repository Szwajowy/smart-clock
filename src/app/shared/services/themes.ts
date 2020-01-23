export interface Theme {
    name: string;
    properties: any;
  }

  export const blue: Theme = {
    name: "blue",
    properties: {
      "accent": "#0061D1",
      "accent-lighter": "#0072F4",
  
      "color": "#FFFFFF",
      "color-darker": "#E2E2E2",
      "color-darkest": "#ACACAC"
    }
  };

  export const purple: Theme = {
    name: "purple",
    properties: {
      "accent": "#5926D5",
      "accent-lighter": "#682DFC",
  
      "color": "#FFFFFF",
      "color-darker": "#E2E2E2",
      "color-darkest": "#ACACAC"
    }
  };

  export const pink: Theme = {
    name: "pink",
    properties: {
      "accent": "#D52678",
      "accent-lighter": "#AF1F63",
  
      "color": "#161616",
      "color-darker": "#232323",
      "color-darkest": "#303030"
    }
  };

  export const violet: Theme = {
    name: "violet",
    properties: {
      "accent": "#9055A2",
      "accent-lighter": "#6C3F7A",
  
      "color": "#011638",
      "color-darker": "#2E294E",
      "color-darkest": "#453E75"
    }
  };