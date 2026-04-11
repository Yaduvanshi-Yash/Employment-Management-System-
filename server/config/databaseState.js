let mongoEnabled = false;

export const setMongoEnabled = (value) => {
  mongoEnabled = Boolean(value);
};

export const isMongoEnabled = () => mongoEnabled;
