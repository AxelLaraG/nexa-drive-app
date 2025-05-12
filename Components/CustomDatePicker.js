import React from 'react';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CustomDatePicker = ({ value, onChange }) => {
  return (
    <DateTimePicker
      value={value}
      mode="date"
      display="default"
      onChange={onChange}
    />
  );
};

export default CustomDatePicker;
