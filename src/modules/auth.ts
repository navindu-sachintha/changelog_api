import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

export const hashPassword = (password) => {
    return bcrypt.hash(password, 10);
}

export const createJWT = (user) => {
    const token = jwt.sign(
        {
            id:user.id, 
            username:user.username
        },
        process.env.JWT_SECRET
    );
    return token;
}

export const protect = (req,res, next) => {
    const bearer = req.headers.authorization;

    if(!bearer){
        res.status(401);
        res.json({messege: "Not authorized"})
        return
    }

    const [,token] = bearer.split(' ');

    if(!token){
        res.status(401);
        res.json({messege: "Not authorized"})
        return
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (err) {
        console.error(err);
        res.status(401);
        res.json({messege: "Not a valid token"})
        return
    }
}