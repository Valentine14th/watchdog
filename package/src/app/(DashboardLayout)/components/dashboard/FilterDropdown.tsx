import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useCallback, useMemo } from "react";

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

  const handleChange = useCallback((event: any) => {
    const value = event.target.value;
    setSelectedoptions(value);
  }, [setSelectedoptions])

  const selectedText = useMemo(() => selectedOptions.join(", "), [selectedOptions]);

  return (
    <div style={{ width: "300px", margin: "20px auto", textAlign: "center", padding: "10px" }}>
      <FormControl fullWidth>
        <InputLabel>{description}</InputLabel>
        <Select
          multiple
          value={selectedOptions}
          onChange={(e) => handleChange(e)}
          input={<OutlinedInput label={description} />}
          renderValue={(selected) => selectedText}
        >
          {menuItems}
        </Select>
      </FormControl>
    </div>
  );
}

export default FilterDropdown;
