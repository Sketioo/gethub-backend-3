const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateLinkedinAuthorization, processLinkedinRedirect } = require('../helpers/linkedin-auth');
async function signUp(req, res){
    try {
        const result = await models.User.findOne({where: {email: req.body.email}});
        if (result) {
            return res.status(409).json({ message: "Email already exists!" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        
        const user = {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: hash
        };

        await models.User.create(user);
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
}

async function login(req, res){
    try {
        const user = await models.User.findOne({where: {email: req.body.email}});
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const result = await bcryptjs.compare(req.body.password, user.password);
        if (result) {
            const token = jwt.sign({
                email: user.email,
                userId: user.id
            }, process.env.JWT_KEY);
            return res.status(200).json({ message: "Authentication successful!", token: token });
        } else {
            return res.status(401).json({ message: "Invalid credentials!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
}

async function linkedinAuthorization(req, res) {
    res.redirect(generateLinkedinAuthorization());
}

async function linkedinRedirect(req, res) {
    const code = req.query.code;
    return res.json(processLinkedinRedirect(code));
}



module.exports = {
    signUp: signUp,
    login: login,
    linkedinAuthorization: linkedinAuthorization,
    linkedinRedirect: linkedinRedirect
} 