import { useState, useDebugValue } from "react";

// debugger to display the states name on the browser component viewer
export default function useStateWithLabel(initialValue, name) {
	const [value, setValue] = useState(initialValue);
	useDebugValue(`${name}: ${value}`);
	return [value, setValue];
}
