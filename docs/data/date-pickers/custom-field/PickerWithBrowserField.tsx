import * as React from 'react';
import { Dayjs } from 'dayjs';
import { useSlotProps } from '@mui/base/utils';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import {
  unstable_useDateField as useDateField,
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';
import {
  BaseMultiInputFieldProps,
  DateRange,
  DateRangeValidationError,
  UseDateRangeFieldProps,
  MultiInputFieldSlotTextFieldProps,
  BaseSingleInputFieldProps,
  DateValidationError,
  RangeFieldSection,
  FieldSection,
} from '@mui/x-date-pickers-pro';

interface BrowserFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
  error?: boolean;
  focused?: boolean;
  ownerState?: any;
}

type BrowserFieldComponent = ((
  props: BrowserFieldProps & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const BrowserField = React.forwardRef(
  (props: BrowserFieldProps, inputRef: React.Ref<HTMLInputElement>) => {
    const {
      disabled,
      id,
      label,
      InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
      // extracting `error`, 'focused', and `ownerState` as `input` does not support those props
      error,
      focused,
      ownerState,
      ...other
    } = props;

    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
        id={id}
        ref={containerRef}
      >
        {startAdornment}
        <input disabled={disabled} ref={inputRef} {...other} />
        {endAdornment}
      </Box>
    );
  },
) as BrowserFieldComponent;

interface BrowserMultiInputDateRangeFieldProps
  extends UseDateRangeFieldProps<Dayjs>,
    BaseMultiInputFieldProps<
      DateRange<Dayjs>,
      RangeFieldSection,
      DateRangeValidationError
    > {}

type BrowserMultiInputDateRangeFieldComponent = ((
  props: BrowserMultiInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const BrowserMultiInputDateRangeField = React.forwardRef(
  (props: BrowserMultiInputDateRangeFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      slotProps,
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      disabled,
      onError,
      shouldDisableDate,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      selectedSections,
      onSelectedSectionsChange,
      className,
    } = props;

    const { inputRef: startInputRef, ...startTextFieldProps } = useSlotProps({
      elementType: null as any,
      externalSlotProps: slotProps?.textField,
      ownerState: { ...props, position: 'start' },
    }) as MultiInputFieldSlotTextFieldProps;

    const { inputRef: endInputRef, ...endTextFieldProps } = useSlotProps({
      elementType: null as any,
      externalSlotProps: slotProps?.textField,
      ownerState: { ...props, position: 'end' },
    }) as MultiInputFieldSlotTextFieldProps;

    const { startDate, endDate } = useMultiInputDateRangeField<
      Dayjs,
      MultiInputFieldSlotTextFieldProps
    >({
      sharedProps: {
        value,
        defaultValue,
        format,
        onChange,
        readOnly,
        disabled,
        onError,
        shouldDisableDate,
        minDate,
        maxDate,
        disableFuture,
        disablePast,
        selectedSections,
        onSelectedSectionsChange,
      },
      startTextFieldProps,
      endTextFieldProps,
      startInputRef,
      endInputRef,
    });

    return (
      <Stack ref={ref} spacing={2} direction="row" className={className}>
        <BrowserField {...startDate} />
        <span> — </span>
        <BrowserField {...endDate} />
      </Stack>
    );
  },
) as BrowserMultiInputDateRangeFieldComponent;

function BrowserDateRangePicker(props: DateRangePickerProps<Dayjs>) {
  return (
    <DateRangePicker slots={{ field: BrowserMultiInputDateRangeField }} {...props} />
  );
}

interface BrowserDateFieldProps
  extends UseDateFieldProps<Dayjs>,
    BaseSingleInputFieldProps<Dayjs | null, FieldSection, DateValidationError> {}

function BrowserDateField(props: BrowserDateFieldProps) {
  const { inputRef: externalInputRef, slots, slotProps, ...textFieldProps } = props;

  const response = useDateField<Dayjs, typeof textFieldProps>({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  return <BrowserField {...response} />;
}

function BrowserDatePicker(props: DatePickerProps<Dayjs>) {
  return (
    <DatePicker slots={{ field: BrowserDateField, ...props.slots }} {...props} />
  );
}

export default function PickerWithBrowserField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DateRangePicker']}>
        <BrowserDatePicker />
        <BrowserDateRangePicker />
      </DemoContainer>
    </LocalizationProvider>
  );
}