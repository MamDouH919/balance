import React, { ChangeEvent } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useController, FieldError } from "react-hook-form";
// import { useTranslation } from "react-i18next";

interface ControlMUITextFieldProps extends Omit<TextFieldProps, 'name' | 'control'> {
  name: string;
  control: any;
  defaultValue?: any;
  readOnly?: boolean;
  rules?: {
    required?: boolean | string;
    validate?: {
      whiteSpace?: (value: string) => boolean | string;
      [key: string]: ((value: any) => boolean | string) | undefined;
    };
  };
  label?: string
  serverValidation?: Record<string, string[]>;
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ControlMUITextField: React.FC<ControlMUITextFieldProps> = (props) => {
  const {
    name,
    control,
    defaultValue,
    readOnly,
    inputProps,
    rules,
    onChange,
    variant,
    size,
    serverValidation,
    label,
    ...restProps
  } = props;

  // const { t } = useTranslation();

  const {
    formState: { errors },
    field: { ref, onChange: fieldChange, ...fieldProps },
  } = useController({
    name,
    control,
    rules: {
      ...rules,
      validate: {
        whiteSpace: (value: string) => {
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
    ? (errors?.[errorName[0]] as Record<string, FieldError | undefined>)?.[errorName[1]]
    : (errors?.[name] as FieldError);

  const isRequired =
    rules?.required ||
    (rules?.validate?.max && typeof rules?.validate?.max === "function") ||
    (rules?.validate?.require && typeof rules?.validate?.require === "function");

  return (
    <TextField
      inputRef={ref}
      {...fieldProps}
      {...restProps}
      label={isRequired ? `${label} *` : label}
      defaultValue={defaultValue}
      autoComplete="off"
      id={name}
      variant={variant || "outlined"}
      fullWidth
      multiline={!!props.rows}
      error={Boolean(fieldError || serverValidation?.[serverError])}
      helperText={
        fieldError?.message ||
        (serverValidation && serverValidation?.[serverError]?.[0]) ||
        null
      }
      inputProps={{
        readOnly: readOnly,
        ...inputProps,
      }}
      onChange={(e) => {
        fieldChange(e);
        onChange && onChange(e);
      }}
      size={size ?? "small"}
    />
  );
};

export default ControlMUITextField;
