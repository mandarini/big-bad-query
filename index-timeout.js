require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");

const projectUrl = process.env.SUPABASE_URL;
const projectKey = process.env.SUPABASE_KEY;
const schema = process.env.SCHEMA_NAME || "public";

// Create client WITH timeout protection
const supabase = createClient(projectUrl, projectKey, {
  db: {
    schema: schema,
    timeout: 2000  // 2 second timeout
  }
});

console.log("🚀 Timeout Protection Demo");
console.log("===========================\n");
console.log("Client configured with timeout: 2000ms");
console.log("This protects against indefinitely hanging requests.\n");

const demoTimeout = async () => {
  const fields = '"Field One", "Field Two", "Field Three"';
  const big = Array(10).fill(fields).join(","); // Create ~300 char query

  console.log(`Making query (length: ${big.length} chars)...`);
  console.log("If server is slow/unresponsive, request will abort after 2s\n");

  const {data, error} = await supabase
    .from("test_query")
    .select(big)
    .eq("Field One", 1);

  if (error) {
    console.error("❌ Request failed:");
    console.log("\n📊 Error Analysis:");
    console.log("  Code:", error.code || "(generic error)");
    console.log("  Hint:", error.hint || "(no hint)");
    console.log("  Message:", error.message);

    if (error.code === 'PGRST_TIMEOUT') {
      console.log("\n✅ Timeout protection worked!");
      console.log("   Request was aborted after 2 seconds as configured.");
    }
  } else {
    console.log("✅ Success! Server responded within timeout.");
    console.log(`   Returned ${data?.length || 0} rows`);
  }
};

demoTimeout()
  .then(() => console.log("\n✅ Demo completed"))
  .catch((error) => console.error("\n❌ Demo failed:", error.message));
