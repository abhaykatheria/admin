import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "firebase/firebase-firestore";
import { CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

function TabularDisplay(props) {
  const [assignments, setAssignments] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
   setAssignments(props.data)
  }, [props]);

  const columns = props.columns

  const options = {
    filter: true,
    filterType: "dropdown",
    selectableRows: false, 
    rowsPerPage:100,
    onRowClick: (rowData, rowMeta) => {
      console.log(rowData);
    },
    onCellClick: (colData, cellMeta) => {
      console.log(colData, cellMeta);
    },
    onRowsDelete: () => false,
  };

  return (
    <div className="body">
      {assignments !== undefined ? (
        <MUIDataTable
          title={props.title}
          data={assignments}
          columns={columns}
          options={options}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default TabularDisplay;
