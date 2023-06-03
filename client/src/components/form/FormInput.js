import React from 'react';

const FormInput = ({
  name,
  placeholder,
  type,
  value,
  onChange,
  onBlur,
  error,
  touched,
  className,
}) => {
  return (
    <div className='input-items default mb-3'>
      <input
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={{ borderColor: error && touched ? '#b94a48' : '' }}
      />
      {error && touched && <p className='form__error'>{error}</p>}
    </div>
  );
};

export default FormInput;
