const request = require('request-promise')
const emailPattern = /([-a-zA-Z0-9.`?{}]+@[-a-zA-Z0-9.`?{}]+[.\w+]+)/g
// add more if needed
const socialNetworks = ['facebook', 'twitter', 'linkedin', 'instagram']
const sn = socialNetworks.map(social => social + '[.]com')
const socialNetworksPattern = new RegExp(sn.join('|'))
const filter = ['gif$', 'png$', '.peg$', 'jpg$', 'mp3$', 'example', 'yourname', 'template', 'javascript']
const filterPattern = new RegExp(filter.join('|'))

async function get (url) {
  const response = await request(url)
  return response
}

async function getEmails (url) {
  const html = await get(url)
  let emails = html.match(emailPattern)
  if (emails) {
    emails = emails.filter(email => !(email.match(filterPattern)))
  }
  if (!emails) {
    emails = []
  }
  try {
    let contactUrl = getContactUrl(html)
    if (contactUrl) {
      if (!contactUrl.includes('https')) {
        contactUrl = new URL(contactUrl, url).href
      }
      const html2 = await get(contactUrl)
      let emails2 = html2.match(emailPattern)
      if (emails2) {
        emails2 = emails2.filter(email => !(email.match(filterPattern)))
        if (emails2) {
          emails.push(...emails2)
        }
      }
    }
  } catch (e) {}
  if (emails) {
    return Array.from(new Set(emails))
  }
}

function getContactUrl (text) {
  text = text.replace(/'/g, '"')
  var splits = text.split('<a')
  if (splits) {
    splits = splits.map(split => split.split('>')[0])
    splits = splits.filter(split => split.match('onta'))
    if (splits) {
      splits = splits.map(split => split.replace(/'/g, "'").split('href="')[1].split('"')[0])
      const first = Array.from(new Set(splits)).sort()[0]
      return first
    }
  }
}

function getSocialNetworksFromHTMLText (text) {
  text = text.replace(/'/g, '"')
  var splits = text.split('<a')
  let result = {}
  if (splits) {
    splits = splits.map(split => split.split('>')[0])
    splits = splits.filter(split => split.match(socialNetworksPattern))
    result = {}
    for (const split of splits) {
      const link = split.replace(/'/g, "'").split('href="')[1].split('"')[0]
      for (const socnet of socialNetworks) {
        if (link.includes(socnet)) {
          result[socnet] = link
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
  if (emails) {
    emails = emails.filter(email => !(email.match(filterPattern)))
  }
  if (!emails) {
    emails = []
  }
  try {
    let contactUrl = getContactUrl(html)
    if (contactUrl) {
      if (!contactUrl.includes('https')) {
        contactUrl = new URL(contactUrl, url).href
      }
      const html2 = await get(contactUrl)
      let emails2 = html2.match(emailPattern)
      if (emails2) {
        emails2 = emails2.filter(email => !(email.match(filterPattern)))
        if (emails2) {
          emails.push(...emails2)
        }
      }
    }
  } catch (e) {}
  if (emails) {
    sns.Emails = Array.from(new Set(emails))
  }
  return sns
}

module.exports = {
  getEmails: getEmails,
  getEmailsAndSNs: getEmailsAndSNs
}
