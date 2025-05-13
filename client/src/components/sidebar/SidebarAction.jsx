import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SidebarAction = ({ to, children, icon: Icon, isCollapsed }) => (
    <Link
        to={to}
        className={`flex items-center justify-center gap-2 bg-[#ff4d4d] text-white font-bold text-base rounded-lg shadow-md hover:bg-[#c82333] focus:ring-2 focus:ring-[#ff4d4d] focus:ring-opacity-50 active:scale-95 transition-all duration-300 ${
            isCollapsed ? 'p-3 mt-auto' : 'py-3 px-6 mt-auto'
        }`}
        aria-label={children}
    >
        {Icon && <Icon className="w-5 h-5" />}
        {!isCollapsed && <span className="truncate">{children}</span>}
    </Link>
);

SidebarAction.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    icon: PropTypes.elementType,
    isCollapsed: PropTypes.bool,
};

SidebarAction.defaultProps = {
    isCollapsed: false,
};

export default SidebarAction;
