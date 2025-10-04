require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ✅ Get balance of a user
async function getBalance(userId) {
  const { data, error } = await supabase
    .from("balances")
    .select("amount")
    .eq("user_id", userId)   // 👈 FIXED (snake_case)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error(error);
    return null;
  }

  return data ? data.amount : 0;
}

// ✅ Add balance to a user
async function addBalance(userId, amount) {
  const current = await getBalance(userId);
  const newBalance = current + amount;

  const { error } = await supabase
    .from("balances")
    .upsert({ user_id: userId, amount: newBalance }, { onConflict: "user_id" });

  if (error) {
    console.error(error);
    return null;
  }

  return newBalance;
}

// ✅ Subtract balance
async function subtractBalance(userId, amount) {
  const current = await getBalance(userId);
  if (current < amount) return null;

  const newBalance = current - amount;

  const { error } = await supabase
    .from("balances")
    .upsert({ user_id: userId, amount: newBalance }, { onConflict: "user_id" });

  if (error) {
    console.error(error);
    return null;
  }

  return newBalance;
}

module.exports = { getBalance, addBalance, subtractBalance };
