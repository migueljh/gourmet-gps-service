import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

const YELP_API_KEY = process.env.YELP_API_KEY;

const YELP_BASE_URL = "https://api.yelp.com/v3";

const yelpApi = axios.create({
  baseURL: YELP_BASE_URL,
  headers: {
    Authorization: `Bearer ${YELP_API_KEY}`,
  },
});

app.get("/api/restaurants", async (req: Request, res: Response) => {
  try {
    const { location, latitude, longitude } = req.query;

    const response = await yelpApi.get("/businesses/search", {
      params: {
        location,
        latitude,
        longitude,
        limit: 10,
        sort_by: "best_match",
      },
    });
    res.json(response.data);
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
});

app.get("/api/restaurants/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await yelpApi.get(`/businesses/${id}`);
    res.json(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
});

app.get("/api/restaurants/:id/reviews", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await yelpApi.get(`/businesses/${id}/reviews`, {
      params: {
        limit: 20,
        offset: 10,
        sort_by: "yelp_sort",
      },
    });
    res.json(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
