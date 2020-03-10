import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';


function DatePickerDemo(props) {
  const [selectedDate, handleDateChange] = useState(new Date(props.startDate));

  const [selectedDate2, handleDateChange2] = useState(new Date(props.dueDate));

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        autoOk
        margin="dense"
        variant="inline"
        inputVariant="outlined"
        label="Start Date"
        name="startDate"
        format="MM/dd/yyyy"
        value={selectedDate}
        InputAdornmentProps={{ position: "end" }}
        onChange={date => handleDateChange(date)}
      />
      <KeyboardDatePicker
        autoOk
        margin="dense"
        variant="inline"
        inputVariant="outlined"
        label="Due Date"
        name="dueDate"
        format="MM/dd/yyyy"
        value={selectedDate2}
        InputAdornmentProps={{ position: "end" }}
        onChange={date => handleDateChange2(date)}
      />
    </MuiPickersUtilsProvider>
  );
}

export default DatePickerDemo;