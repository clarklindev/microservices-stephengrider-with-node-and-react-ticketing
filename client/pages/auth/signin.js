import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request'; //our custom reusable request hook :)

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //note: useRequest receives an object
  //url is (nextjs look at folder structure): https://ticketing.dev/auth/signin

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest(); //using re-usable fetch hook...
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Sign in</h1>
        <div className="form-group">
          <label>Email address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <br />
        {errors}
        <button className="btn btn-primary">Sign in</button>
      </form>
    </div>
  );
};

export default Signin;
