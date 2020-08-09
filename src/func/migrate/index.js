const tcb = require('tcb-admin-node')

const collections = [
  'comment',
  'config',
  'counter'
]

const app = tcb.init({
  env: tcb.getCurrentEnv()
})
const db = app.database()

/**
 * 建立数据库 collections
 */
exports.main = async (event, context) => {
  const res = {}
  for (const collection of collections) {
    res[collection] = await db.createCollection(collection)
  }

  return res
}
