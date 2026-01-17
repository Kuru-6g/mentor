/**
 * MongoDB Backend Integration
 * 
 * This file handles MongoDB connection and operations.
 * Replace the MONGODB_URI with your actual MongoDB connection string.
 */

import { MongoClient } from "npm:mongodb@6";

// MongoDB connection string - Replace with your actual connection string
const MONGODB_URI = "mongodb+srv://admin:dJRCqCu7EIiOSHAf@topvoice.rhuvlxf.mongodb.net";
const DB_NAME = "topvoice";

let client: MongoClient | null = null;

// Get MongoDB client (singleton pattern)
export async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");
  }
  return client;
}

// Get database
export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(DB_NAME);
}

// Collections
export async function getUsersCollection() {
  const db = await getDatabase();
  return db.collection("users");
}

export async function getMentorsCollection() {
  const db = await getDatabase();
  return db.collection("mentors");
}

export async function getSessionsCollection() {
  const db = await getDatabase();
  return db.collection("sessions");
}

export async function getSessionRequestsCollection() {
  const db = await getDatabase();
  return db.collection("session_requests");
}

export async function getAchievementsCollection() {
  const db = await getDatabase();
  return db.collection("achievements");
}

export async function getReviewsCollection() {
  const db = await getDatabase();
  return db.collection("reviews");
}

export async function getMentorshipRequestsCollection() {
  const db = await getDatabase();
  return db.collection("mentorship_requests");
}
