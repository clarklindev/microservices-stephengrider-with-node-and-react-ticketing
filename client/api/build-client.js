import axios from 'axios';

//usage: call buildClient() passing in an object with request attached

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    //server
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    //client (browser)
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
