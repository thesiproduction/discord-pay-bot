const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getBalance(userId) {
  let { data, error } = await supabase
    .from('balances')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return 0; // default if user not found
  }

  return data.balance;
}

async function setBalance(userId, amount) {
  let { data, error } = await supabase
    .from('balances')
    .upsert({ user_id: userId, balance: amount }, { onConflict: 'user_id' })
    .select();

  if (error) {
    console.error(error);
    return null;
  }
  return data[0];
}

async function addBalance(userId, amount) {
  const balance = await getBalance(userId);
  return await setBalance(userId, balance + amount);
}

async function removeBalance(userId, amount) {
  const balance = await getBalance(userId);
  if (balance < amount) return null;
  return await setBalance(userId, balance - amount);
}

async function getLastDaily(userId) {
  let { data, error } = await supabase
    .from('balances')
    .select('last_daily')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data.last_daily;
}

async function setLastDaily(userId, timestamp) {
  let { error } = await supabase
    .from('balances')
    .upsert({ user_id: userId, last_daily: timestamp }, { onConflict: 'user_id' });

  if (error) console.error(error);
}

module.exports = { getBalance, setBalance, addBalance, removeBalance, getLastDaily, setLastDaily };
