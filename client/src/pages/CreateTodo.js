import React from "react";
import TodoHeader from "../components/header/TodoHeader";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormInput from "../components/form/FormInput";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const CreateTodo = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const { handleChange, errors, touched, handleBlur, handleSubmit, values } =
    useFormik({
      initialValues: {
        title: "",
      },
      validationSchema: Yup.object().shape({
        title: Yup.string().required("Please enter todo title"),
      }),
      onSubmit: async (values) => {
        try {
          await axiosInstance.post(`/api/v1/todo/`, { title: values.title });
          navigate("/");
        } catch (err) {
          const { status } = err.response;
          if (status === 401 || status === 403) {
            handleLogout();
          }
        }
      },
    });

  return (
    <>
      <TodoHeader />

      <div className="main__container create__todo">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="signin-form form-style-two rounded-buttons py-5">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-input">
                    <FormInput
                      name="title"
                      placeholder="Todo title"
                      type="text"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.title}
                      touched={touched.title}
                    />
                  </div>

                  <button
                    className="btn primary-btn rounded-full mt-0"
                    type="submit"
                    disabled={errors.email || errors.password ? true : false}
                  >
                    + Add
                  </button>

                  <div className="text-center mt-2">
                    <Link to="/">
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

export default CreateTodo;
