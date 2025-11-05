import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Country, State, City } from 'country-state-city';
import api from '../utils/api';
import './AddUserModal.css';

const AddUserModal = ({ isOpen, onClose, onUserAdded, editingUser, isAdmin }) => {
  const dispatch = useDispatch();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const loggedInUser = useSelector((state) => state.auth.user);
  const isEditMode = !!editingUser;

  const allCountries = Country.getAllCountries();

  useEffect(() => {
    if (editingUser) {
      if (editingUser.country) {
        setStates(State.getStatesOfCountry(editingUser.country));
      }
      if (editingUser.state) {
        setCities(City.getCitiesOfState(editingUser.country, editingUser.state));
      }
    }
  }, [editingUser]);

  if (!isOpen) return null;

  const isEditingSelf = isEditMode && editingUser?.id === loggedInUser?.id;

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    organization: Yup.string().required('Organization is required'),

    password: Yup.string().when([], {
      is: () => {

        if (!isEditMode) return true;


        if (isEditingSelf) return true;


        return false;
      },
      then: (schema) =>
        schema
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters')
          .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
          .matches(/^(?=.*[@$!%*?&])/, 'Password must contain at least one special character'),
      otherwise: (schema) =>
        schema
          .nullable()
          .min(6, 'Password must be at least 6 characters')
          .test(
            'passwordStrength',
            'Password must contain at least one uppercase letter, one number, and one special character',
            function (value) {
              if (!value) return true;
              return /^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])/.test(value);
            }
          ),
    }),

    confirmPassword: Yup.string().when('password', {
      is: (val) => val && val.length > 0,
      then: (schema) =>
        schema
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm your password'),
      otherwise: (schema) => schema.nullable(),
    }),
  });


  const handleCountryChange = (countryCode, setFieldValue) => {
    setFieldValue('country', countryCode);
    setFieldValue('state', '');
    setFieldValue('city', '');
    if (countryCode) {
      setStates(State.getStatesOfCountry(countryCode));
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = (stateCode, countryCode, setFieldValue) => {
    setFieldValue('state', stateCode);
    setFieldValue('city', '');
    if (stateCode && countryCode) {
      setCities(City.getCitiesOfState(countryCode, stateCode));
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        country: values.country,
        state: values.state,
        city: values.city,
        organization: values.organization,
      };


      if (!isEditMode || (isEditingSelf && values.password) || (!isAdmin && values.password)) {
        userData.password = values.password;
      }


      if (isAdmin) {
        if (!isEditingSelf) {
          userData.role = values.role;
        } else {
          userData.role = editingUser.role;
        }
      }

      if (isEditMode) {
        const isEditingSelf = editingUser.id === loggedInUser.id;

        const endpoint =
          isAdmin && !isEditingSelf
            ? `/users/${editingUser.id}`
            : '/users/me';

        await api.put(endpoint, userData);
        toast.success('User updated successfully!');
      } else {
        await api.post('/users', userData);
        toast.success('User created successfully!');
      }

      resetForm();
      onUserAdded?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

 

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEditMode ? 'Edit User' : 'Add User'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <Formik
          initialValues={{
            name: editingUser?.name || '',
            email: editingUser?.email || '',
            phone: editingUser?.phone || '',
            password: '',
            confirmPassword: '',
            country: editingUser?.country || '',
            state: editingUser?.state || '',
            city: editingUser?.city || '',
            organization: editingUser?.organization || '',
            role: editingUser?.role || 'user',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched, setFieldValue, values }) => (
            <Form className="add-user-form">
              <div className="form-row">
                {/* LEFT COLUMN */}
                <div className="form-col">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <Field type="text" name="name" className={`form-input ${errors.name && touched.name ? 'error' : ''}`} />
                    <ErrorMessage name="name" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <Field type="tel" name="phone" className={`form-input ${errors.phone && touched.phone ? 'error' : ''}`} />
                    <ErrorMessage name="phone" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <Field
                      as="select"
                      name="country"
                      className={`form-input ${errors.country && touched.country ? 'error' : ''}`}
                      onChange={(e) => handleCountryChange(e.target.value, setFieldValue)}
                    >
                      <option value="">Select country</option>
                      {allCountries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="country" component="div" className="error-message" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <Field
                      as="select"
                      name="city"
                      disabled={!values.state}
                      className={`form-input ${errors.city && touched.city ? 'error' : ''}`}
                    >
                      <option value="">Select city</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="city" component="div" className="error-message" />
                  </div>

                  {/*Password logic */}
                  {((isEditMode && (isEditingSelf || !isAdmin)) || (!isEditMode)) && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Password *</label>
                        <Field type="password" name="password" className={`form-input ${errors.password && touched.password ? 'error' : ''}`} />
                        <ErrorMessage name="password" component="div" className="error-message" />
                      </div>
                    </>
                  )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="form-col">
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <Field type="email" name="email" className={`form-input ${errors.email && touched.email ? 'error' : ''}`} disabled={isAdmin && !isEditingSelf}/>
                    <ErrorMessage name="email" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Organization *</label>
                    <Field type="text" name="organization" className={`form-input ${errors.organization && touched.organization ? 'error' : ''}`} />
                    <ErrorMessage name="organization" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <Field
                      as="select"
                      name="state"
                      disabled={!values.country}
                      className={`form-input ${errors.state && touched.state ? 'error' : ''}`}
                      onChange={(e) => handleStateChange(e.target.value, values.country, setFieldValue)}
                    >
                      <option value="">Select state</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="state" component="div" className="error-message" />
                  </div>


                  {/* Role visible but disabled for restricted cases */}
                  <div className="form-group">
                    <label className="form-label">Role *</label>
                    <Field
                      as="select"
                      name="role"
                      disabled={
                        (isAdmin && isEditingSelf) || (!isAdmin)
                      }
                      className={`form-input ${errors.role && touched.role ? 'error' : ''}`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Field>
                    <ErrorMessage name="role" component="div" className="error-message" />
                  </div>

                  {((isEditMode && (isEditingSelf || !isAdmin)) || (!isEditMode)) && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Confirm Password *</label>
                        <Field type="password" name="confirmPassword" className={`form-input ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`} />
                        <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="create-btn" disabled={isSubmitting}>
                  {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update' : 'Create')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUserModal;
