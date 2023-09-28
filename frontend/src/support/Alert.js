import React from "react";

/** Presentational component for showing bootstrap-style alerts.
 *
 * { LoginForm, SignupForm, ProfileForm } -> Alert
 **/

function Alert({ error = "" }) {
  console.debug("Alert", "error=", error);

  return (
    <div className= "error-msg" role="alert">
      
        <p className="mb-0 small" key={error}>
          {error}
        </p>
    
    </div>
  );
}

export default Alert;
