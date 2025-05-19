// parrots.js
// 16th may 2025
// lohikrme

const db = require('./dbconfig.js')


// CREATE parrot
const addNewParrot = async (req, res) => {
    try {
        const newParrot = req.body;
        let insertResult;
        // check new parrot has all required fields
        if (!newParrot.species || !newParrot.name || !newParrot.age || !newParrot.favorite_food) {
            return res.status(400).json({ error: "species, name, age and favorite_food are required..."})
        }
        if (!newParrot.illness) {
            [insertResult] = await db.query(
            "INSERT INTO Parrots (species, name, age, favorite_food) VALUES (?, ?, ?, ?)",
            [newParrot.species, newParrot.name, newParrot.age, newParrot.favorite_food]
            )
        }
        else {
            [insertResult] = await db.query(
            "INSERT INTO Parrots (species, name, age, illness, favorite_food)" +
            "VALUES (?, ?, ?, ?, ?)",
            [   newParrot.species, 
                newParrot.name, 
                newParrot.age, 
                newParrot.illness, 
                newParrot.favorite_food
            ]
            )
        }

        // return info of new parrot
        const addedParrot = await db.query("SELECT * FROM Parrots WHERE id = ?", 
            [insertResult.insertId])
        res.status(201).json({addedParrot})
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error"})
    }
}

// READ all parrots
const getAllParrots = async (req, res) => {
    try {
        const [parrots] = await db.query("SELECT * FROM Parrots")
        res.json({parrots})
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error"})
    }
}

// READ parrot by id
const getParrotById = async (req, res) => {
    try {
        const [parrot] = await db.query("SELECT * FROM Parrots WHERE id = ?",
            [req.params.id])
        if (parrot.length > 0) {
        res.status(200).json({parrot})
        }
        else {
            res.status(404).json({ message: `Parrot with id ${req.params.id} was not found!`})
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error"})
    }
}

// UPDATE parrot by id
const updateParrot = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM Parrots WHERE id = ?", [req.params.id]);

        if (rows.length < 1) {
            return res.status(404).json({ error: `Parrot with id ${req.params.id} was not found!` });
        }

        const newInfo = req.body;
        let updateFields = [];
        let updateValues = [];

        if (newInfo.species) {
            updateFields.push("species = ?");
            updateValues.push(newInfo.species);
        }
        if (newInfo.name) {
            updateFields.push("name = ?");
            updateValues.push(newInfo.name);
        }
        if (newInfo.age) {
            updateFields.push("age = ?");
            updateValues.push(newInfo.age);
        }
        if (newInfo.illness) {
            updateFields.push("illness = ?");
            updateValues.push(newInfo.illness);
        }
        if (newInfo.favorite_food) {
            updateFields.push("favorite_food = ?");
            updateValues.push(newInfo.favorite_food);
        }

        if (updateFields.length === 0) {
            return res.status(422).json({
                error: 'Must have at least one of these to update: species, name, age, illness, favorite_food'
            });
        }

        // add id as the last parameter, because needed for WHERE
        updateValues.push(req.params.id);
        const updateSentence = `UPDATE Parrots SET ${updateFields.join(', ')} WHERE id = ?`;

        await db.query(updateSentence, updateValues);

        const updatedParrot = await db.query("SELECT * FROM Parrots WHERE id = ?", 
            [req.params.id])

        res.status(200).json({ message: `Parrot with id ${req.params.id} updated successfully.`, updatedParrot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// DELETE parrot by id
const deleteParrot = async (req, res) => {
    try {
        const [deletedParrot] = await db.query("SELECT * FROM Parrots WHERE id = ?",
            [req.params.id]
        )
        if (deletedParrot.length < 1) {
            res.status(404).json({ message: `Parrot with id ${req.params.id} was not found!`})
        }
        else {
            await db.query("DELETE FROM Parrots WHERE id = ?", [req.params.id])
            return res.json({message: `Deleting the parrot with id ${req.params.id} was successful!` , deletedParrot})
        }
        
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error"})
    }
}


module.exports = {
    addNewParrot,
    getAllParrots,
    getParrotById,
    updateParrot,
    deleteParrot
}