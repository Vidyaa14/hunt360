export const ensureLoggedIn = (req, res, next) => {
    console.log('Session data:', req.session);
    if (req.session && req.session.orgEmail && req.session.orgName) {
        next();
    } else {
        res.status(401).json({ success: false, error: "Organization not logged in." });
    }
};