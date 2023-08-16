import { createContext, useCallback, useEffect, useState } from 'react';

export const ErrorContext = createContext(null);

export const WithError = ({ children }) => {
  const [error, setError] = useState({});
  const displayError = useCallback((message) => {
    setError({ message, close: () => setError({}) });
  }, []);
  return (
    <ErrorContext.Provider value={displayError}>
      {children}
      {error.close && <Error error={error} />}
    </ErrorContext.Provider>
  );
};

const Error = ({ error: { message, close } }) => {
  if (!message) message = 'Bitte benachrichtige den Gastgeber.';
  useEffect(() => {
    const timeout = setTimeout(close, 10000);
    return () => clearTimeout(timeout);
  }, [message, close]);
  return (
    <div className="message is-danger error">
      <div className="message-header">
        <p>Ein Fehler ist aufgetreten</p>
        <button className="delete" aria-label="delete" onClick={close} />
      </div>
      <div className="message-body">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Error;
