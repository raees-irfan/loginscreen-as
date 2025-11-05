import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { login } from '../store/slices/authSlice';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    consent: Yup.boolean()
      .oneOf([true], 'You must consent to the processing of your personal data')
      .required('Consent is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(login({
        email: values.email,
        password: values.password,
      })).unwrap();
      console.log("user login credentials", result)
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "right", marginRight: "50px", marginTop: "10px" }}>Abdul Samad</h1>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">AlMukarramah</h1>
            <p className="login-subtitle">User Management System</p>
          </div>

          <Formik
            initialValues={{
              email: '',
              password: '',
              consent: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                    placeholder="your@email.com"
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <div className="form-label-row">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <Link to="#" className="forgot-password">
                      Forgot password?
                    </Link>
                  </div>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className={`form-input ${errors.password && touched.password ? 'error' : ''}`}
                    placeholder="••••••••"
                  />
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <Field type="checkbox" name="consent" className="checkbox-input" />
                    <span className="checkbox-text">
                      I consent to the processing of my personal data according to the Privacy Policy.</span>
                  </label>
                  <ErrorMessage name="consent" component="div" className="error-message" />
                </div>

                <button
                  type="submit"
                  className="signin-button"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="contact-admin">
                  Contact your administrator if you need access
                </p>
                <div className="signup-link-container">
                  <p className="signup-link-text">
                    Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <footer className="login-footer">
          <p className="copyright">© 2025 AlMukarramah. All rights reserved.</p>
          <div className="footer-links">
            <span className="footer-link">Privacy Policy</span>
            <span className="footer-separator">|</span>
            <span className="footer-link">Terms of Use</span>
          </div>
        </footer>
      </div>
    </>

  );
};

export default Login;

