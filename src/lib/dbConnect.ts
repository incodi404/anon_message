import mongoose from "mongoose"

type ConnetionObject = {
    isConnected?: number
}

const connection : ConnetionObject = {}

async function dbConnection(): Promise<void> {
    if(connection.isConnected) {
        console.log("Database is already connected");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        console.log(db);

        connection.isConnected = db.connections[0].readyState

        console.log("DB is connected");
    } catch (error) {
        console.log("DB is not connected ", error);
        process.exit(1)
    }
}

export {dbConnection}

