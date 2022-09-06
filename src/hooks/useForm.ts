import * as React from 'react';

export function useForm(inputValues: { [key: string]: any }) {
  const [values, setValues] = React.useState(inputValues);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value, name} = event.target;
    setValues({...values, [name]: value});
  };

  return {values, handleChange, setValues};
}