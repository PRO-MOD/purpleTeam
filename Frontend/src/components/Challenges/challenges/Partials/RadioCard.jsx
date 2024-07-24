import React from 'react';

const RadioCard = ({ id, name, value, checked, onChange, label }) => {
  return (
    <label htmlFor={id} className="w-full">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="card-radio hidden"
      />
      <div
        className={`card border-2 rounded-sm p-4 ${
          checked ? 'border-green-500' : 'border-gray-300'
        }`}
      >
        <div className="form-check">
          <input
            className="form-check-input card-radio-clone hidden"
            type="radio"
            style={{ visibility: 'hidden' }}
            checked={checked}
            readOnly
          />
          <span className={`form-check-label ${checked ? 'text-green-500' : ''}`}>
            {label}
          </span>
        </div>
      </div>
    </label>
  );
};

export default RadioCard;
