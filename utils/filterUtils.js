export const buildFilterConditions = (filters) => {
    const conditions = [`updated = 'yes'`];
    const params = [];

    if (filters.name) {
        conditions.push('LOWER(industry) LIKE ?');
        params.push(`%${filters.name.toLowerCase()}%`);
    }
    if (filters.location) {
        conditions.push('LOWER(location) LIKE ?');
        params.push(`%${filters.location.toLowerCase()}%`);
    }
    if (filters.communication_status) {
        conditions.push('communication_status = ?');
        params.push(filters.communication_status);
    }
    if (filters.lead_status) {
        conditions.push('lead_status = ?');
        params.push(filters.lead_status);
    }
    if (filters.bd_name) {
        conditions.push('LOWER(bd_name) LIKE ?');
        params.push(`%${filters.bd_name.toLowerCase()}%`);
    }
    if (filters.state) {
        conditions.push('LOWER(state) LIKE ?');
        params.push(`%${filters.state.toLowerCase()}%`);
    }

    let whereClause = '';
    if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    return { whereClause, params };
};
