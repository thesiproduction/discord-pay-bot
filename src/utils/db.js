const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getBalance(userId) {
  const { data, error } = await supabase
    .from("balances")
    .select("amount")
    .eq("userId", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ? data.amount : 0;
}

async function setBalance(userId, amount) {
  const { error } = await supabase
    .from("balances")
    .upsert({ userId, amount }, { onConflict: "userId" });

  if (error) throw error;
}

async function addBalance(userId, amount) {
  const current = await getBalance(userId);
  await setBalance(userId, current + amount);
  return current + amount;
}

module.exports = { getBalance, setBalance, addBalance };
