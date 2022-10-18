import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Select from "react-select";
import Switch from "react-switch";

// export const UserTable = props => {
function UserTable(props) {
  var userData = props.userData;
  var groupData = props.groupData;

  var groupDataOptions = groupData.map(group => {
    return { value: group.group_name, label: group.group_name };
  });

  // Create cell state
  const [cellUsername, setCellUsername] = useState("");
  const [cellPassword, setCellPassword] = useState("");
  const [cellEmail, setCellEmail] = useState("");
  const [cellGroup, setCellGroup] = useState("");
  const [cellGroupChange, setCellGroupChange] = useState("");
  const [cellIsActive, setCellIsActive] = useState("");

  // Populate cell when edit is click
  function populateTable(username) {
    var i = 0;
    for (var i = 0; i < userData.length; i++) {
      if (userData[i].username == username) {
        // setCellPassword(userData[i].password);
        setCellEmail(userData[i].email);
        setCellIsActive(userData[i].is_active);
        const userGroupArray = userData[i].group_list.split(",");
        var userGroupDefault = userGroupArray.map(group => {
          return { value: group, label: group };
        });
        setCellGroup(userGroupDefault);
      }
    }
  }
  // Get group data

  // Save function
  function updateUser() {
    console.log(cellEmail);
    console.log(cellPassword);
    console.log(cellIsActive);
    console.log(cellGroup);
    setCellUsername("");
  }
  function convertToBoolean() {}
  // maxWidth: "850px",
  return (
    <div className="wrapper-editor">
      <table id="dtBasicExample-1" className="table table-striped table-bordered" cellSpacing="0" style={{ tableLayout: "auto" }}>
        <thead>
          <tr>
            <th className="th-sm">Username</th>
            <th className="th-sm">Password</th>
            <th className="th-sm">Email</th>
            <th className="th-sm">Group</th>
            <th className="th-sm">Active Status</th>
            <th className="th-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {userData.map(user => {
            // Editing Mode
            if (user.username == cellUsername) {
              return (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td>
                    <input id="edit-password" type="password" onChange={e => setCellPassword(e.target.value)} />
                  </td>
                  <td>
                    <input id="edit-email" type="email" onChange={e => setCellEmail(e.target.value)} value={cellEmail} />
                  </td>
                  <td>
                    <div style={{ width: "200px" }}>
                      <Select isMulti onChange={e => setCellGroup(e)} defaultValue={cellGroup} value={cellGroup.value} options={groupDataOptions} className="basic-multi-select" classNamePrefix="select" />
                    </div>
                  </td>
                  <td>
                    <Switch checked={Boolean(cellIsActive)} onChange={e => setCellIsActive(e)} />
                  </td>
                  <td>
                    {/* Save Button */}
                    <button
                      title="Save"
                      data-toggle="tooltip"
                      style={{ cursor: "pointer", background: "none", padding: "0", border: "none" }}
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        updateUser();
                      }}
                    >
                      <i className="fa fa-check" style={{ fontSize: "25px", marginRight: "20px" }}></i>
                    </button>
                    {/* Cancel Button */}
                    <button
                      title="Cancel"
                      data-toggle="tooltip"
                      style={{ cursor: "pointer", background: "none", padding: "0", border: "none" }}
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCellUsername("");
                      }}
                    >
                      <i className="fa fa-ban" style={{ fontSize: "25px" }}></i>
                    </button>
                  </td>
                </tr>
              );
            } else {
              return (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td></td>

                  <td>{user.email}</td>
                  <td>{user.group_list}</td>
                  <td>
                    <Switch checked={Boolean(user.is_active)} onChange={e => setCellIsActive(e)} disabled />
                  </td>
                  <td>
                    <a
                      title="Edit"
                      data-toggle="tooltip"
                      style={{ cursor: "pointer" }}
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCellUsername(user.username);
                        populateTable(user.username);
                      }}
                    >
                      <i className="fa fa-pen" style={{ fontSize: "25px" }}></i>
                    </a>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;

// {userData.map(user => (
//   <tr key={user.username}>
//     <td>{user.username}</td>
//     <td></td>
//     {/* contentEditable="true" */}
//     <td>{user.email}</td>
//     <td>{user.group_list}</td>
//     <td>{user.is_active}</td>
//     <td>
//       <button
//         className="primary"
//         title="Edit"
//         data-toggle="tooltip"
//         onClick={e => {
//           e.stopPropagation();
//           e.preventDefault();
//           setCellUsername(user.username);
//         }}
//       >
//         <i className="material-icons">&#xE254;</i>
//       </button>
//     </td>
//   </tr>
// ))}
//                {/* contentEditable="true" */}
