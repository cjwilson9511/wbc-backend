import dotenv from 'dotenv';
dotenv.config(); // This loads values from .env into process.env
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

app.post('/api/create-user', async (req, res) => {
  const { email, display_name } = req.body;

  try {
    // Create user in Supabase Auth
    const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { display_name },
    });

    if (createError) return res.status(400).json({ error: createError.message });

    const user = data.user; // Correct extraction of user object

    // Check if player already exists in public_players table
    const { data: existingPlayer, error: fetchError } = await supabaseAdmin
      .from('public_players')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    // If error other than "not found", return error
    if (fetchError && fetchError.code !== 'PGRST116') {
      return res.status(500).json({ error: fetchError.message });
    }

    // If player doesn't exist, insert new record
    if (!existingPlayer) {
      const { error: insertError } = await supabaseAdmin
        .from('public_players')
        .insert({
          user_id: user.id,
          display_name,
          email,
        });

      if (insertError) return res.status(400).json({ error: insertError.message });
    }

    res.status(201).json({ message: 'User and player created (if not existing)', user_id: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
