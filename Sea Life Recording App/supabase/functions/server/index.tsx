import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-aee6fb1a/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all marine records
app.get("/make-server-aee6fb1a/records", async (c) => {
  try {
    const records = await kv.getByPrefix("record:");
    return c.json({ records });
  } catch (error) {
    console.log("Error fetching records:", error);
    return c.json({ error: "Failed to fetch records", details: String(error) }, 500);
  }
});

// Get a single record by ID
app.get("/make-server-aee6fb1a/records/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const record = await kv.get(`record:${id}`);
    
    if (!record) {
      return c.json({ error: "Record not found" }, 404);
    }
    
    return c.json({ record });
  } catch (error) {
    console.log("Error fetching record:", error);
    return c.json({ error: "Failed to fetch record", details: String(error) }, 500);
  }
});

// Create a new record
app.post("/make-server-aee6fb1a/records", async (c) => {
  try {
    const body = await c.req.json();
    const { species, category, location, date, time, description, imageUrl, observerName } = body;
    
    // Validate required fields
    if (!species || !category || !location || !description || !observerName) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const id = Date.now().toString();
    const record = {
      id,
      species,
      category,
      location,
      date: date || new Date().toISOString().split("T")[0],
      time: time || new Date().toTimeString().split(" ")[0].slice(0, 5),
      description,
      imageUrl: imageUrl || "",
      observerName,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`record:${id}`, record);
    
    return c.json({ record }, 201);
  } catch (error) {
    console.log("Error creating record:", error);
    return c.json({ error: "Failed to create record", details: String(error) }, 500);
  }
});

// Delete a record
app.delete("/make-server-aee6fb1a/records/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const record = await kv.get(`record:${id}`);
    
    if (!record) {
      return c.json({ error: "Record not found" }, 404);
    }
    
    await kv.del(`record:${id}`);
    
    return c.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.log("Error deleting record:", error);
    return c.json({ error: "Failed to delete record", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);