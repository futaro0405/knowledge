import { memo } from "react";

import '../../style/atoms/input/InputField.scss'

export const InputField = memo(({ ...props }) => {
    return (
        <input {...props} />
    );
})