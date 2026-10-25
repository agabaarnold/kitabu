import { useFieldContext } from "#/hooks/use-form-context.ts";

import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface FormInputProps {
	label: string;
	placeholder: string;
	type: React.ComponentProps<"input">["type"];
	autoComplete?: React.ComponentProps<"input">["autoComplete"];
}

export const FormInput = ({
	label,
	placeholder,
	type,
	autoComplete,
}: FormInputProps) => {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>

			<Input
				aria-invalid={isInvalid}
				autoComplete={autoComplete}
				id={field.name}
				name={field.name}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				placeholder={placeholder}
				type={type}
				value={field.state.value}
			/>

			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
};
