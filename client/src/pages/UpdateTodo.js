import React, { useEffect } from 'react';
import TodoHeader from '../components/header/TodoHeader';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormInput from '../components/form/FormInput';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const UpdateTodo = () => {
  const { token, handleLogout } = useAuth();
  const navigate = useNavigate();
  let { id } = useParams();

  const {
    handleChange,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    values,
    setFieldValue,
  } = useFormik({
    initialValues: {
      title: '',
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Please enter todo title'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_AUTH}/api/v1/todo/${id}`,
          { title: values.title },
          { headers: { authorization: `Bearer ${token}` } }
        );

        navigate('/');
      } catch (err) {
        console.log(err.response.data.message);
        if (err.response.data.message === 'Invalid token') {
          handleLogout();
        }
      }
    },
  });

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_AUTH}/api/v1/todo/${id}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        setFieldValue('title', response.data.title);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTodo();
  }, [id, token, setFieldValue]);

  return (
    <>
      <TodoHeader />

      <div className='main__container create__todo'>
        <div className='container'>
          <form onSubmit={handleSubmit}>
            <div className='signin-form form-style-two rounded-buttons py-5'>
              <div className='row'>
                <div className='col-md-12'>
                  <div className='form-input'>
                    <FormInput
                      name='title'
                      placeholder='Todo title'
                      type='text'
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.title}
                      touched={touched.title}
                    />
                  </div>

                  <button
                    className='btn primary-btn rounded-full mt-0'
                    type='submit'
                    disabled={errors.email || errors.password ? true : false}
                  >
                    Update
                  </button>

                  <div className='text-center mt-2'>
                    <Link to='/'>
                      <span>&laquo;</span> Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateTodo;
