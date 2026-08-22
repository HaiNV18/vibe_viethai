import { query, queryOne } from '../database/database.js';

export const AirlineRepository = {
  getAllActive() {
    return query("SELECT * FROM airlines WHERE active = 1 ORDER BY name ASC;");
  },

  findById(id) {
    return queryOne("SELECT * FROM airlines WHERE id = ?;", [id]);
  },

  findByCode(code) {
    return queryOne("SELECT * FROM airlines WHERE UPPER(code) = UPPER(?);", [code]);
  }
};
