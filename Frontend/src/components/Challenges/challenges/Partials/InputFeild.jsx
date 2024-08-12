import React from 'react';

const InputField = ({ label, description, type, id, name, placeholder, value, onChange }) => {
  return (
    <div className="form-group">
      <label className="block text-gray-700" htmlFor={id}>
        {label}:
        <br />
        <small className="form-text text-gray-500">{description}</small>
      </label>
      <input
        type={type}
        className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
