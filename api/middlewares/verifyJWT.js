export default function verifyJWT(req, res, next) {
    return res.status(400).json("invalid user");
    next();
}
