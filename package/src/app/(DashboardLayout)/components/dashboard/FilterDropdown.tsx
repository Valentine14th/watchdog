import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useMemo } from "react";

const handleChange = (event: any, setSelectedOptions: any) => {
  const value = event.target.value;
  setSelectedOptions(value);
};

function FilterDropdown({
  description,
  allOptions,
  selectedOptions,
  setSelectedoptions,
}: {
  description: string
  allOptions: string[];
  selectedOptions: string[];
  setSelectedoptions: any;
}) {

  const menuItems = useMemo(() => 
    allOptions.map((version) => (
      <MenuItem key={version} value={version}>
        <Checkbox checked={selectedOptions.indexOf(version) > -1} />
        <ListItemText primary={version} />
      </MenuItem>
    )),
  [allOptions, selectedOptions]);


  return (
    <div style={{ width: "300px", margin: "20px auto", textAlign: "center", padding: "10px" }}>
      <FormControl fullWidth>
        <InputLabel>{description}</InputLabel>
        <Select
          multiple
          value={selectedOptions}
          onChange={(e) => handleChange(e, setSelectedoptions)}
          input={<OutlinedInput label={description} />}
          renderValue={(selected) => selected.join(", ")}
        >
          {menuItems}
        </Select>
      </FormControl>
    </div>
  );
}

export default FilterDropdown;
