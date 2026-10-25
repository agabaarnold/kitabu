import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState, type ComponentProps } from "react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../ui/input-group";

type PasswordInputProps = ComponentProps<"input">;

export const PasswordInput = ({ ...props }: PasswordInputProps) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<InputGroup>
			<InputGroupInput {...props} type={showPassword ? "text" : "password"} />

			<InputGroupAddon align="inline-end">
				<InputGroupButton
					onClick={() => setShowPassword((prev) => !prev)}
					size="icon-xs"
                    type="button"
				>
					{showPassword ? <IconEyeOff /> : <IconEye />}
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
};
