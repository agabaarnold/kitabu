import { useFieldContext } from "#/hooks/use-form-context.ts";

import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";

interface FormCheckboxProps {
	label: string;
}

export const FormCheckbox = ({ label }: FormCheckboxProps) => {
	const field = useFieldContext<boolean>();

	return (
		<Field orientation="horizontal">
			<Checkbox
				id={field.name}
				name={field.name}
				checked={field.state.value}
				onCheckedChange={(checked) => field.handleChange(checked)}
			/>

			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
		</Field>
	);
};
