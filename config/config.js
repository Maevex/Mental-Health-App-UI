const LOCAL = {
  BASE_URL: 'http://192.168.1.5:8080',
};

const VPS = {
  BASE_URL: 'http://103.27.206.93:8080',
};

const ENV = 'LOCAL';

export const BASE_URL = ENV === 'VPS' ? VPS.BASE_URL : LOCAL.BASE_URL;
