const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://sibandatafadzwa6_db_user:Mongo2026@cluster0.a9ltzxv.mongodb.net/byu_project?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true
});

async function run() {
  try {
    await client.connect();

    console.log("Connected to MongoDB ✅");

    const db = client.db("byu_project");

    const collection = db.collection("students");

    const result = await collection.insertOne({
      name: "Tafadzwa",
      school: "BYU Pathway"
    });

    console.log("Data inserted ✅");
    console.log(result);

  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    await client.close();
  }
}

run();