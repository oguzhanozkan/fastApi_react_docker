import React from "react";

const RegisterMessage = ({ message }) => (
  <>
    {message === "user created successfully" && (
      <p className="has-text-weight-bold has-text-success">{message}</p>
    )}
    {message === "email already in use" && (
      <p className="has-text-weight-bold has-text-danger">{message}</p>
    )}
  </>
);

export default RegisterMessage;