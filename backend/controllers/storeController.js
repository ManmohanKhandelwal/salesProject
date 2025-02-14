import mySqlPool from "../config/db.js";

export const getStoreById = async(req,res) => {
    const { Old_Store_Code } = req.query;  

    if (!Old_Store_Code) {
        return res.status(400).json({ error: 'Old_Store_Code is required' });
    }

    try {
        const [rows] = await mySqlPool.query('SELECT * FROM store_mapping WHERE Old_Store_Code LIKE ? LIMIT ?', [`%${Old_Store_Code}%`,5]);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getStores = async(req,res) => {
    try {
        const [rows] = await mySqlPool.query('SELECT * FROM store_mapping LIMIT 10');
        console.log(rows)
        res.json(rows);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

