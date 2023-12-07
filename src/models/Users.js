const sql = require("sql");

const { connection } = require("../db/connect");
const CustomError = require("../errors");

class Users {
  constructor() {
    this.users = [];
  }

  async create(userList) {
    this.users = userList.map((user) => {
      if (!user.name.firstName || !user.name.lastName || !user.age) {
        throw new CustomError.BadRequestError(
          "Please provide all required fields"
        );
      }
      const userSchema = {
        full_name: "",
        age: null,
        address: {},
        additional_info: {},
      };

      for (const key in user) {
        switch (key) {
          case "name": {
            userSchema.full_name = `${user.name.firstName} ${user.name.lastName}`;
            break;
          }
          case "age": {
            userSchema.age = user.age;
            break;
          }
          case "address": {
            userSchema.address = user.address;
            break;
          }
          default:
            {
              userSchema.additional_info[key] = user[key];
            }
            break;
        }
      }

      return userSchema;
    });

    let User = sql.define({
      name: "users",
      columns: ["full_name", "age", "address", "additional_info"],
    });

    let usersInsertQuery = User.insert(this.users).toQuery();

    await connection.query(usersInsertQuery);
  }

  async deleteAll() {
    await connection.query("DELETE FROM users");
  }

  async calculateAgeDistribution() {
    const data = await connection.query(
      `SELECT CASE
        WHEN age < 20 THEN '< 20'
        WHEN age BETWEEN 20 AND 40 THEN '20 to 40'
        WHEN age BETWEEN 40 AND 60 THEN '40 to 60'
        WHEN age > 60 THEN '> 60'
          END AS age_group,
          ROUND((Count(*) / all_users.total::numeric * 100), 2) AS age_distribution
      FROM users
          CROSS JOIN (
              SELECT COUNT(*) AS total
              FROM users
          ) AS all_users
      GROUP BY age_group,
          all_users.total`
    );

    return data.rows;
  }
}

module.exports = Users;
