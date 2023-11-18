const authenticateAdmin = (req, res, next) => {
    try {
        // Assuming the user role is stored in req.user.role
        if (req.user && req.user.role === 'admin') {
            //user verified as admin so proceed!
            next();
        } else {
            //user is not admin
            res.status(403).send('Permission denied. Admin access required.'); //403=forbidden
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An Internal Server Error occurred');
    }
};

module.exports = authenticateAdmin;
