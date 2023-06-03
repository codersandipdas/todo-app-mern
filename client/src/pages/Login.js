import React, { useEffect, useState } from 'react';
import './Login.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormInput from '../components/form/FormInput';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { token, handleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setErrors] = useState('');

  useEffect(() => {
    token && navigate('/', { replace: true });
  }, [token, navigate]);

  const { handleChange, errors, touched, handleBlur, handleSubmit, values } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: Yup.object().shape({
        email: Yup.string().email().required('Please enter email address'),
        password: Yup.string().required(
          'Password length must be >=8 character'
        ),
      }),
      onSubmit: async (values) => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_AUTH}/api/v1/auth/login`,
            {
              email: values.email,
              password: values.password,
            }
          );

          const token = response.data.token;
          handleLogin(token);
          token && navigate('/', { replace: true });
        } catch (err) {
          setErrors(err.response.data.message);
        }
      },
    });

  return (
    <section className='signin-area signin-one'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-5 col-xl-4'>
            <form onSubmit={handleSubmit}>
              <div className='signin-form form-style-two rounded-buttons px-4 py-3'>
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='form-input'>
                      <h2 className='fw-bold mb-4'>Login</h2>

                      {error && (
                        <div className='alert alert-danger' role='alert'>
                          {error}
                        </div>
                      )}

                      <FormInput
                        name='email'
                        placeholder='Email'
                        type='email'
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                      />

                      <FormInput
                        name='password'
                        placeholder='Password'
                        type='password'
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                        touched={touched.password}
                      />
                    </div>

                    <button
                      className='btn primary-btn rounded-full mt-4'
                      type='submit'
                      disabled={errors.email || errors.password ? true : false}
                    >
                      Login
                    </button>

                    <div className='text-center mt-5 mb-3'>
                      Don&apos;t have an account?&nbsp;
                      <Link to='/signup'>Signup</Link>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
