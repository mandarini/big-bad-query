require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");

const projectUrl = process.env.SUPABASE_URL;
const projectKey = process.env.SUPABASE_KEY;
const schema = process.env.SCHEMA_NAME || "public";
const maxAttempts = process.env.MAX_ATTEMPTS || 25;
const k = 1000;

const supabase = createClient(projectUrl, projectKey, { db: { schema: schema } });

const truncate = async () => {
  const { data, error } = await supabase
    .from("test_query")
    .delete()
    .eq("Field One", 1);
  if (error) console.error("[truncate] ERROR:", error);
};

const populate = async () => {
  const { data, error } = await supabase
    .from("test_query")
    .insert({});
  if (error) console.error("[populate] ERROR:", error);
};

const query = async (fields) => {
  const { data, error } = await supabase
    .from("test_query")
    .select(fields);
  if (error) console.error("[query] ERROR:", error);
};

const bigBadQuery = async (fields) => {
  for (let n = 1; n <= maxAttempts; n++) {
    let big = Array(n * Math.ceil(k / fields.length)).fill(fields).join(",");
    console.log(`[bigBadQuery] trying query.length ~ ${Math.trunc(big.length / k)}k (${big.length})`);
    const {data, error} = await supabase
      .from("test_query")
      .select(big)
      .eq("Field One", 1);
    if (error) {
      console.error("[bigBadQuery] ERROR:", error);
      throw error;
    } else
      console.log("[bigBadQuery] success");
  }
};

let baseFields = '"Field One", "Field Two", "Field Three", "Field Four", "Field Five"';

truncate()
  .then(() => populate())
  .then(() => query(baseFields))
  .then(() => bigBadQuery(baseFields))
  .then(() => console.log("test succeeded"))
  // .catch((error) => console.error("test failed"));
