import { variables } from "./utils/config";
import path from "path";
import mongoose from "mongoose";

console.log("\n🔍 Testing Environment Configuration:\n");

// Basic environment info
console.log("System Information:");
console.log("- OS:", process.platform);
console.log("- Node Version:", process.version);
console.log("- Environment:", variables.NODE_ENV);

// Connection strings
console.log("\nConnections:");
console.log("- MongoDB URI:", variables.MONGO_URI);
console.log("- CORS Origin:", variables.CORS_ORIGIN);

// API Keys and Configurations
console.log("\nAPI Keys and Configurations:");
console.log(
  "- JWT Secret:",
  variables.JWT_TOKEN_SECRET ? "✅ Set" : "❌ Missing"
);
console.log(
  "- Razorpay Key ID:",
  variables.RAZORPAY_KEY_ID ? "✅ Set" : "❌ Missing"
);
console.log(
  "- Razorpay Secret:",
  variables.RAZORPAY_KEY_SECRET ? "✅ Set" : "❌ Missing"
);

// Cloudinary Configuration
console.log("\nCloudinary Configuration:");
console.log(
  "- Cloud Name:",
  variables.CLOUDINARY_CONFIG.cloud_name ? "✅ Set" : "❌ Missing"
);
console.log(
  "- API Key:",
  variables.CLOUDINARY_CONFIG.api_key ? "✅ Set" : "❌ Missing"
);
console.log(
  "- API Secret:",
  variables.CLOUDINARY_CONFIG.api_secret ? "✅ Set" : "❌ Missing"
);

// File paths
console.log("\nFile System:");
console.log("- Current Directory:", process.cwd());
console.log("- Uploads Directory:", path.join(process.cwd(), "uploads"));

// Test database connection
async function testDbConnection() {
  console.log("\nTesting Database Connection...");
  try {
    await mongoose.connect(variables.MONGO_URI);
    console.log("✅ Database connection successful");
    await mongoose.disconnect();
    console.log("✅ Database disconnection successful");
  } catch (error) {
    console.error(
      "❌ Database connection failed:",
      error instanceof Error ? error.message : error
    );
  }
}

// Run tests
async function runTests() {
  try {
    await testDbConnection();
    console.log("\n✅ Environment test complete!");
  } catch (error) {
    console.error(
      "\n❌ Test failed:",
      error instanceof Error ? error.message : error
    );
  } finally {
    console.log("\nTest Summary:");
    console.log("- Environment variables loaded:", variables ? "✅" : "❌");
    console.log("- MongoDB connection test completed");
    console.log("- Configuration validation completed");
  }
}

runTests();
