require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getBalance(userId) {
  const { data, error } = await supabase
    .from("balances")
    .select("amount")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error(error);
    return null;
  }

  return data ? data.amount : 0;
}

async function setBalance(userId, amount) {
  const { error } = await supabase
    .from("balances")
    .upsert({ user_id: userId, amount }, { onConflict: "user_id" });

  if (error) {
    console.error(error);
    return null;
  }

  return amount;
}

async function addBalance(userId, amount) {
  const current = await getBalance(userId);
  return await setBalance(userId, current + amount);
}

async function subtractBalance(userId, amount) {
  const current = await getBalance(userId);
  if (current < amount) return null;
  return await setBalance(userId, current - amount);
}

module.exports = { getBalance, setBalance, addBalance, subtractBalance };
