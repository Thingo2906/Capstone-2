import React, { useState, useContext } from "react";
import UserContext from "../../auth/UserContext";
//import "./Profile.css";
import Alert from "../../support/Alert";

// Fill out the form to update user info.
function ProfileForm({ changeProfile }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    password: "",
    email: currentUser.email,
  });
  const [formErrors, setFormErrors] = useState([]);
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  console.debug(
    "ProfileForm",
    "currentUser=",
    currentUser,
    "formData=",
    formData,
    "formErrors=",
    formErrors,
    "saveConfirmed=",
    saveConfirmed
  );

  function handleChange(evt) {
    const { value, name } = evt.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setFormErrors([]);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    if (!formData.password) {
       // Password is required
      setFormErrors(["Password is required."]);
      return;
    };
  

    let profileData = {
       firstName: formData.firstName,
       lastName: formData.lastName,
       email: formData.email,
       password: formData.password,
    };
    try {
    // Continue with the update since the password comparison was successful
     
      let updatedUser = await changeProfile(currentUser.username, profileData);

      if (updatedUser) {
        setFormData((formData) => ({ ...formData, password: "" }));
        setCurrentUser(updatedUser);
        setFormErrors([]);
        setSaveConfirmed(true);
      }
     
    } catch (error) {
    // Handle other errors here if needed
      setFormErrors([error.message]);
      return;
  }
}

    // Empty the password. and the user need to fill out password to confirm the change.
    
  
  return (
    <div className="auth-form-container">
      <div className=" container offset-md-3 col-lg-4 offset-lg-4">
        <h3>Profile</h3>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <b>Username</b>
                </label>
                <p className="form-control-plaintext">{formData.username}</p>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  className="form-control"
                  onChange={handleChange}
                  defaultValue={currentUser.email}
                  value={formData.email}
                />
              </div>

              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  className="form-control"
                  onChange={handleChange}
                  defaultValue={currentUser.firstName}
                  value={formData.firstName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  className="form-control"
                  onChange={handleChange}
                  defaultValue={currentUser.lastName}
                  value={formData.lastName}
                />
              </div>
              <div className="form-group">
                <h3>Confirm your password to update your change</h3>

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>

              {formErrors.length ? (
                <Alert type="danger" messages={formErrors} />
              ) : null}

              {saveConfirmed ? (
                <Alert type="success" messages={["Updated successfully."]} />
              ) : null}

              {!saveConfirmed ? (
                <button
                  className="btn btn-primary btn-block mt-4"
                  onSubmit={handleSubmit}
                >
                  Save
                </button>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfileForm;
