import React, { useContext } from "react";
import {Link} from "react-router-dom";
import UserContext from "../../auth/UserContext";
import "./homepage.css";
/** Homepage of site.
 *
 * Shows welcome message or login/signup buttons.
 *
 * Routed at /homepage
 *
 * AppRoutes -> Homepage
*/
function Homepage(){
    const {currentUser} = useContext(UserContext);
    console.debug("Homepage", "currentUser=", currentUser);
    return (
        <div className ="Homepage">
            <div className="text-center">
               <h1 className="mb-4 font-weight-bold">MOVIES</h1>
               <p>All the movies in one. Enjoys your movie with us!.</p>
               {currentUser? (
                <h2>Welcome back! {currentUser.firstname}</h2>
               ) : (
                <p>
                  <Link
                   className="btn btn-primary font-weight-bold btn-margin"
                   to="/login"
                  >
                   Log in
                  </Link>
                  <Link className="btn btn-primary font-weight-bold" to="/signup">
                   Sign up
                  </Link>
                </p>
               )}

            </div>
        </div>
    );

}
export default Homepage;