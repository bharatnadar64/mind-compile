import express from "express"
import { runCode } from "../controllers/codeController.js"

const codeRouter = express.Router()

codeRouter.get('/', (req, res) => {
    res.send("Code router working")
    console.log("done")
})
codeRouter.post('/run', runCode)

export default codeRouter