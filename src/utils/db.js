const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getBalance(userId) {
  const { data, error } = await supabase
    .from('balances')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(error);
    return 0;
  }

  return data ? data.balance : 0;
}

async function setBalance(userId, amount) {
  const { data, error } = await supabase
    .from('balances')
    .upsert({ user_id: userId, balance: amount }, { onConflict: 'user_id' })
    .select();

  if (error) {
    console.error(error);
  }

  return data ? data[0].balance : amount;
}

async function addBalance(userId, amount) {
  const current = await getBalance(userId);
  return await setBalance(userId, current + amount);
}

async function canClaimDaily(userId) {
  const { data, error } = await supabase
    .from('balances')
    .select('last_daily')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(error);
    return { allowed: false };
  }

  if (!data || !data.last_daily) {
    return { allowed: true };
  }

  const lastClaim = new Date(data.last_daily);
  const now = new Date();

  const diff = now - lastClaim;
  const hoursPassed = diff / (1000 * 60 * 60);

  return { allowed: hoursPassed >= 24 };
}

async function updateDaily(userId) {
  const { error } = await supabase
    .from('balances')
    .update({ last_daily: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) console.error(error);
}

module.exports = {
  getBalance,
  setBalance,
  addBalance,
  canClaimDaily,
  updateDaily
};
