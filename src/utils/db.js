const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getBalance(userId) {
  const { data, error } = await supabase
    .from("balances")
    .select("amount, last_daily")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("getBalance error:", error);
    return { amount: 0, last_daily: null };
  }
  return data || { amount: 0, last_daily: null };
}

async function setBalance(userId, amount) {
  const { error } = await supabase
    .from("balances")
    .upsert({ user_id: userId, amount }, { onConflict: ["user_id"] });

  if (error) console.error("setBalance error:", error);
}

async function addBalance(userId, amount) {
  const bal = await getBalance(userId);
  await setBalance(userId, bal.amount + amount);
}

async function removeBalance(userId, amount) {
  const bal = await getBalance(userId);
  await setBalance(userId, Math.max(0, bal.amount - amount));
}

async function setLastDaily(userId, timestamp) {
  await supabase
    .from("balances")
    .upsert({ user_id: userId, last_daily: timestamp }, { onConflict: ["user_id"] });
}

module.exports = { getBalance, setBalance, addBalance, removeBalance, setLastDaily };
