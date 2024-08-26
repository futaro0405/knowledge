import { memo } from 'react';
import '../../style/atoms/button/Button.scss'

export const Button = memo(({ children, ...props }) => {
    return (
        <button {...props}>{children}</button>
    );
})