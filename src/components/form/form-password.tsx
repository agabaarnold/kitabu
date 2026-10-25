import { Link } from "@tanstack/react-router";

import { useFieldContext } from "#/hooks/use-form-context.ts";

import { PasswordInput } from "../shared/password-input";
import { Field, FieldError, FieldLabel } from "../ui/field";

interface FormPasswordProps {
	label: string;
	placeholder: string;
	isLogin: boolean;
	autoComplete?: React.ComponentProps<"input">["autoComplete"];
}

export const FormPassword = ({
	isLogin,
	label,
	placeholder,
	autoComplete,
}: FormPasswordProps) => {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field data-invalid={isInvalid}>
			<div className="flex items-center justify-between">
				<FieldLabel htmlFor={field.name}>{label}</FieldLabel>

				{isLogin && (
					<Link className="hover:underline-offset-2" to="/forgot-password">
						Forgot your password?
					</Link>
				)}
			</div>

			<PasswordInput
				aria-invalid={isInvalid}
				autoComplete={autoComplete}
				id={field.name}
				name={field.name}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				placeholder={placeholder}
				value={field.state.value}
			/>

			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
};
