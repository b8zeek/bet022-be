import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')

    if (!token) return res.json({ error: 'Access denied!' })

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)

        req.user = verified

        next()
    } catch (error) {
        res.json({ error: 'Token isn\'t valid!' })
    }
}

export const isAdmin = async (req, res, next) => {
    if (!req.user.isAdmin) return res.send({ message: 'Not an admin!' })

    next()
}
