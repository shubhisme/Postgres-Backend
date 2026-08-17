import app from "./app.ts";
import config from "./config/config.ts";
import {db} from "./lib/db.ts";

const PORT = Number(config.PORT);

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

async function shutdown(signal : string){
  console.log(`${signal} received. Starting graceful shutdown...`);

  server.close(async()=>{
    try{
        await db.$disconnect();

      console.log("Database connection closed");
      console.log("HTTP server closed");
      
      process.exit(0);
    }catch(err){
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  })
}


process.on("SIGTERM" , ()=>{
    void shutdown("SIGTERM");
})

process.on("SIGINT" , ()=>{
    void shutdown("SIGINT");
})