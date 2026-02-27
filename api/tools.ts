export default async function handler(req, res) {
    try {
        res.status(200).json({
            message: "Tools API working"
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}