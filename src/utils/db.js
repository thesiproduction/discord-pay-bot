const { createClient } = require('@supabase/supabase-js');

// Load from environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ---------------------- BALANCE FUNCTIONS ----------------------

// Get user balance
async function getBalance(userId) {
  const { data, error } = await supabase
    .from("balances")
    .select("balance")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") { // ignore "no rows"
    console.error("getBalance error:", error);
    return 0;
  }

  return data ? Number(data.balance) : 0;
}

// Set user balance
async function setBalance(userId, amount) {
  const { data, error } = await supabase
    .from("balances")
    .upsert(
      { user_id: userId, balance: Number(amount) },
      { onConflict: "user_id" }
    )
    .select();

  if (error) {
    console.error("setBalance error:", error);
    throw error;
  }

  return data[0].balance;
}

// Add balance
async function addBalance(userId, amount) {
  const current = await getBalance(userId);
  return await setBalance(userId, current + Number(amount));
}

// Subtract balance
async function subtractBalance(userId, amount) {
  const current = await getBalance(userId);
  if (current < amount) return false;
  await setBalance(userId, current - Number(amount));
  return true;
}

// ---------------------- DAILY REWARD FUNCTIONS ----------------------

// Get last daily claim
async function getLastDaily(userId) {
  const { data, error } = await supabase
    .from("balances")
    .select("last_daily")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") return null;
  return data ? data.last_daily : null;
}

// Update last daily claim
async function setLastDaily(userId) {
  const now = new Date().toISOString();
  await supabase
    .from("balances")
    .upsert(
      { user_id: userId, last_daily: now },
      { onConflict: "user_id" }
    );
}

module.exports = {
  getBalance,
  setBalance,
  addBalance,
  subtractBalance,
  getLastDaily,
  setLastDaily
};
