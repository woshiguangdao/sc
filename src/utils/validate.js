export const isEmail = (s) => /\S+@\S+\.\S+/.test(s);
export const isRequired = (v) => v !== undefined && v !== null && v !== '';

