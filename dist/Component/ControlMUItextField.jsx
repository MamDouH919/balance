import React from "react";
import { TextField } from "@mui/material";
import { useController } from "react-hook-form";
const ControlMUITextField = (props) => {
    const { name, control, defaultValue, readOnly, inputProps, rules, onChange, variant, size, serverValidation, label, ...restProps } = props;
    // const { t } = useTranslation();
    const { formState: { errors }, field: { ref, onChange: fieldChange, ...fieldProps }, } = useController({
        name,
        control,
        rules: {
            ...rules,
            validate: {
                whiteSpace: (value) => {
                    if (value && typeof value === "string") {
                        return !!value.trim() || "هذا الحقل مطلوب";
                    }
                    return true;
                },
                ...(rules?.validate ?? {}),
            },
        },
        defaultValue: defaultValue ?? "",
    });
    const errorName = name.includes(".") && name.split(".");
    const serverError = errorName ? errorName[1] : name;
    const fieldError = errorName
        ? errors?.[errorName[0]]?.[errorName[1]]
        : errors?.[name];
    const isRequired = rules?.required ||
        (rules?.validate?.max && typeof rules?.validate?.max === "function") ||
        (rules?.validate?.require && typeof rules?.validate?.require === "function");
    return (<TextField inputRef={ref} {...fieldProps} {...restProps} label={isRequired ? `${label} *` : label} defaultValue={defaultValue} autoComplete="off" id={name} variant={variant || "outlined"} fullWidth multiline={!!props.rows} error={Boolean(fieldError || serverValidation?.[serverError])} helperText={fieldError?.message ||
            (serverValidation && serverValidation?.[serverError]?.[0]) ||
            null} inputProps={{
            readOnly: readOnly,
            ...inputProps,
        }} onChange={(e) => {
            fieldChange(e);
            onChange && onChange(e);
        }} size={size ?? "small"}/>);
};
export default ControlMUITextField;
