const nodemailer = require('nodemailer')
const tcb = require('@cloudbase/node-sdk')
const app = tcb.init({ env: tcb.SYMBOL_CURRENT_ENV })
const db = app.database()

// 使用全局变量，短时间内发送多封邮件，只需初始化一次
let config
let transporter

async function init () {
  try {
    config = await db
      .collection('config')
      .limit(1)
      .get()
      .data[0]
    if (!config) throw new Error('数据库配置不存在')
    transporter = nodemailer.createTransport({
      service: config.SMTP_SERVICE,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
      }
    })
    transporter.verify(function (error, success) {
      if (error) throw new Error('SMTP 邮箱配置异常：', error)
      else if (success) console.log('SMTP 邮箱配置正常')
    })
  } catch (e) {
    console.error('邮件初始化异常：', e.message)
  }
}

exports.notice = async (comment) => {
  if (!config) await init()
  const SITE_NAME = config.SITE_NAME
  const NICK = comment.get('nick')
  const COMMENT = comment.get('comment')
  const SITE_URL = config.SITE_URL
  const POST_URL = SITE_URL + comment.get('url')
  const emailSubject = config.MAIL_SUBJECT_ADMIN || `${SITE_NAME}上有新评论了`
  const emailContent = config.MAIL_TEMPLATE_ADMIN || `
    <div style="border-top:2px solid #12addb;box-shadow:0 1px 3px #aaaaaa;line-height:180%;padding:0 15px 12px;margin:50px auto;font-size:12px;">
      <h2 style="border-bottom:1px solid #dddddd;font-size:14px;font-weight:normal;padding:13px 0 10px 8px;">
        您在<a style="text-decoration:none;color: #12addb;" href="${SITE_URL}" target="_blank">${SITE_NAME}</a>上的文章有了新的评论
      </h2>
      <p><strong>${NICK}</strong>回复说：</p>
      <div style="background-color: #f5f5f5;padding: 10px 15px;margin:18px 0;word-wrap:break-word;">${COMMENT}</div>
      <p>您可以点击<a style="text-decoration:none; color:#12addb" href="${POST_URL}" target="_blank">查看回复的完整內容</a><br></p>
    </div>`
  let sendResult
  try {
    sendResult = await transporter.sendMail({
      from: `"${config.SENDER_NAME}" <${config.SENDER_EMAIL}>`,
      to: config.BLOGGER_EMAIL || config.SENDER_EMAIL,
      subject: emailSubject,
      html: emailContent
    })
  } catch (e) {
    sendResult = e
  }
  console.log(sendResult)
  return sendResult
}

exports.send = async (currentComment, parentComment) => {
  if (!config) await init()
  const PARENT_NICK = parentComment.get('nick')
  const SITE_NAME = config.SITE_NAME
  const NICK = currentComment.get('nick')
  const COMMENT = currentComment.get('comment')
  const PARENT_COMMENT = parentComment.get('comment')
  const POST_URL = config.SITE_URL + currentComment.get('url') + '#' + currentComment.get('objectId')
  const SITE_URL = config.SITE_URL
  const emailSubject = config.MAIL_SUBJECT || `${PARENT_NICK}，您在『${SITE_NAME}』上的评论收到了回复`
  const emailContent = config.MAIL_TEMPLATE || `
    <div style="border-top:2px solid #12ADDB;box-shadow:0 1px 3px #AAAAAA;line-height:180%;padding:0 15px 12px;margin:50px auto;font-size:12px;">
      <h2 style="border-bottom:1px solid #dddddd;font-size:14px;font-weight:normal;padding:13px 0 10px 8px;">
        您在<a style="text-decoration:none;color: #12ADDB;" href="${SITE_URL}" target="_blank">${SITE_NAME}</a>上的评论有了新的回复
      </h2>
      ${PARENT_NICK} 同学，您曾发表评论：
      <div style="padding:0 12px 0 12px;margin-top:18px">
        <div style="background-color: #f5f5f5;padding: 10px 15px;margin:18px 0;word-wrap:break-word;">${PARENT_COMMENT}</div>
        <p><strong>${NICK}</strong>回复说：</p>
        <div style="background-color: #f5f5f5;padding: 10px 15px;margin:18px 0;word-wrap:break-word;">${COMMENT}</div>
        <p>
          您可以点击<a style="text-decoration:none; color:#12addb" href="${POST_URL}" target="_blank">查看回复的完整內容</a>，
          欢迎再次光临<a style="text-decoration:none; color:#12addb" href="${SITE_URL}" target="_blank">${SITE_NAME}</a>。<br>
        </p>
      </div>
    </div>`
  let sendResult
  try {
    sendResult = await transporter.sendMail({
      from: `"${config.SENDER_NAME}" <${config.SENDER_EMAIL}>`,
      to: parentComment.get('mail'),
      subject: emailSubject,
      html: emailContent
    })
  } catch (e) {
    sendResult = e
  }
  console.log(sendResult)
  return sendResult
}
