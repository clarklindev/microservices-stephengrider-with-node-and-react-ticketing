import axios from 'axios';
import { useState } from 'react';

//url, method (GET, PUT, POST, PATCH, DELETE)
// method must be equal to 'get' || 'put' || 'patch' || 'post' || 'delete'
const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });
      console.log('axios response: ', response);
      console.log('response.data: ', response.data);

      if (onSuccess) {
        console.log('SUCCESS');
        onSuccess(response.data);
        console.log('This log is after calling onSuccess'); // Ensure this runs
      }
      
      return response.data;
      
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>oops..</h4>
          <ul className="my-0">
            {err.response?.data?.errors.map((err, index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      );

      // throw err;
    }
  };

  return { doRequest, errors };
};

export default useRequest; //note: hooks use smallcase
