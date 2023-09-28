import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../support/Alert";

/** Login form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls login function prop
 * - redirects to /homePage route
 *
 * AppRoutes -> LoginForm -> Alert
 * Routed as /login
 */

function LoginForm({ login }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState("");
  const Navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await login(formData);
    if (result.success) {
      Navigate("/homePage");
    } else {
      setFormErrors(result.errors);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }
  return (
    <div className="auth-form-container">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h3 className="text">Log In</h3>
        <div className="card">
          <div className="card-body">
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.username}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </div>

              {formErrors !== ""?(
                <Alert type="danger" error={formErrors} />
              ) : null}

              <button
                className="btn btn-primary float-right"
                onSubmit={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginForm;
