import React from "react";

function Footer() {
  return (
    <footer className="border-top text-center small text-muted py-3">
      <p>
        <a href="/" className="mx-1">
          Home
        </a>{" "}
        |{" "}
        <a className="mx-1" href="/about-us">
          About Us
        </a>{" "}
        |{" "}
        <a className="mx-1" href="/terms">
          Terms
        </a>
      </p>
      <p className="m-0">
        Copyright &copy; 2020{" "}
        <a href="/" className="text-muted">
          ComplexApp
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
{
  /* <form className="mb-0 pt-2 pt-md-0">
          <div className="row align-items-center">
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
              <input name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
            </div>
            <div className="col-md-auto">
              <button className="btn btn-success btn-sm">Sign In</button>
            </div>
          </div>
        </form> */
}
