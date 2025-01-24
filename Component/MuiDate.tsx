import {
    FormControl,
    FormHelperText,
    IconButton,
    Stack,
} from "@mui/material";
import { useController, Control } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Clear } from "@mui/icons-material";

interface MUIDateProps {
    control: Control<any>;
    disabled?: boolean;
    name: string;
    label?: string;
    rules?: Record<string, any>;
    defaultValue?: Date | null;
    variant?: "filled" | "outlined" | "standard";
    onChange?: (value: Date | null) => void;
    value?: Date | null;
    InputProps?: Record<string, any>;
    [key: string]: any;
    disablePast?: boolean
}

const MUIDate: React.FC<MUIDateProps> = ({
    control,
    disabled,
    name,
    label,
    rules,
    defaultValue,
    onChange,
    value,
    disablePast,
    ...restProps
}) => {
    const {
        formState: { errors },
        field: { value: fieldValue, onChange: fieldChange, },
    } = useController({
        name,
        control,
        rules: { ...rules },
        defaultValue: defaultValue ?? null,
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} >
            <FormControl variant="filled" fullWidth size="small">
                <DatePicker
                    {...restProps}
                    label={label}
                    value={value || fieldValue}
                    format="dd/MM/yyyy" // Adjusted to `format` in v6
                    onChange={(newValue) => {
                        fieldChange(newValue);
                        onChange && onChange(newValue);
                    }}
                    disabled={disabled}
                    disablePast={disablePast ?? false}
                    slotProps={{
                        textField: {
                            InputProps: {
                                startAdornment: (
                                    <Stack direction="row" pr={1} alignItems="center">
                                        {/* Clear button */}
                                        <IconButton
                                            size="small"
                                            onClick={() => fieldChange(null)}
                                            aria-label="clear"
                                        >
                                            <Clear fontSize="inherit" />
                                        </IconButton>
                                        {/* Default calendar button */}
                                    </Stack>
                                ),
                            }
                        },
                    }}
                />
                {errors[name] && (
                    <FormHelperText error>
                        {errors[name]?.message as string}
                    </FormHelperText>
                )}
            </FormControl>
        </LocalizationProvider>
    );
};

export default MUIDate;
