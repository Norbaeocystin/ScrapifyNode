const chai = require('chai');
const scrapify = require("../src/index.js")

describe("scrapify", function () {    
    it("emails", async function () {  
        let response = await scrapify.getEmails('http://baralaboratory.com')
        let email = response[0]
        chai.assert.equal('baralaboratory@gmail.com', email)
    });
    it("social networks", async function () {  
        let response = await scrapify.getEmailsAndSNs('https://www.cas.sk/')
        let fb = response['facebook']
        let twitter = response['twitter']
        let insta = response['instagram']
        let links = ['https://www.facebook.com/novycas',
                     'https://twitter.com/novycassk',
                     'https://www.instagram.com/novycas/']
        let values = [fb, twitter, insta]
        chai.assert.notStrictEqual(links, values)
    });
    it("email and social networks", async function () {  
        let response = await scrapify.getEmailsAndSNs('https://exponea.com')
        let fb = response['facebook']
        let twitter = response['twitter']
        let insta = response['instagram']
        let linkedin = response['linkedin']
        let links = ['https://www.instagram.com/exponea_com/',
                     'https://www.facebook.com/exponea',
                    'https://twitter.com/exponea',
                'https://www.linkedin.com/company/exponea']
        let email = response['Emails'][0]
        let values = [fb, twitter, insta, linkedin]
        chai.assert.notStrictEqual(links, values)
        chai.assert.equal('info@exponea.com', email)
    });
    it("emails", async function () {  
        let response = await scrapify.getEmailsAndSNs('https://www.grahams.sk/realitny-team')
        let emails = response['Emails']
        let length = emails.length
        let boolean = emails.length > 1
        chai.assert.equal(true, boolean)
    });
});
