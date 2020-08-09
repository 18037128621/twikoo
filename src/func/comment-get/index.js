const tcb = require('tcb-admin-node')
const md5 = require('blueimp-md5')

const app = tcb.init({
  env: tcb.getCurrentEnv()
})
const db = app.database()
const _ = db.command

/**
 * 获取评论
 * @param {String} event.url 评论页地址
 */
exports.main = async (event, context) => {
  const res = {}
  try {
    validate(event)
  } catch (e) {
    res.message = e.message
    return res
  }
  const data = await db
    .collection('comment')
    .where({
      url: event.url,
      isSpam: _.neq(true)
    })
    .orderBy('created', 'desc')
    .get()
  res.data = parse(data.data)
  return res
}

/**
 * 筛除隐私字段
 */
function parse (comments) {
  const result = []
  for (const comment of comments) {
    result.push({
      id: comment._id,
      nick: comment.nick,
      mailMd5: comment.mailMd5 || md5(comment.mail),
      link: comment.link,
      comment: comment.comment,
      ua: comment.ua,
      master: comment.master,
      created: comment.created,
      updated: comment.updated
    })
  }
  return result
}

/**
 * 请求参数校验
 */
function validate (event) {
  const requiredParams = ['url']
  for (const requiredParam of requiredParams) {
    if (!event[requiredParam]) {
      throw new Error(`参数"${requiredParam}"不合法`)
    }
  }
}
