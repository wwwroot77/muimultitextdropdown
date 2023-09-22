import React, { useState } from 'react';
import { TextField } from '@mui/material';
import MultiColumnDropdownTextField from '../../components/muidropdown';

export default function DropDownText() {
  const [fields, setFields] = useState([
    { anchorEl: null, selectedNames: ["Happy Kim"], selectedIds: ["user02"] },
    { anchorEl: null, selectedNames: ["Anold Park, Han na Oh"], selectedIds: ["user03, user05"] },
  ]);

  const handleTextboxClick = (event, index) => {
    const newFields = [...fields];
    newFields[index].anchorEl = event.currentTarget;
    setFields(newFields);
  };

  const handleClose = (index) => {
    const newFields = [...fields];
    newFields[index].anchorEl = null;
    setFields(newFields);
  };

  const handleNameChange = ({ names, ids }, index) => {
    const newFields = [...fields];
    newFields[index].selectedNames = names.split(", ");
    newFields[index].selectedIds = ids.split(", ");
    setFields(newFields);
  };

  return (
    <div style={{ padding: "20px", width: "550px" }}>
      {fields.map((field, index) => (
        <div key={index}>
          <TextField
            variant="outlined"
            onClick={e => handleTextboxClick(e, index)}
            value={field.selectedNames.join(", ") || "Select names..."}
            fullWidth
          />
          <TextField
            variant="outlined"
            value={field.selectedIds.join(", ") || "Select ids..."}
            fullWidth
            disabled
          />
          <MultiColumnDropdownTextField 
            anchorEl={field.anchorEl}
            onClose={() => handleClose(index)}
            onChange={(data) => handleNameChange(data, index)}
            initialValues={field.selectedNames.join(", ")}
            initialSelectedIds={field.selectedIds}
          />
        </div>
      ))}
    </div>
  );
}