import {
    FormControl,
    TextField,
} from "@mui/material";
import { useController, Control } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS } from "date-fns/locale";

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
    disablePast?: boolean;
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
        field: { value: fieldValue, onChange: fieldChange },
    } = useController({
        name,
        control,
        rules: { ...rules },
        defaultValue: defaultValue ?? null,
    });

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={enUS} // Set locale for formatting
        >
            <FormControl variant="filled" fullWidth size="small">
                <DatePicker
                    {...restProps}
                    label={label}
                    value={value || fieldValue}
                    onChange={(newValue) => {
                        fieldChange(newValue);
                        onChange && onChange(newValue);
                    }}
                    disabled={disabled}
                    disablePast={disablePast ?? false}
                    
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            error={!!errors[name]}
                            helperText={errors[name]?.message as string}
                        />
                    )}
                />
            </FormControl>
        </LocalizationProvider>
    );
};

export default MUIDate;
