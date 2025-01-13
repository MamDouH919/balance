import React, { JSX, useEffect, useState } from "react";
import { FormControlLabel, Switch, Typography, FormHelperText, FormControl } from "@mui/material";
import { useController, FieldValues, Control, Path } from "react-hook-form";

// Define the props interface extending both FormControlLabel and Switch props
interface MuiSwitchProps<T extends FieldValues> {
    control: Control<T>; // React Hook Form control
    name: Path<T>; // Name of the field in the form, constrained by Path<T>
    label: string; // Label for the switch
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange callback
    [key: string]: any; // Allow other props to be passed through, like sx or className
}

const MuiSwitch = <T extends FieldValues>({
    control,
    name,
    label,
    onChange,
    ...restProps
}: MuiSwitchProps<T>): JSX.Element => {
    // Using React Hook Form's useController to manage the form state
    const {
        formState: { errors },
        field: { onChange: checkboxChange, value },
    } = useController({
        name,
        control,
        defaultValue: false as any,
    });

    // Extract errors if the name has a dot notation (for nested fields)
    const errorName = name.includes(".") ? name.split(".") : null;
    const fieldError = errorName
        ? (errors?.[errorName[0]] as Record<string, any>)?.[errorName[1]]
        : errors?.[name as keyof typeof errors];

    // Local state to manage the checked status of the switch
    const [checkState, setCheckState] = useState<boolean>(value);

    useEffect(() => {
        setCheckState(value);
    }, [value]);

    return (
        <FormControl component="fieldset" variant="standard">
            <FormControlLabel
                checked={checkState} // Set the checked state based on form control
                control={<Switch {...restProps} />} // Pass the restProps including edge to Switch
                label={
                    <Typography variant="body2" color="text.primary" px={1}>
                        {label}
                    </Typography>
                }
                labelPlacement="end"
                onChange={(_, checked: boolean) => {
                    setCheckState(checked);
                    checkboxChange(checked); // Update the form value with react-hook-form
                    if (onChange) {
                        onChange({
                            target: { checked } as HTMLInputElement,
                        } as React.ChangeEvent<HTMLInputElement>);
                    }
                }}
                sx={{ m: 0 }}
            />
            {fieldError && (
                <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>
                    {fieldError?.message}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default MuiSwitch;
