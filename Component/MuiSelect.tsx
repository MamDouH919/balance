import React, { memo } from "react";
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    useTheme,
    SelectChangeEvent,
    TextFieldProps,
} from "@mui/material";
import { useController, FieldError } from "react-hook-form";

interface MUIselectProps extends Omit<TextFieldProps, 'name' | 'control'> {
    control: any;
    data: { value: string | number; key: string }[];
    name: string;
    disabled?: boolean;
    margin?: "none" | "dense" | "normal";
    label: string;
    onChanges?: (event: SelectChangeEvent<string | number>) => void;
    rules?: any; // You can type this more strictly based on your validation rules
    readOnly?: boolean;
    defaultValue?: string | number;
}

const MUIselect: React.FC<MUIselectProps> = (props) => {
    const {
        control,
        data,
        name,
        disabled = false,
        margin = "none",
        label,
        onChanges,
        rules,
        readOnly = false,
        defaultValue,
    } = props;

    const theme = useTheme();
    const dir = theme.direction;

    const {
        formState: { errors },
        field: { ref, value: val, onChange: fieldChange, ...fieldProps },
    } = useController({
        name,
        control,
        rules: { ...rules },
        defaultValue: data && defaultValue ? defaultValue : "",
    });

    const errorName = name.includes(".") && name.split(".");
    const fieldError: FieldError | undefined = errorName
        ? (errors?.[errorName[0]] as any)?.[errorName[1]]
        : (errors?.[name] as FieldError | undefined);

    const isRequired = (rules && rules.required) || (rules && rules.validate);

    return (
        <FormControl margin={margin} fullWidth size="small">
            <InputLabel id={name}>{isRequired ? label + " *" : label}</InputLabel>

            <Select
                {...fieldProps}
                variant="outlined"
                inputProps={{
                    readOnly: readOnly,
                }}
                label={label}
                inputRef={ref}
                error={Boolean(fieldError)}
                value={val}
                defaultValue={data && defaultValue ? defaultValue : ""}
                disabled={disabled}
                onChange={(e) => {
                    fieldChange(e.target.value);
                    onChanges && onChanges(e);
                }}
            >
                {data && (
                    <MenuItem value="">
                        <br />
                    </MenuItem>
                )}
                {data?.map((items, index) => (
                    <MenuItem key={index} value={items.value} dir={dir}>
                        {items.key}
                    </MenuItem>
                ))}
            </Select>

            {fieldError?.message && (
                <FormHelperText error>{fieldError.message}</FormHelperText>
            )}
        </FormControl>
    );
};

export default memo(MUIselect);
