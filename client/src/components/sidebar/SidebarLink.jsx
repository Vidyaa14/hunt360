import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const SidebarLink = ({ to, children, isCollapsed, icon: Icon }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center px-3 py-2 text-base text-white rounded-md transition-all duration-300 ${
                isActive
                    ? 'bg-[#432c65] border-l-4 border-[#ff4d4d]'
                    : 'bg-white/10 hover:bg-white/20 hover:scale-[1.02]'
            } ${isCollapsed ? 'justify-center' : 'gap-2'}`}
            aria-label={children}
        >
            {Icon && (
                <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
            )}
            {!isCollapsed && <span className="truncate">{children}</span>}
        </Link>
    );
};

SidebarLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    isCollapsed: PropTypes.bool,
    icon: PropTypes.elementType,
};

SidebarLink.defaultProps = {
    isCollapsed: false,
};

export default SidebarLink;
