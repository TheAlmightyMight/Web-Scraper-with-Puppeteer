import { MongoClient, ServerApiVersion } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

export default class DataBase {
  async connectAndCompare(results) {
    let client;
    try {
      client = new MongoClient(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
      });
      await client.connect();
      const db = client.db("parsers");
      const collection = db.collection("vacancies");
      const cursor = collection.find({});
      const arr = await cursor.toArray();
      const newVacancies = [];
      if (arr.length === 0) {
        await collection.insertMany(results);
        return {
          difference: 0,
          newVacancies: newVacancies,
        };
      } else {
        arr.forEach((el) => {
          const item = results.find((res) => res.title === el.title);
          if (!item) {
            newVacancies.push(el);
          }
        });
        await collection.deleteMany({});
        await collection.insertMany(results);
      }
      return {
        difference: arr.length - results.length,
        newVacancies: newVacancies,
      };
    } catch (err) {
      console.error(err.message, err.cause);
    } finally {
      await client.close();
    }
  }
}
