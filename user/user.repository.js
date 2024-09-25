const UserModel = require('./user.model');

/**
 * @typedef {{
 *   filter: object,
 *   limit: number,
 *   skip: number,
 *   sort: object,
 *   select: object,
 * }} Query
 *
 * @typedef {import('./user.model').User } User
 */

/**
 * Returns a list of users.
 *
 * @param {Query} query
 *
 * @returns {Promise<User[]>} a list of users.
 */
async function find(query) {
    return UserModel.find(query.filter)
        .limit(query.limit)
        .skip(query.skip)
        .sort(query.sort)
        .select(query.select)
        .exec();
}

module.exports = { find };
