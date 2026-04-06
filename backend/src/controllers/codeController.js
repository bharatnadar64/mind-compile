// @ts-nocheck
// controllers/runController.js
import { executeCode } from "../services/codeService.js";

export const runCode = async (req, res) => {
    try {
        const { code, language, input } = req.body;

        if (!code || !language) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const result = await executeCode(code, language, input);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const testCode = async (req, res) => {
    try {

    } catch (error) {

    }

}