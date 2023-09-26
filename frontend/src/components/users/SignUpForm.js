import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../support/Alert";

function SignUpForm({ signUp }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName:  "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const Navigate = useNavigate();
  console.log(
    "SignupForm",
    "signup=",
    typeof signUp,
    "formData=",
    formData,
    "formErrors=",
    formErrors
  );

  async function handleSubmit(evt) {
    evt.preventDefault();
    const result = await signUp(formData);
    if (result.success) {
      Navigate("/homePage");
    } else {
      setFormErrors(result.errors);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({...f, [name]: value }));
  }

  return (
    <div className="auth-form-container">
      <div className="container offset-md-3 col-lg-4 offset-lg-4">
        <h3 className="text">Signup</h3>
        <div className="card">
          <div className="card-body">
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group col-md-6">
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

              <div className="form-group col-md-6">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.firstName}
                  required
                />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.lastName}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>

              {formErrors.length ? (
                <Alert type="danger" message={formErrors} />
              ) : null}

              <button className="btn btn-primary" onSubmit={handleSubmit}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignUpForm;
