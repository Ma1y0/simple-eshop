import { Router } from "express";
import { db } from "../db";
import { inventory } from "../db/schema";
import { count as countFn, eq, like } from "drizzle-orm";

const router = Router();

// Add LIMITS, offsets and error handling
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const inventoryItems = await db
      .select()
      .from(inventory)
      .limit(limit)
      .offset(offset);

    // Count total items for pagination info
    const [{ count }] = await db.select({ count: countFn() }).from(inventory);

    res.json({
      message: "Successfully queried the inventory",
      data: inventoryItems,
      pagination: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({
      message: "Failed to retrieve inventory items",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const [item] = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, id));

    if (!item) {
      res
        .status(404)
        .json({ message: `Inventory item with ID ${id} not found` });
      return;
    }

    res.json({
      message: "Successfully retrieved inventory item",
      data: item,
    });
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    res.status(500).json({
      message: "Failed to retrieve inventory item",
      error: error.message,
    });
  }
});

router.get("/search/:query", async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const searchPattern = `%${searchQuery}%`;

    const results = await db
      .select()
      .from(inventory)
      .where(like(inventory.name, searchPattern))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: countFn() })
      .from(inventory)
      .where(like(inventory.name, searchPattern));

    res.json({
      message: `Search results for "${searchQuery}"`,
      data: results,
      pagination: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (error) {
    console.error("Error searching inventory:", error);
    res.status(500).json({
      message: "Failed to search inventory items",
      error: error.message,
    });
  }
});

export default router;
