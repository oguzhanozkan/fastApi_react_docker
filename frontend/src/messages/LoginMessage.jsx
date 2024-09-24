import React from "react";

const LoginMessage = ({ message }) => (
  <>
    {message === "user created successfully" && (
      <p className="has-text-weight-bold has-text-success">{message}</p>
    )}
    {message === "please check your email" && (
      <p className="has-text-weight-bold has-text-danger">{message}</p>
    )}
  </>

);

export default LoginMessage;