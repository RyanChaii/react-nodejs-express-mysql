import React, { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Tooltip, Switch, FormControlLabel, Checkbox } from "@mui/material";
import { Typography } from "@mui/material";

// export const UserTable = props => {
function UserTable(props) {
  console.log(props.userData);
  var userData = props.userData;
  var groupData = props.groupData;
  console.log(groupData);
  // Populating columns
  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: "username",
        header: "Username",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false
      },
      {
        accessorKey: "pw",
        header: "Password",
        muiTableBodyCellEditTextFieldProps: {
          type: "password",
          variant: "outlined"
        }
      },
      {
        accessorKey: "email",
        header: "Email"
      },
      {
        accessorKey: "group_list",
        header: "Group",
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: groupData.map(gn => (
            <MenuItem key={gn.group_name} value={gn.group_name}>
              {gn.group_name}
            </MenuItem>
          ))
        }
      },
      {
        accessorKey: "is_active",
        header: "Active",
        muiSelectCheckboxProps: {
            
        }

        // muiTableBodyCellEditTextFieldProps: {
        //   slide: true //change to select for a dropdown

        //   children: groupData.map(group_name => (
        //     <MenuItem key={group_name} value={group_name}>
        //       {group_name}
        //     </MenuItem>
        //   ))
        // }
        // <MenuItem key={props.groupData} value={props.groupData}>
        //   {group_name}
        // </MenuItem>
      }
    ],
    //[getCommonEditTextFieldProps],
    []
    //end
  );

  return (
    // <div>Hi</div>
    <MaterialReactTable
      // Table Header
      columns={columns}
      // Cell Data from props
      data={userData}
      /* Table Options */
      // Editing button
      enableEditing
      // Table row during editing mode
      editingMode="row"
      // Allow column to be shifted
      enableColumnOrdering
      // Allow adjustment of cell space
      enableDensityToggle={true} //density toggle is not compatible with memoization
      // Allow user to pin the column they want
      enablePinning
      // Header will stick to the top
      enableStickyHeader
      // Table Title
      renderTopToolbarCustomActions={() => (
        <Typography component="span" variant="h5">
          View User
        </Typography>
      )}
      // Set pagination
      initialState={{ pagination: { pageSize: 10, pageIndex: 0 } }}
      // Chexk
      muiSelectCheckboxProps={({ row }) => ({
        color: "secondary"
      })}
    />
  );
}

export default UserTable;

// Not sure what this is
//   muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
// Hiding of extra info
//   renderDetailPanel={({ row }) => <div>{row.original.username}</div>}
// Memorising cells, may break some feature
//   memoMode="cells"

//   defaultColumn={{
//     Cell: ({ cell }) => {
//       //see how often cells are re-rendered
//       console.info("render cell", cell.id);
//       return <>{cell.getValue()}</>;
//     }
//   }}
