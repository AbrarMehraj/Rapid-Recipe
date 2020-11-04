/** @format */

import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import TuneIcon from "@material-ui/icons/Tune";
import Radio from "@material-ui/core/Radio";

import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { Container } from "@material-ui/core";

export default function Filter({ getType }) {
  const [value, setValue] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = () => {
    setAnchorEl(null);
    getType(value);
    setValue("");
  };

  return (
    <Container>
      <TuneIcon
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{
          float: "right",
        }}
      />

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="type"
            name="type"
            value={value}
            onChange={handleChange}
            style={{ display: "inline-block", padding: "4px 15px" }}
          >
            <FormControlLabel value="Veg" control={<Radio />} label="Veg" />
            <FormControlLabel
              value="Non-Veg"
              control={<Radio />}
              label="Non-Veg"
            />
          </RadioGroup>
        </FormControl>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Apply
          </Button>
        </div>
      </Menu>
    </Container>
  );
}
