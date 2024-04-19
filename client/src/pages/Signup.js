import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import FormInput from "../components/form/FormInput";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../services/axiosInstance";
import "./Login.css";

const Signup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setErrors] = useState("");

  useEffect(() => {
    user && navigate("/", { replace: true });
  }, [user, navigate]);

  const { handleChange, errors, touched, handleBlur, handleSubmit, values } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: Yup.object().shape({
        email: Yup.string().email().required("Please enter email address"),
        password: Yup.string().required(
          "Password length must be >=8 character"
        ),
      }),
      onSubmit: async (values) => {
        try {
          await axiosInstance.post(`/api/v1/auth/register`, {
            email: values.email,
            password: values.password,
          });
          navigate("/login", { replace: true });
        } catch (err) {
          setErrors(err.response.data.message);
        }
      },
    });

  return (
    <section className="signin-area signin-one">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-xl-4">
            <form onSubmit={handleSubmit}>
              <div className="signin-form form-style-two rounded-buttons px-4 py-3">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-input">
                      <h2 className="fw-bold mb-4">Sign Up</h2>

                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <FormInput
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                      />

                      <FormInput
                        name="password"
                        placeholder="Password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                        touched={touched.password}
                      />
                    </div>

                    <button
                      className="btn primary-btn rounded-full mt-4"
                      type="submit"
                      disabled={errors.email || errors.password ? true : false}
                    >
                      Create an account
                    </button>

                    <div className="text-center mt-5 mb-3">
                      Already have an account?&nbsp;
                      <Link to="/login">Login</Link>
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

export default Signup;
