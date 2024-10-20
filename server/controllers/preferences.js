const {pool} = require('../config/db');

const setPreferences = async (req, res) => {
   try {
      const { ageGroup, gender, startDate, endDate, category } = req.body;
      const userId = req.user.id; 

      await pool.query(
         `INSERT INTO user_preferences (user_id, age_group, gender, start_date, end_date, category) 
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id) 
         DO UPDATE SET age_group = $2, gender = $3, start_date = $4, end_date = $5, category = $6`,
         [userId, ageGroup, gender, startDate, endDate, category]
      );

      res.status(200).json({ message: 'Preferences saved' });
   } catch (error) {
      console.error('Error saving preferences:', error);
      res.status(500).json({ error: 'Failed to save preferences' });
   }
};

const getPreferences = async (req, res) => {
   try {
      const userId = req.user.id;
      const result = await pool.query(
         `SELECT age_group, gender, start_date, end_date, category FROM user_preferences WHERE user_id = $1`,
         [userId]
      );

      if (result.rows.length > 0) {
         res.status(200).json({ preferences: result.rows[0] });
      } else {
         res.status(404).json({ message: 'No preferences found' });
      }
   } catch (error) {
      console.error('Error retrieving preferences:', error);
      res.status(500).json({ error: 'Failed to retrieve preferences' });
   }
};

const clearPreferences = async (req, res) => {
   try {
      const userId = req.user.id;
      await pool.query(`DELETE FROM user_preferences WHERE user_id = $1`, [userId]);

      res.status(200).json({ message: 'Preferences cleared' });
   } catch (error) {
      console.error('Error clearing preferences:', error);
      res.status(500).json({ error: 'Failed to clear preferences' });
   }
};

module.exports = { setPreferences, getPreferences, clearPreferences };
