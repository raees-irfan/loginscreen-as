import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { signup } from '../store/slices/authSlice';
import './Signup.css';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    role: Yup.string()
      .oneOf(['user', 'admin'], 'Please select a valid role')
      .required('Role is required'),
    consent: Yup.boolean()
      .oneOf([true], 'You must consent to the processing of your personal data')
      .required('Consent is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(
        signup({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        })
      ).unwrap();

      toast.success('Signup successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Signup failed. Please try again.');
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "right", marginRight: "50px", marginTop: "10px" }}>Abdul Samad</h1>
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1 className="signup-title">AlMukarramah</h1>
            <p className="signup-subtitle">User Management System</p>
          </div>

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: '',
              consent: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="signup-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                    placeholder="Enter your name"
                  />
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
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
                  <label htmlFor="password" className="form-label">Password</label>
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
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-input ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`}
                    placeholder="••••••••"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="role" className="form-label">Role</label>
                  <Field
                    as="select"
                    id="role"
                    name="role"
                    className={`form-input form-select ${errors.role && touched.role ? 'error' : ''}`}
                  >
                    <option value="">Select role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Field>
                  <ErrorMessage name="role" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <Field type="checkbox" name="consent" className="checkbox-input" />
                    <span className="checkbox-text">
                      I consent to the processing of my personal data according to the Privacy Policy.
                    </span>
                  </label>
                  <ErrorMessage name="consent" component="div" className="error-message" />
                </div>

                <button
                  type="submit"
                  className="signup-button"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>

                <p className="contact-admin">
                  Contact your administrator if you need access
                </p>

                <div className="login-link-container">
                  <p className="login-link-text">
                    Already have an account?{' '}
                    <Link to="/login" className="login-link">Sign In</Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <footer className="signup-footer">
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

export default Signup;
