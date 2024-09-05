export const encodeState = (creatures) => {
    return btoa(JSON.stringify(creatures));
  };
  
  export const decodeState = (encodedState) => {
    return JSON.parse(atob(encodedState));
  };
  