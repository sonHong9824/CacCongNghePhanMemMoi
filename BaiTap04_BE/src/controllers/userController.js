const {createUserService, loginService, getUserService} = require('../services/userService');

const createUser = async (req, res) => {
    const {email, name, password} = req.body;
    const data = await createUserService(email, name, password);
    return res.status(200).json(data);
}
const handleLogin = async (req, res) => {
    const {email, password} = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data);
}
const getUser = async (req, res) => {
    const users = await getUserService();
    return res.status(200).json(users);
}
const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
}
module.exports = {
    createUser,
    handleLogin,
    getUser,
    getAccount
}