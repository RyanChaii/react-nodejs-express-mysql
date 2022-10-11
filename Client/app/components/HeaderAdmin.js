import React, { useEffect } from "react";

function HeaderAdmin() {
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h1 className="my-0 mr-md-auto font-weight-normal">
          <a href="/dashboard" className="text-white">
            {" "}
            TMS{" "}
          </a>
        </h1>
        <div className="mb-0 pt-2 pt-md-0">
          <div className="row align-items-center">
            <div className="col-md-auto">
              <button className="btn btn-info ">Profile</button>
            </div>

            <div className="col-md-auto">
              <button className="btn btn-info ">Manage User</button>
            </div>

            <div className="col-md-auto">
              <button className="btn btn-danger ">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderAdmin;
