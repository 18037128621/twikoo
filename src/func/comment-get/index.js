const tcb = require('tcb-admin-node')

const app = tcb.init({
  env: tcb.getCurrentEnv()
})
const db = app.database()

/**
 * 获取评论
 * @param {String} event.url 评论页地址
 */
exports.main = async (event, context) => {
  const res = {}
  const data = await db
    .collection('comment')
    .where({ url: event.url })
    .get()
  res.data = parse(data)
  return res
}

function parse (comments) {
  const result = []
  for (const comment of comments) {
    result.push({
      id: comment._id
    })
  }
  return result
}
