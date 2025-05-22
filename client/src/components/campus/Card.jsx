import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Card = ({
    children,
    width = 'w-full',
    height = 'h-auto',
    className = '',
    shadow = 'shadow-md',
    padding = 'p-4',
    radius = 'rounded-2xl',
    role = 'region',
}) => {
    const validTailwindClasses = (value, prefix) =>
        value.startsWith(prefix) || value === 'auto' || /^[0-9]+(px|rem|%)$/.test(value);

    const widthClass = validTailwindClasses(width, 'w-') ? width : 'w-full';
    const heightClass = validTailwindClasses(height, 'h-') ? height : 'h-auto';

    return (
        <div
            className={`bg-white ${shadow} ${radius} ${padding} transition-all duration-300 ${widthClass} ${heightClass} ${className}`}
            role={role}
        >
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string,
    shadow: PropTypes.string,
    padding: PropTypes.string,
    radius: PropTypes.string,
    role: PropTypes.string,
};

export default memo(Card);