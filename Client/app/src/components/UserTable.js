import { useState } from "react";
import Axios from "axios";
import Select from "react-select";
import Switch from "react-switch";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserTable(props) {
  // Create cell state
  const [cellUsername, setCellUsername] = useState("");
  const [cellPassword, setCellPassword] = useState("");
  const [cellEmail, setCellEmail] = useState("");
  const [cellGroup, setCellGroup] = useState("");
  const [cellIsActive, setCellIsActive] = useState("");
  // User and group data from props
  var userData = props.userData;
  var groupData = props.groupData;

  // Displaying select field for user group during edit user
  var groupDataOptions = groupData.map(group => {
    return { value: group.group_name, label: group.group_name };
  });

  // Populate cell when edit is click
  function populateTable(username) {
    var i = 0;
    for (var i = 0; i < userData.length; i++) {
      if (userData[i].username == username) {
        // Set selected cell email
        setCellEmail(userData[i].email);
        // Set selected cell if user is active
        setCellIsActive(userData[i].is_active);
        // Check if user object contain group, else do not populate
        if (userData[i].group_list.length > 0) {
          // Split comma
          const userGroupArray = userData[i].group_list.split(",");
          // Return in value label format for react select
          var userGroupDefault = userGroupArray.map(group => {
            return { value: group, label: group };
          });
          setCellGroup(userGroupDefault);
        }
        // Set cell group as empty
        else {
          setCellGroup("");
        }
      }
    }
  }

  // Handle table update user
  async function updateUser() {
    var groupMerge;

    if (cellGroup.length > 0) {
      // Merging the group
      groupMerge = cellGroup.map(group => {
        return group.value;
      });
    } else {
      setCellGroup("");
      groupMerge = "";
    }
    // Slide true or false for is_active
    var isact = cellIsActive ? 1 : 0;

    try {
      const response = await Axios.post("http://localhost:3000/usermanagement/updateuser", { username: cellUsername, email: cellEmail, password: cellPassword, is_active: isact, group_list: groupMerge });
      // Profile updated successfully
      if (response.data.message == "User Profile Updated") {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000
        });
        // Remove state for username
        setCellUsername("");
        // tableEdit[0] = getting state value from props
        // tableEdit[1] = setting state value from props
        // Adjust state value from props and perform callback on change detection
        if (props.tableEdit[0] == false) {
          props.tableEdit[1](true);
        } else {
          props.tableEdit[1](false);
        }
      }
      // Update fail
      if (!response.data.success) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000
        });
        console.log(response.data.message);
      }
    } catch (e) {
      // Catch any unidentify error
      console.log(e);
    }
  }

  return (
    <div className="wrapper-editor">
      <table id="dtBasicExample-1" className="table table-striped table-bordered" cellSpacing="0" style={{ tableLayout: "auto" }}>
        <thead style={{ backgroundColor: "darkgray" }}>
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
                    <div style={{ width: "300px" }}>
                      <Select isMulti onChange={e => setCellGroup(e)} defaultValue={cellGroup} value={cellGroup.value} options={groupDataOptions} className="basic-multi-select" classNamePrefix="select" />
                    </div>
                  </td>
                  <td>
                    <Switch id="is-active-switch" checked={Boolean(cellIsActive)} onChange={e => setCellIsActive(e)} disabled={cellUsername == "admin" ? Boolean(1) : Boolean(0)} />
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
            }
            // Default Mode
            else {
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
