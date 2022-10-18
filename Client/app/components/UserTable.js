import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// export const UserTable = props => {
function UserTable(props) {
  console.log(props.userData);
  var userData = props.userData;
  var groupData = props.groupData;
  console.log(groupData);

  return (
    <div>
      Hi
      {/* dw */}
    </div>
  );
}

export default UserTable;
