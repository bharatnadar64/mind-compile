// @ts-nocheck
// services/codeService.js
import axios from "axios";

export const executeCode = async (code, language, input) => {
    try {
        const response = await axios.post(
            "https://api.onlinecompiler.io/api/run-code-sync/",
            {
                compiler: language, // e.g. "python-3.14"
                code: code,
                input: input || ""
            },
            {
                headers: {
                    "Authorization": process.env.COMPILER_KEY, // 🔐 IMPORTANT
                    "Content-Type": "application/json"
                }
            }
        );

        return {
            output: response.data.output,
            status: response.data.status,
            error: null
        };

    } catch (err) {
        console.log("ERROR DETAILS:", err.response?.data);

        return {
            output: null,
            status: "error",
            error: err.response?.data || err.message
        };
    }
};