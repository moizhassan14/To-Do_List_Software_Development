export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
      try {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
          return res.status(403).json({ error: "Forbidden: Insufficient role" });
        }
        next();
      } catch (error) {
        res.status(500).json({ error: "Role authorization failed" });
      }
    };
  };
  