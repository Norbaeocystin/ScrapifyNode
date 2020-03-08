const request = require('request-promise')
const emailPattern = /([-a-zA-Z0-9.`?{}]+@[-a-zA-Z0-9.`?{}]+[.\w+]+)/g
// add more if needed
const socialNetworks = ['facebook', 'twitter', 'linkedin', 'instagram']
const sn = socialNetworks.map(social => social + '[.]com')
const socialNetworksPattern = new RegExp(sn.join('|'))
const filter = ['gif$', 'png$', '.peg$', 'jpg$','mp3$', 'example', 'yourname', 'template', 'javascript']
const filterPattern = new RegExp(filter.join("|"))

async function get (url) {
  const response = await request(url)
  return response
}

async function getEmails (url) {
  const html = await get(url)
  let emails = html.match(emailPattern)
  if (emails){
    emails = emails.filter(email => !(email.match(filterPattern)))
    if (emails.length > 0){
      return Array.from( new Set(emails))
      }
    }
}

function getSocialNetworksFromHTMLText (text) {
  var splits = text.split('<a')
  let result = {}
  if (splits) {
    splits = splits.map(split => split.split('>')[0])
    splits = splits.filter(split => split.match(socialNetworksPattern))
    result = {}
    for (const split of splits) {
      const link = split.split('href="')[1].split('"')[0]
      for (const socnet of socialNetworks) {
        if (link.includes(socnet)) {
          result[socnet] = link.split('?')[0]
          break
        }
      }
    }
  }
  return result
}

async function getEmailsAndSNs (url) {
  const html = await get(url)
  let emails = html.match(emailPattern)
  const sns = getSocialNetworksFromHTMLText(html)
  if (emails){
    emails = emails.filter(email => !(email.match(filterPattern)))
    if (emails.length > 0){
      sns.Emails = Array.from( new Set(emails))
      }
    }
  return sns
}

module.exports = {
  getEmails: getEmails,
  getEmailsAndSNs: getEmailsAndSNs
}
